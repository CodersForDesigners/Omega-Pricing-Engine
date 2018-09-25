
// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Enquiry form Widget
	__UI.$enquiryFormSection = $( ".js_enquiry_form_section" );
	__UI.$enquiryForm = __UI.$enquiryFormSection.find( ".js_enquiry_form" );
	__UI.$makeEnquiryButton = __UI.$enquiryForm.find( "[ type = 'submit' ]" );

} );






/*
 *
 * When a unit is viewed,
 *	"Show" the quote form ( different from "enable" ) if,
 *		1. The user is logged in.
 *
 */
$( document ).on( "enquiry-form/show", function () {

	if ( isUserLoggedIn() )
		__UI.$enquiryFormSection.removeClass( "hidden" );

} );



/*
 *
 * When a unit is viewed,
 *	Issue a request to enable the quote form **if** the user is logged in
 *
 */
$( document ).on( "unit/view/done", function () {

	if ( isUserLoggedIn() )
		$( document ).trigger( "enquiry-form/enable" );

} );



/*
 *
 * When the enquiry form is to enabled,
 *	enable it only if all the conditions are met
 *
 */
$( document ).on( "enquiry-form/enable", function () {

	__UI.$makeEnquiryButton.prop( "disabled", false );
	__UI.$makeEnquiryButton.text( function () { return $( this ).data( "init" ) } );
	__UI.$enquiryForm.find( "input, select, button" ).prop( "disabled", false );
	// Make sure to disable the phone field
	__UI.$enquiryForm.find( "[ name = 'phone' ]" ).prop( "disabled", true );

	// Pre-fill the Enquiry Form with the user's phone number ( and name if applicable )
	if ( __OMEGA.user.lastName )
		setUserInformationToForm( __OMEGA.user, __UI.$enquiryForm );
	else
		getUser( isUserLoggedIn() )
			.then( function ( user ) {
				setUserInformationToForm( user, __UI.$enquiryForm );
			} );

} );

function setUserInformationToForm ( user, $form ) {
	// Phone number
	$form.find( "[ name = 'phone' ]" ).val( user.phoneNumber );
	// Email
	$form.find( "[ name = 'email' ]" ).val( user.email );
	// Name ( if applicable )
	if ( ! user.name.startsWith( __OMEGA.settings.userImplicitNamePrefix ) )
		$form.find( "[ name = 'name' ]" ).val( user.name );
}



/*
 *
 * On submitting the action form ( i.e. user details )
 *
 */
$( document ).on( "submit", ".js_enquiry_form", function ( event ) {

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
	$form.find( "input, select, button" ).prop( "disabled", true );

	/* -----
	 * Pull the data from the form
	 ----- */
	// name
	$name = $form.find( "[ name = 'name' ]" );
	// email
	$email = $form.find( "[ name = 'email' ]" );

	/* -----
	 * Validate the data
	 ----- */
	// Remove any prior "error"s
	$form.find( ".js_error" ).removeClass( "js_error" );
	// Initialize a validation error message
	var validationErrorMessage = "Please provide";
	// Name
	if ( ! $name.val().trim() ) {
		$name.addClass( "js_error" );
		$name.parent().addClass( "validation-error" );
		validationErrorMessage += " your name";
	}
	// If the form has even one error ( i.e. validation issue )
	// do not proceed
	if ( $form.find( ".js_error" ).length ) {
		$form.find( "input, select, button" ).prop( "disabled", false );
		$form.find( "[ type = submit ]" ).text( "Try Again." );
		validationErrorMessage += ".";
		notify( validationErrorMessage, {
			level: "error",
			context: "Enquiry Form"
		} );
		return;
	}

	/* -----
	 * Process and Assemble the data
	 ----- */
	var names = $name.val().split( /\s+/ );
	var firstName = names[ 0 ];
	var lastName = names.slice( 1 ).join( " " );
	var emailAddress = $email.val();

	var _id = __OMEGA.user._id;
	var project = __OMEGA.settings.Project;
	var userData = {
		"First Name": firstName,
		"Last Name": lastName,
		"Email": emailAddress
	}

	var meta = __OMEGA.settings;
	var crm = getDataFromSheet( __OMEGA.workbook.Sheets[ "Output (CRM)" ] );
	var mail = getDataFromSheet( __OMEGA.workbook.Sheets[ "Output (Mail)" ] );

	var enquiry = {
		meta: meta,
		crm: crm,
		mail: mail,
		unit: __OMEGA.unitData
		// ...
	};

	/* -----
	 * Store the data on the side
	 ----- */
	__OMEGA.user = Object.assign( __OMEGA.user, {
		firstName: firstName,
		lastName: lastName,
		email: emailAddress
	} );
	__OMEGA.user.name = firstName;
	if ( lastName )
		__OMEGA.user.name += " " + lastName;

	enquiry.user = __OMEGA.user;


	/* -----
	 * Process the data
	 ----- */
	// Notify that the enquiry is being processed
	notify( "We've sent for the pricing sheet.", {
		level: "info",
		context: "Enquiry Form"
	} );
	// Update the user
	updateUser( _id, project, userData )
		.catch( function ( e ) {
			alert( e.message )
		} )
		// Then, Run the computations through the pricing engine
		.then( function () {
			computeUnitData();
			return getComputedUnitDataForPrint();
		} )
		// Finally, make the enquiry
		.then( function ( points ) {
			enquiry.timestamp = getDateAndTimeStamp();
			enquiry.pdf = points;
			return makeAnEnquiry( enquiry );
		} )
		.then( function () {
			notify( "You should get an email shortly.", {
				level: "info",
				context: "Enquiry Form"
			} );

			__UI.$makeEnquiryButton.text( function () { return $( this ).data( "post" ) } );
		} )
		.catch( function ( e ) {
			console.log( e.message );
		} );

} );

function makeAnEnquiry ( enquiry ) {

	var ajaxRequest = $.ajax( {
		url: __OMEGA.settings[ "API Endpoint" ] + "/enquiries",
		method: "POST",
		data: JSON.stringify( enquiry ),
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
