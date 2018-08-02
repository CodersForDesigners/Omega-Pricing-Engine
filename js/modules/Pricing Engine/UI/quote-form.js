
// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Quote Widget
	__UI.$quoteFormSection = $( ".js_quote_form_section" );
	__UI.$customersNames = __UI.$quoteFormSection.find( ".js_customers_names" );
	__UI.$createQuoteButton = __UI.$quoteFormSection.find( ".js_create_quote" );

} );




/*
 *
 * When a unit is view, reset the quote form
 *
 */
$( document ).on( "unit/view", function () {

	__UI.$quoteFormSection.find( "form" ).get( 0 ).reset();
	__UI.$customersNames.text( "" );
	__UI.$createQuoteButton.prop( "disabled", true );

} );


/*
 *
 * On submitting the user search form
 *
 */
$( document ).on( "submit", ".js_user_search_form", function ( event ) {

	/* -----
	 * Prevent the default form submission behaviour
	 * 	which triggers the loading of a new page
	 ----- */
	event.preventDefault();

	// Get a reference to the form element
	var $form = $( event.target );

	/* -----
	 * Disable the form
	 ----- */
	$form.find( "input, button" ).prop( "disabled", true );
	$form.find( "[ type = 'submit' ]" ).text( "Searching" );

	/* -----
	 * Pull the data from the form
	 ----- */
	// User's ID
	$userId = $form.find( "[ name = 'user-id' ]" );

	/* -----
	 * Validate the data
	 ----- */
	// Remove any prior "error"s
	$form.find( ".js_error" ).removeClass( "js_error" );
	// Name
	if ( ! $userId.val().trim() ) {
		$name.addClass( "js_error" );
		$name.parent().addClass( "validation-error" );
		alert( "Please provide the customer's ID." );
	}
	// If the form has even one error ( i.e. validation issue )
	// do not proceed
	if ( $form.find( ".js_error" ).length ) {
		$form.find( "input, select, button" ).prop( "disabled", false );
		$form.find( "[ type = 'submit' ]" ).text( "Search" );
		return;
	}

	/* -----
	 * Process and Assemble the data
	 ----- */
	var userId = $userId.val().trim();

	/* -----
	 * Store the data on the side
	 ----- */
	__OMEGA.customer = { uid: userId }

	/* -----
	 * Process the data
	 ----- */
	// Update the user
	getUser( userId, { by: 'uid' } )
		.then( function ( user ) {

			__UI.$quoteFormSection.find( ".js_create_quote" ).prop( "disabled", false );
			var applicantsNames = user.name;
			if ( user.coApplicantName )
				applicantsNames += " and " + user.coApplicantName;

			__UI.$customersNames.text( applicantsNames );

			$form.find( "input, select, button" ).prop( "disabled", false );
			$form.find( "[ type = 'submit' ]" ).text( "Search" );

			__OMEGA.customer = Object.assign( __OMEGA.customer, user );

		} )
		.catch( function ( e ) {
			notify( e.message, {
				level: "error",
				context: "Quote Form"
			} );
			$form.find( "input, select, button" ).prop( "disabled", false );
			$form.find( "[ type = 'submit' ]" ).text( "Search" );
		} );

} );


/*
 *
 * On submitting the quote form
 *
 */
$( document ).on( "click", ".js_create_quote", function ( event ) {

	/* -----
	 * Disable the form
	 ----- */
	__UI.$quoteFormSection.find( "input, button" ).prop( "disabled", true );

	/* -----
	 * Assemble the data
	 ----- */
	var customer = __OMEGA.customer;


	var meta = __OMEGA.settings;
	var crm = getDataFromSheet( __OMEGA.workbook.Sheets[ "Output (CRM)" ] );
	// var mail = getDataFromSheet( __OMEGA.workbook.Sheets[ "Output (Mail)" ] );

	var quote = {
		timestamp: getDateAndTimeStamp(),
		meta: meta,
		user: __OMEGA.user,
		crm: crm,
		unit: __OMEGA.unitData,
		pdf: getComputedUnitData()
		// mail: mail,
		// ...
	};

	makeAQuote( quote )
		.then( function () {
			notify( "The quote has been made. It will accessible on the CRM shortly.", {
				level: "info",
				context: "Quote Form"
			} );
			// Re-enable the form
			__UI.$quoteFormSection.find( "input, button" ).prop( "disabled", false );
		} )
		.catch( function () {
			notify( "Something went wrong. Please try again after a while.", {
				level: "error",
				context: "Quote Form"
			} );
			// Re-enable the form
			__UI.$quoteFormSection.find( "input, button" ).prop( "disabled", false );
		} )

} );





function makeAQuote ( quote ) {

	var ajaxRequest = $.ajax( {
		url: __OMEGA.settings[ "API Endpoint" ] + "/quotes",
		method: "POST",
		data: JSON.stringify( quote ),
		contentType: "application/json",
		dataType: "json",
		xhrFields: {
			withCredentials: true
		}
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {
			resolve();
		} )

		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var statusCode = -1;
			var message;
			if ( jqXHR.responseJSON ) {
				statusCode = jqXHR.responseJSON.statusCode;
				message = jqXHR.responseJSON.message;
			}
			else if ( typeof e == "object" ) {
				message = e.stack;
			}
			else {
				message = jqXHR.responseText;
			}
			reject( { code: statusCode, message: message } );
		} );

	} );

}
