
/*
 *
 * When the unit listing is to be sorted,
 *
 */
$( document ).on( "units/sort", function ( event, data ) {

	var sortingBasis = data.basis;
	var sortingDirection = data.direction.toLowerCase();
	var sortedUnits;
	var unitsInListing = __OMEGA.unitsInListing;

	__OMEGA.unitSortOptions = {
		basis: sortingBasis,
		direction: sortingDirection
	}

	// Render a stub Unit listing in the meantime
	$( document ).trigger( "unit-listing/render", { context: "sort" } );

	if ( sortingDirection == "random" )
		sortedUnits = _.sampleSize( unitsInListing, unitsInListing.length );
	else if ( sortingDirection == "descending" )
		sortedUnits = _.orderBy( unitsInListing, sortingBasis, "desc" );
	else
		sortedUnits = _.orderBy( unitsInListing, sortingBasis );

	__OMEGA.unitsInListing = sortedUnits;

	$( document ).trigger( "unit-listing/render", {
		context: "sort",
		units: __OMEGA.unitsInListing
	} );

} );
