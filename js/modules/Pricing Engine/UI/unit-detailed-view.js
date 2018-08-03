
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
	__UI.$unitDetailsList = __UI.$unitDetailsSection.find( ".js_content" );

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
		__UI.$unitDetailsSection.addClass( "loading" );
		__UI.$unitDetailsSection.css( "height", function ( _i, height ) {
			return height;
		} );
		// Reveal the section itself ( if it has not been shown even once )
		__UI.$unitDetailsSection.removeClass( "hidden" );
		return;
	}

	var unitNumber = data.unitNumber;
	var points = data.points.filter( function ( detail ) { return ! detail.Hide } );
	var modifications = __OMEGA.modifications;

	var unitDetailsMarkup = __UI.templates.unitDetails( {
		points: points,
		// modifications: modifications
	} );
	__UI.$unitDetailsList.html( unitDetailsMarkup );

	// Finally, reveal the UI _with_ the data
	__UI.$unitDetailsSection.find( ".js_content" ).removeClass( "hidden" );
	__UI.$unitDetailsSection.css( "height", "" );
	__UI.$unitDetailsSection.removeClass( "loading" );

} );

var unstickGrandTotalLineItem = function () {

	var $window = $( window );
	var $grandTotalLineItem;
	var $preceedingLineItem;
	var $followingLineItem;

	$( document ).on( "unit/view/done", function () {
		$grandTotalLineItem = $( ".js_grand_total_line_item" );
		$preceedingLineItem = $grandTotalLineItem.prev();
		$followingLineItem = $grandTotalLineItem.next();
		if ( ! $followingLineItem.length ) {
			$followingLineItem = $grandTotalLineItem.parent().next();
		}
	} );

	return function unstickGrandTotalLineItem ( event ) {

		// If no unit's details has been loaded
		if ( ! $grandTotalLineItem || ! $grandTotalLineItem.length ) {
			return;
		}

		var scrollTop = window.scrollY || document.body.scrollTop;
		var viewportHeight = $window.height();
		var scrollBottom = scrollTop + viewportHeight;

		var grandTotalLineItemHeight = $grandTotalLineItem.outerHeight();
		var followingLineItemTop = $followingLineItem.position().top - parseFloat( $followingLineItem.css( "margin-top" ) );

		// console.log( "Scroll bottom: " + scrollBottom );
		// console.log( "Grand Total Line Item Hieght: " + grandTotalLineItemHeight );
		// console.log( "Bottom Position of preceeding line item line item: " + ( $preceedingLineItem.offset().top + $preceedingLineItem.height() ) );
		// console.log( "Top Position of following line item: " + $followingLineItem.offset().top );
		// console.log()
		// console.log( "–––––––––––––––––––––––––––––––––––––––––––––––––––––––" )
		// console.log()
		if ( scrollBottom >= followingLineItemTop + grandTotalLineItemHeight ) {
			$grandTotalLineItem.removeClass( "fixed" );
		}
		else {
			$grandTotalLineItem.addClass( "fixed" );
		}

	};

}();
$( window ).on( "scroll", unstickGrandTotalLineItem );
