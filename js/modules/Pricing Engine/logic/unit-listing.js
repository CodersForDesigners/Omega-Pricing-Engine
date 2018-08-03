
/*
 *
 * When the unit listing has to be built
 *
 */
$( document ).on( "unit-listing/build", function ( event, data ) {

	var context = data.context;
	var unitsInListing;
	var allUnits = __OMEGA.units;

	if ( context == "sort" ) {
		unitsInListing = __OMEGA.unitsInListing;
	}
	else if ( context == "search" ) {
		var query = data.query;
		unitsInListing = allUnits.filter( function ( unit ) {
			return String( unit.Unit ).indexOf( query ) != -1;
		} );
	}
	else {
		unitsInListing = allUnits;
		// Pull out the units based on the applied filters
		var filtersByTaxonomy = __UTIL.groupListBy( __OMEGA.unitFiltersSelected, "taxonomy" );
		for ( var taxonomy in filtersByTaxonomy ) {
			unitsInListing = filterByAnyCriteria( unitsInListing, filtersByTaxonomy[ taxonomy ] );
		}
	}

	// Sort the units based on the "sorting basis"
	var sortingBasis = __OMEGA.unitSortingBasis;
	if ( sortingBasis ) {
		unitsInListing = unitsInListing.sort( function ( a, b ) {
			return a[ sortingBasis ] - b[ sortingBasis ]
		} );
	}

	__OMEGA.unitsInListing = unitsInListing;

	$( document ).trigger( "unit-listing/render", {
		context: context,
		units: unitsInListing
	} );

} );



/*
 *
 * When a unit listing is to be rendered, clear the search form,
 *	if something else ( other than a search ) triggered the re-render
 *
 */
$( document ).on( "unit-listing/render", function ( event, data ) {

	if ( ! data )
		return;

	if ( data.context == "filtration" ) {
		$( document ).trigger( "unit/search/clear" );
	}

	$( document ).trigger( "unit-details/render", { hide: true } );

} );
