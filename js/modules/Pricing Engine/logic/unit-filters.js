
/*
 *
 * When the filter is added,
 *	1. Render a stub Unit Listing.
 *	2. Add it to the list of filters.
 *	3. Re-render the unit search widget.
 *	4. Re-render the unit listing.
 *
 */
$( document ).on( "unit-filter/add", function ( event, filterAdded ) {

	// 1. Render a stub Unit Listing
	$( document ).trigger( "unit-listing/render", { context: "filtration" } );

	// 2. Add it to the list of filters
	var selectedFilter = __OMEGA.unitFilters
		.filter( function ( filter ) {
			return filter.taxonomy == filterAdded.taxonomy
		} )
		.filter( function ( filter ) {
			return filter.type == filterAdded.type
		} )
		[ 0 ];
	__OMEGA.unitFiltersSelected.push( selectedFilter );

	// 3. Re-render the unit search widget?
	$( document ).trigger( "unit-filtration/render/change", {
		taxonomies: __OMEGA.taxonomies,
		filters: __OMEGA.unitFiltersSelected
	} );

	waitFor( 1 ).then( function () {

		// // 4. Re-render the unit listing
		// var filtersByTaxonomy = __UTIL.groupListBy( __OMEGA.unitFiltersSelected, "taxonomy" );
		// var filteredUnits = __OMEGA.units;
		// for ( var taxonomy in filtersByTaxonomy ) {
		// 	filteredUnits = filterByAnyCriteria( filteredUnits, filtersByTaxonomy[ taxonomy ] );
		// }
		// var sortingBasis = __OMEGA.unitSortingBasis;
		// if ( sortingBasis ) {
		// 	filteredUnits = filteredUnits.sort( function ( a, b ) {
		// 		return a[ sortingBasis ] - b[ sortingBasis ];
		// 	} );
		// }
		// __OMEGA.unitsInListing = filteredUnits;
		// $( document ).trigger( "unit-listing/render", {
		// 	context: "filtration",
		// 	units: filteredUnits
		// } );
		$( document ).trigger( "unit-listing/build", { context: "filtration" } );

	} );

} );

/*
 *
 * When the filter is removed,
 *	1. Render a stub Unit Listing.
 *	2. Remove it from the list of filters.
 *	3. Re-render the unit search widget.
 *	4. Re-render the unit listing.
 *
 */
$( document ).on( "unit-filter/remove", function ( event, filter ) {

	// 1. Render a stub Unit Listing
	$( document ).trigger( "unit-listing/render", { context: "filtration" } );

	// 2. Remove it from the list of filters
	var filterParameterIndex;
	var filtersSelected = __OMEGA.unitFiltersSelected;
	filtersSelected.some( function ( unitFilter, index ) {
		if ( unitFilter.type == filter.type ) {
			if ( unitFilter.taxonomy == filter.taxonomy ) {
				filterParameterIndex = index;
				return true;
			}
		}
	} );
	// If the filter wasn't found in the list of existing filters, don't proceed
	if ( ! filterParameterIndex )
		return;

	__OMEGA.unitFiltersSelected = filtersSelected.slice( 0, filterParameterIndex ).concat( filtersSelected.slice( filterParameterIndex + 1 ) );

	// 3. Re-render the unit search widget
	$( document ).trigger( "unit-filtration/render/change", {
		taxonomies: __OMEGA.taxonomies,
		filters: __OMEGA.unitFiltersSelected
	} );

	waitFor( 1 ).then( function () {

		// // 4. Re-render the unit listing
		// var filtersByTaxonomy = __UTIL.groupListBy( __OMEGA.unitFiltersSelected, "taxonomy" );
		// var filteredUnits = __OMEGA.units;
		// for ( var taxonomy in filtersByTaxonomy ) {
		// 	filteredUnits = filterByAnyCriteria( filteredUnits, filtersByTaxonomy[ taxonomy ] );
		// }
		// var sortingBasis = __OMEGA.unitSortingBasis;
		// if ( sortingBasis ) {
		// 	filteredUnits = filteredUnits.sort( function ( a, b ) {
		// 		return a[ sortingBasis ] - b[ sortingBasis ]
		// 	} );
		// }
		// __OMEGA.unitsInListing = filteredUnits;
		// $( document ).trigger( "unit-listing/render", {
		// 	context: "filtration",
		// 	units: filteredUnits
		// } );
		$( document ).trigger( "unit-listing/build", { context: "filtration" } );

	} );

} );
