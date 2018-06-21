
/*
 *
 * When a user's details have been received,
 * 	We can consider the user to be properly "logged in", and we can proceed to
 *	load the remainder of the page.
 *
 */
$( document ).on( "user.details.received", function ( userData ) {

	$( document ).trigger( "spreadsheet.fetch" )

} );


/*
 *
 * When the spreadsheet has been loaded,
 * 	Extract and organize all the relevant data in memory.
 *
 */
$( document ).on( "spreadsheet.load", function ( event, workbook ) {

	__OMEGA.workbook = workbook;

	// Get the units
	var units = XLSX.utils.sheet_to_json( workbook.Sheets.Units, { raw: true } );
	__OMEGA.units = units;

	// Get the taxonomies for the units
	var sheetNames = workbook.SheetNames;
	var taxonomySheets = sheetNames.filter( function ( sheet ) {
		return sheet.indexOf( "T. " ) === 0;
	} );
	var taxonomies = taxonomySheets.map( function ( sheet ) {
		return {
			name: sheet.split( "T. " )[ 1 ],
			types: XLSX.utils.sheet_to_json( workbook.Sheets[ sheet ], { raw: true } )
		};
	} );
	__OMEGA.taxonomies = taxonomies;

	// Get the filters for the units
	var unitFilters = taxonomies.map( function ( taxonomy ) {
		return taxonomy.types.map( function ( type ) {
			return {
				taxonomy: taxonomy.name,
				type: type.Name,
				description: type.Description,
				attribute: type.Attribute,
				comparison: type.Comparison,
				value: type.Value
			};
		} );
	} ).reduce( function ( acc, el ) { return acc.concat( el ) }, [] );
	__OMEGA.unitFilters = unitFilters;

	// Trigger a render of the pricing engine UI
	$( document ).trigger( "pricing-engine.render" );

} );

/*
 *
 * When the pricing engine has to be rendered
 *
 */
$( document ).on( "pricing-engine.render", function () {

	// Render the units
	var filtersByTaxonomy = __UTIL.groupListBy( __OMEGA.unitFiltersSelected, "taxonomy" );
	var filteredUnits = __OMEGA.units;
	for ( var taxonomy in filtersByTaxonomy ) {
		filteredUnits = filterByAnyCriteria( filteredUnits, filtersByTaxonomy[ taxonomy ] );
	}
	$( document ).trigger( "unit-listing.render", { units: filteredUnits } );

	// Render the unit filtration widget
	$( document ).trigger( "unit-filtration.render", {
		taxonomies: __OMEGA.taxonomies,
		filters: __OMEGA.unitFiltersSelected
	} );

} );


/*
 *
 * When the filter is added,
 *	1. Add it to the list of filters.
 *	2. Re-render the unit search widget.
 *	3. Re-render the unit listing.
 *
 */
$( document ).on( "unit-filter.add", function ( event, filterAdded ) {
	// 1. Add it to the list of filters
	var selectedFilter = __OMEGA.unitFilters
		.filter( function ( filter ) {
			return filter.taxonomy == filterAdded.taxonomy
		} )
		.filter( function ( filter ) {
			return filter.type == filterAdded.type
		} )
		[ 0 ];
	__OMEGA.unitFiltersSelected.push( selectedFilter );

	// 2. Re-render the unit search widget
	$( document ).trigger( "unit-filtration.render", {
		taxonomies: __OMEGA.taxonomies,
		filters: __OMEGA.unitFiltersSelected
	} );

	// 3. Re-render the unit listing
	var filtersByTaxonomy = __UTIL.groupListBy( __OMEGA.unitFiltersSelected, "taxonomy" );
	var filteredUnits = __OMEGA.units;
	for ( var taxonomy in filtersByTaxonomy ) {
		filteredUnits = filterByAnyCriteria( filteredUnits, filtersByTaxonomy[ taxonomy ] );
	}
	$( document ).trigger( "unit-listing.render", { units: filteredUnits } );
} );

/*
 *
 * When the filter is removed,
 *	1. Remove it from the list of filters.
 *	2. Re-render the unit search widget.
 *	3. Re-render the unit listing.
 *
 */
$( document ).on( "unit-filter.remove", function ( event, filter ) {
	// 1. Remove it from the list of filters
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

	// 2. Re-render the unit search widget
	$( document ).trigger( "unit-filtration.render", {
		taxonomies: __OMEGA.taxonomies,
		filters: __OMEGA.unitFiltersSelected
	} );

	// 3. Re-render the unit listing
	var filtersByTaxonomy = __UTIL.groupListBy( __OMEGA.unitFiltersSelected, "taxonomy" );
	var filteredUnits = __OMEGA.units;
	for ( var taxonomy in filtersByTaxonomy ) {
		filteredUnits = filterByAnyCriteria( filteredUnits, filtersByTaxonomy[ taxonomy ] );
	}
	$( document ).trigger( "unit-listing.render", { units: filteredUnits } );
} );




/*
 *
 * When a unit is to be viewed,
 * 	1. Gather all the required input data.
 * 	2. Run the computations through the pricing engine.
 * 	3. Render the Unit Details UI.
 *
 */
$( document ).on( "unit.view", function ( event, data ) {

	var unit = data.unit;

	// 1. Gather all the required input data
	var inputParameters = { };
	inputParameters[ "Timestamp" ] = +( new Date() );
	inputParameters[ "Unit" ] = unit;

	// 2. Run the computations through the pricing engine
	computeUnitData( inputParameters );
	var points = getComputedUnitData();

	// 3. Render the Unit Details UI
	$( document ).trigger( "unit-details.render", {
		unit: unit,
		details: points
	} );

} );
