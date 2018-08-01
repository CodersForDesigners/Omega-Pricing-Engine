
/*
 *
 * When a unit is specifically searched for,
 *
 */
$( document ).on( "unit/search", function ( event, data ) {

	var query = data.query.trim();

	if ( ! query ) {
		return;
	}

	$( document ).trigger( "unit-listing/render", { context: "search" } );

	waitFor( 1 ).then( function () {

		// var allUnits = __OMEGA.units;
		// var filteredUnits = allUnits.filter( function ( unit ) {
		// 	return String( unit.Unit ).indexOf( query ) != -1;
		// } );
		// var sortingBasis = __OMEGA.unitSortingBasis;
		// if ( sortingBasis ) {
		// 	filteredUnits = filteredUnits.sort( function ( a, b ) {
		// 		return a[ sortingBasis ] - b[ sortingBasis ];
		// 	} );
		// }
		// __OMEGA.unitsInListing = filteredUnits;
		// $( document ).trigger( "unit-listing/render", {
		// 	context: "search",
		// 	units: filteredUnits
		// } );
		$( document ).trigger( "unit-listing/build", {
			context: "search",
			query: query
		} );

	} );

} );

/*
 *
 * When the unit search widget is "de-activate"-d
 *
 */
$( document ).on( "unit/search/deactivate", function ( event, data ) {

	// Clear the search field
	$( document ).trigger( "unit/search/clear" );

	$( document ).trigger( "unit-listing/render", { context: "filtration" } );
	waitFor( 1 ).then( function () {
		// Trigger the processing of the unit listing
		$( document ).trigger( "unit-listing/build", { context: "filtration" } );
	} );

} );
