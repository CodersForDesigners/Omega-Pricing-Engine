
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

$( document ).on( "click", ".js_sort_by", function ( event ) {

	var $sortButton = $( event.target ).closest( ".js_sort_by" );

	if ( $sortButton.hasClass( "selected" ) ) {
		return;
	}

	__UI.$unitSortSection.find( ".js_sort_by" ).removeClass( "selected" );
	$sortButton.addClass( "selected" );
	var sortingBasis = $sortButton.data( "attr" );

	$( document ).trigger( "units/sort", { sortingBasis: sortingBasis } );

} );
