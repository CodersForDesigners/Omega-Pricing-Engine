
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ UNIT VIEW
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Unit Details
	__UI.$unitDetailsSection = $( ".js_section_unit_details_and_mods" );
	__UI.$unitDetailsUnitNumber = __UI.$unitDetailsSection.find( ".js_unit_number_heading" );
	__UI.$unitDetailsList = __UI.$unitDetailsSection.find( ".js_unit_details_and_mods" );

} );

/*
 *
 * When a unit modification is inputted or changed
 * 	re-render the unit view.
 *
 */
// For binary input modifications
$( document ).on( "change", ".js_unit_modification__binary", function ( event ) {

	var modification = getModification( event );
	var $modificationInput = $( event.target );

	if ( ! $modificationInput.prop( "checked" ) )
		modification.value = 0;

	$( document ).trigger( "modification/changed", modification );

} );
// For manual input modifications
$( document ).on( "blur", ".js_unit_modification__manual", function ( event ) {

	var modification = getModification( event );
	var $modificationInput = $( event.target );

	// If the value has not changed, then do nothing
	if ( $modificationInput.data( "value" ) == modification.value )
		return;

	$modificationInput.data( "value", modification.value );
	$( document ).trigger( "modification/changed", modification );

} );
// For multi-choice modifications
$( document ).on( "change", ".js_unit_modification__multiple", function ( event ) {

	var modification = getModification( event );
	var $modificationInput = $( event.target );

	// If the value has not changed, then do nothing
	if ( $modificationInput.data( "value" ) == modification.value )
		return;

	$modificationInput.data( "value", modification.value );
	$( document ).trigger( "modification/changed", modification );

} );

/*
 *
 * When the Unit Details UI is to be rendered
 *
 */
$( document ).on( "unit-details/render", function ( event, data ) {

	if ( ! data ) {
		__UI.$unitDetailsSection.find( ".js_content" ).addClass( "hidden" );
		__UI.$unitDetailsSection.find( ".js_loading_stub" ).removeClass( "hidden" );
		// Reveal the section itself ( if it has not been shown even once )
		__UI.$unitDetailsSection.removeClass( "hidden" );
		return;
	}

	var unitNumber = data.unitNumber;
	var points = data.points.filter( function ( detail ) { return ! detail.Hide } );
	var modifications = __OMEGA.modifications;

	__UI.$unitDetailsUnitNumber.text( unitNumber );
	var unitDetailsMarkup = __UI.templates.unitDetails( {
		points: points,
		// modifications: modifications
	} );
	__UI.$unitDetailsList.html( unitDetailsMarkup );

	// Finally, reveal the UI _with_ the data
	__UI.$unitDetailsSection.find( ".js_content" ).removeClass( "hidden" );
	__UI.$unitDetailsSection.find( ".js_loading_stub" ).addClass( "hidden" );

} );
