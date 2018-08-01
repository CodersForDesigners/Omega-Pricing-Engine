
/*
 *
 * When the unit listing is to be sorted,
 *
 */
$( document ).on( "units/sort", function ( event, data ) {

	var sortingBasis = data.sortingBasis;

	__OMEGA.unitSortingBasis = sortingBasis;

	// Render a stub Unit listing in the meantime
	$( document ).trigger( "unit-listing/render", { context: "sort" } );

	waitFor( 1 ).then( function () {

		var sortedUnits = __OMEGA.unitsInListing.sort( function ( a, b ) {
			return a[ sortingBasis ] - b[ sortingBasis ];
		} );

		__OMEGA.unitsInListing = sortedUnits;

		$( document ).trigger( "unit-listing/render", {
			context: "sort",
			units: sortedUnits
		} );

	} );

} );
