
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ UNIT SORT
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Unit Sort
	__UI.$unitSortSection = $( ".js_unit_sort_section" );

} );

$( document ).on( "change", ".js_sort_by", function ( event ) {

	var $sortCriteria = $( event.target );
	var $sortCriterion = $sortCriteria.children().eq( $sortCriteria.val() );

	var basis = $sortCriterion.data( "attr" );
	var direction = $sortCriterion.data( "dir" );

	$( document ).trigger( "units/sort", {
		basis: basis,
		direction: direction
	} );

} );
