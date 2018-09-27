
// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Create Unit Link Widget
	__UI.$unitLinkForm = $( ".js_unit_link_form" );
	__UI.$unitAndCustomersNames__ForUnitLink = __UI.$unitLinkForm.closest( ".js_section" ).find( ".js_unit_and_customers_names" );
	__UI.$unitLink = __UI.$unitLinkForm.closest( ".js_section" ).find( ".js_unit_link" );

} );



/*
 *
 * Clear the Unit Link Form
 *
 */
function resetUnitLinkForm () {

	__UI.$unitAndCustomersNames__ForUnitLink.html( "&nbsp;" );
	__UI.$unitLinkForm.get( 0 ).reset();
	__UI.$unitLinkForm.find( "input, button" ).prop( "disabled", false );
	__UI.$unitLinkForm.find( "[ type = 'submit' ]" ).text( "Create" );
	__UI.$unitLink.text( "" );
	__UI.$unitLink.attr( "href", "" );
	__UI.$unitLink.prop( "disabled", true );

	// If the unit is not available for regular users, say so
	var currentUnitSelected = __OMEGA.userInput.unitData.Unit;
	var unitIsAvailableForRegularUsers = __OMEGA.unitsForRegularUsers.find( function ( unit ) {
		return unit.Unit == currentUnitSelected;
	} );
	if ( unitIsAvailableForRegularUsers )
		return;

	__UI.$unitLink.text( "This unit is not available to the public." );
	__UI.$unitLink.attr( "href", "" );
	__UI.$unitLinkForm.find( "input, button" ).prop( "disabled", true );

}



/*
 *
 * When a unit is view, clear and reset the quote form
 *
 */
$( document ).on( "unit/view/done", resetUnitLinkForm );





/*
 *
 * On submitting the Unit Link form
 *
 */
$( document ).on( "submit", ".js_unit_link_form", function ( event ) {

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
	$form.find( "[ type = 'submit' ]" ).text( "Creating" );
	// Clear the existing Unit Link
	__UI.$unitLink.text( "" );
	__UI.$unitLink.attr( "href", "" );

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
	// User ID
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
	 * Process the data
	 ----- */
	// Fetch the user
	getUser( userId )
		.then( function ( user ) {

			// Build and Plonk in the Unit Link URL into the textbox
			var unitName = __OMEGA.userInput.unitData.Unit;
			var pricingEngineURL = __OMEGA.settings[ "Pricing Engine URL" ];
			var unitLinkURL = pricingEngineURL + "/" + unitName + "?uid=" + encodeURIComponent( btoa( userId ) )
			__UI.$unitLink.text( unitLinkURL );
			__UI.$unitLink.attr( "href", unitLinkURL );
			__UI.$unitLink.prop( "disabled", false )

			var applicantsNames = user.name;
			if ( user.coApplicantName )
				applicantsNames += " and " + user.coApplicantName;
			__UI.$unitAndCustomersNames__ForUnitLink.text( applicantsNames );

			$form.find( "input, select, button" ).prop( "disabled", false );
			$form.find( "[ type = 'submit' ]" ).text( "Create" );

		} )
		.catch( function ( e ) {
			notify( e.message, {
				level: "error",
				context: "Unit Link Form"
			} );
			resetUnitLinkForm();
		} );

} );



/*
 *
 * On interacting with the Unit Link,
 *	Do not follow through to where it points, for it needs to be copied / shared
 *
 */
$( ".js_unit_link" ).on( "click", function ( event ) {
	event.preventDefault();
} );
