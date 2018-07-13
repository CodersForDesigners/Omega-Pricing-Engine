
/*
 *
 * When a user's details have been received,
 * 	We can consider the user to be properly "logged in", and we can proceed to
 *	load the remainder of the page.
 *
 */
$( document ).on( "user/details/received", function ( userData ) {

	$( document ).trigger( "spreadsheet/fetch" )

} );


/*
 *
 * When the spreadsheet has been loaded,
 * 	Extract and organize all the relevant data in memory.
 *
 */
$( document ).on( "spreadsheet/load", function ( event, workbook ) {

	__OMEGA.workbook = workbook;

	// Get the units
	var units = XLSX.utils.sheet_to_json( workbook.Sheets.Units, { raw: true } );

	// Get the taxonomies for the units
	var sheetNames = workbook.SheetNames;
	var taxonomySheetNames = sheetNames.filter( function ( sheet ) {
		return sheet.indexOf( "T. " ) === 0;
	} );
	var taxonomies = taxonomySheetNames.map( function ( sheet ) {
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

	// Get the modifications for the units
	var modificationSheetNames = sheetNames.filter( function ( sheet ) {
		return sheet.indexOf( "M. " ) === 0;
	} );
	var modificationList = modificationSheetNames
		// Parse the data from the sheet
		.map( function ( sheet ) {
			return getDataFromSheet( workbook.Sheets[ sheet ] );
		} )
		// Parse the modification's numeric fields to valid JavaScript numbers
		.map( function ( modification ) {

			modification.Value = parseStringToNumber( modification.Value );

			if ( modification.Options ) {
				modification.Options = modification.Options.split( /\n+/ ).map( function ( labelAndValue ) {
					labelAndValue = labelAndValue.split( /\s+=\s+/ );
					var label = labelAndValue[ 0 ];
					var value = labelAndValue[ 1 ];
					// If the value is a number but is formatted as a string, convert it to a valid JavaScript number
					if ( typeof value == "string" ) {
						if ( ! /[^\d\.,]/.test( value ) ) {
							value = parseFloat( value.replace( /,/g, "" ) );
						}
					}
					return {
						label: label,
						value: value
					};
				} );
			}

			modification.Value = parseStringToNumber( modification.Value );
			modification[ "Minimum value" ] = parseStringToNumber( modification[ "Minimum value" ] );
			modification[ "Maximum value" ] = parseStringToNumber( modification[ "Maximum value" ] );

			return modification;

		} );

		// Convert the array to an object
		__OMEGA.modifications = modificationList.reduce( function ( object, currentModification ) {
			object[ currentModification.Name ] = currentModification;
			return object;
		}, { } );


	// Resolve and Parse the modification fields for all the units into a neat object
	units = units.map( function ( unit ) {

		var modifications = modificationList
			.filter( function ( modification ) {
				return unit[ "[M] " + modification.Name + " ( applicable )" ];
			} )
			.map( function ( modification ) {
				var key = "[M] " + modification.Name + " ";
				var defaultValue;
				var value = parseStringToNumber( modification.Value );
				var options = modification.Options;
				if ( options && unit[ key + "( default )" ] ) {
					defaultValue = modification.Options.find( function ( option ) {
						return option.label == unit[ key + "( default )" ];
					} ).value;
				}
				defaultValue = defaultValue || modification[ "Default value" ];
				var minimumValue = unit[ key + "( minimum )" ] || modification[ "Minimum value" ];
				var maximumValue = unit[ key + "( maximum )" ] || modification[ "Maximum value" ];
				var object = {
					name: modification.Name,
					type: modification[ "Input type" ],
					label: modification.Label
				};
				if ( defaultValue ) object.default = defaultValue;
				if ( value ) object.value = value;
				if ( options ) object.options = options;
				if ( minimumValue ) object.minimum = minimumValue;
				if ( maximumValue ) object.maximum = maximumValue;
				return object;
			} )
			// If the value is a number but is formatted as a string, convert it to a valid JavaScript number
			.map( function ( modification ) {
				for ( var key in modification ) {
					var value = modification[ key ];
					if ( typeof value == "string" ) {
						// If there is a character other than a digit, comma or decimal point, then for sure this is a number formatted as a string
						if ( ! /[^\d\.,]/.test( value ) ) {
							value = parseFloat( value.replace( /,/g, "" ) );
							modification[ key ] = value;
						}
					}
				}
				return modification;
			} )
			.reduce( function ( object, currentModification ) {
				object[ currentModification.name ] = currentModification;
				return object;
			}, { } );

		return Object.assign( unit, { modifications: modifications } );

	} );

	__OMEGA.units = units;


	// Initialise the user input object
	__OMEGA.userInput = { unitData: { } };

	// Trigger a render of the pricing engine UI
	$( document ).trigger( "pricing-engine/render" );

} );

/*
 *
 * When the pricing engine has to be rendered
 *
 */
$( document ).on( "pricing-engine/render", function () {

	waitFor( 1.5 ).then( function () {

		// Render the unit filtration widget
		$( document ).trigger( "unit-filtration/render", {
			taxonomies: __OMEGA.taxonomies,
			filters: __OMEGA.unitFiltersSelected
		} );

		// Render the units
		var filtersByTaxonomy = __UTIL.groupListBy( __OMEGA.unitFiltersSelected, "taxonomy" );
		var filteredUnits = __OMEGA.units;
		for ( var taxonomy in filtersByTaxonomy ) {
			filteredUnits = filterByAnyCriteria( filteredUnits, filtersByTaxonomy[ taxonomy ] );
		}
		__OMEGA.unitsInListing = filteredUnits;
		$( document ).trigger( "unit-listing/render", { units: filteredUnits } );

		$( ".js_pricing_engine_content" ).removeClass( "hidden" );
		$( ".js_pricing_engine_loading_stub" ).addClass( "hidden" );

	} );

} );


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

} );




/*
 *
 * When a unit is to be viewed,
 * 	1. Render stub UIs for the Unit Detailed View and EMI Calculator
 * 	2. Gather all the required input data.
 * 	3. Run the computations through the pricing engine.
 * 	4. Store the grand total value on the global state.
 * 	5. Render the Unit Details UI.
 * 	6. Render the EMI Calculator UI.
 *
 */
$( document ).on( "unit/view", function ( event, data ) {

	// 1. Render stub UIs for the Unit Detailed View and EMI Calculator
	$( document ).trigger( "unit-details/render" );
	$( document ).trigger( "emi-calculator/render" );

	waitFor( 0 ).then( function () {

		var newUnitData = data.unitData;

		// 2. Gather all the required input data
			// Sanitize the input data so that it works with the spreadsheet
		// for ( var key in newUnitData ) {
		// 	if ( typeof newUnitData[ key ] == "string" ) {
		// 		if ( ! /[^\d\.,]/.test( newUnitData[ key ] ) ) {
		// 			var sanitizedValue = newUnitData[ key ].replace( /,/g, "" );
		// 			newUnitData[ key ] = parseFloat( sanitizedValue );
		// 		}
		// 	}
		// }
			// Save the user input data on the side
		__OMEGA.userInput.unitData = Object.assign( __OMEGA.userInput.unitData, newUnitData );
		var inputParameters = __OMEGA.userInput.unitData;
		inputParameters[ "Timestamp" ] = +( new Date() );

		// 3. Run the computations through the pricing engine
		computeUnitData( inputParameters );
		var points = getComputedUnitData();

		// Filter out the modifications that aren't applicable for the unit
		// 	and set the unit-specific values for them ( if present )
		var modifications = __OMEGA.modifications;
		var selectedUnit = __OMEGA.units.find( function ( unit ) {
			return unit.Unit == inputParameters.Unit;
		} );
		points = points
			.filter( function ( point ) {
				// This part may be a bit tricky to follow.
				// Firstly, if the line item **does not** represent a modification, let it through
				if ( ! point.Modifiable ) return true;
				// If it **does** represent a modification, and if it is applicable to for this unit, let it through
				if ( selectedUnit.modifications[ point.Name ] ) return true;
				// Else, do not let it through
				return false;
			} )
			.map( function ( point ) {
				if ( ! point.Modifiable )
					return point;
				point.modification = selectedUnit.modifications[ point.Name ];
				return point;
			} );

		// 4. Store the grand total value on the global state
		var grandTotal;
		points.some( function ( point ) {
			if ( point.Name == "Grand Total" ) {
				grandTotal = parseFloat( point.Value );
				return true;
			}
		} );
		__OMEGA.unitData.grandTotal = grandTotal;

		// 5. Render the Unit Details UI
		$( document ).trigger( "unit-details/render", {
			unitNumber: inputParameters.Unit,
			points: points
		} );

		// 6. Render the EMI Calculator UI
		$( document ).trigger( "emi-calculator/render", { total: grandTotal } );

	} );

} );


/*
 *
 * For when the EMI calculator has got to calculate various figures
 *
 */
$( document ).on( "emi-calculator/calculate", function ( event, data ) {

	// Pull out the relevant data
	var downPayment = __OMEGA.emi.downPayment;
	var loanAmount = __OMEGA.emi.loanAmount;
	var tenure = __OMEGA.emi.tenure;
	var interestRate = __OMEGA.emi.interestRate / 1200;

	// Calculate the various figures
	var emi = Math.round( ( loanAmount * interestRate * Math.pow( 1 + interestRate, tenure ) ) / ( Math.pow( 1 + interestRate, tenure ) - 1 ) );
	var totalAmountPayable = emi * tenure;
	var principalAmount = loanAmount;
	var interestAmount = emi * tenure - loanAmount;

	$( document ).trigger( "emi-calculator/render/figures", {
		emi: emi,
		totalAmountPayable: totalAmountPayable,
		principalAmount: principalAmount,
		interestAmount: interestAmount
	} );

} );



/*
 *
 * When a modification is configured
 *
 */
$( document ).on( "modification/changed", function ( event, data ) {

	var modification = { };
	modification[ data.name ] = data.value;
	$( document ).trigger( "unit/view", {
		unitData: modification
	} );

} );
