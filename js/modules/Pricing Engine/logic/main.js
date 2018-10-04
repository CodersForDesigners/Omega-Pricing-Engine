
/*
 *
 * When a user's details have been received,
 * 	We can consider the user to be properly "logged in", and we can proceed to
 *	load the remainder of the page.
 *
 */
$( document ).on( "user/details/received", function ( userData ) {

	$( document ).trigger( "spreadsheet/fetch" );

} );


/*
 *
 * When the spreadsheet has been loaded,
 * 	Extract and organize all the relevant data in memory.
 *
 */
$( document ).on( "spreadsheet/load", function ( event, workbook ) {

	__OMEGA.workbook = workbook;

	// Get the project settings
	var settings = getDataFromSheet( workbook.Sheets[ "Settings" ] );
	__OMEGA.settings = settings;

	// Set some global values
	__OMEGA.settings.apiEndpoint = __OMEGA.settings[ "API Endpoint" ]
	__OMEGA.settings.OTPTemplate = __OMEGA.settings[ "OTP Template" ];
	__OMEGA.settings.userImplicitNamePrefix = __OMEGA.settings[ "User Implicit Name Prefix" ];
	__OMEGA.settings.projectBaseURL = __OMEGA.settings[ "Project Name Base URL" ] || "";
	__OMEGA.settings.assignmentRuleId = __OMEGA.settings[ "Zoho Assignment Rule" ] || "";
	__OMEGA.settings.beforeClosingHeadTag = __OMEGA.settings[ "Before Closing Head Tag" ]
	__OMEGA.settings.afterOpeningBodyTag = __OMEGA.settings[ "After Opening Body Tag" ]
	__OMEGA.settings.beforeClosingBodyTag = __OMEGA.settings[ "Before Closing Body Tag" ]

	// Contextualize the API endpoint based on the environment
	if ( ! __envProduction ) {
		__OMEGA.settings.apiEndpoint = __OMEGA.settings[ "API Endpoint (dev)" ];
	}

	// Get the units
	var units = XLSX.utils.sheet_to_json( workbook.Sheets.Units, { raw: true } );

	var userRole = __OMEGA.user && __OMEGA.user.role;
	if ( userRole ) {
		var unitsForRegularUsers = units
						.map( function ( unit ) {
							return {
								Unit: unit.Unit,
								Availability: unit.Availability,
								Sold: unit.Sold
							};
						} )
						.filter( function ( unit ) {
							return unit.Sold ? false : unit.Availability;
						} );
		__OMEGA.unitsForRegularUsers = unitsForRegularUsers;
		var unitsDiff = XLSX.utils.sheet_to_json( workbook.Sheets[ "Units (" + userRole + ")" ], { raw: true } );
		units = units.map( function ( unit, _i ) {
			return Object.assign( unit, unitsDiff[ _i ] );
		} );
	}

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
			var t = {
				taxonomy: taxonomy.name,
				type: type.Name,
				description: type.Description,
				attribute: type.Attribute,
				comparison: type.Comparison,
				default: type.Default,
			};
			if ( type.Comparison == "is between" ) {
				t.value = type.Value.split( /\s+and\s+/ ).map( function ( v ) {
					return parseFloat( v );
				} );
			}
			else {
				t.value = type.Value;
			}
			return t;
		} );
	} ).reduce( function ( acc, el ) { return acc.concat( el ) }, [] );
	__OMEGA.unitFilters = unitFilters;

	// The implicit filter that is set by default, i.e. "Availability"
	__OMEGA.unitFiltersSelected = [ { taxonomy: "Availability", type: "Available", attribute: "Availability", comparison: "is equal to", value: true }, { taxonomy: "Availability", type: "Sold", attribute: "Sold", comparison: "is equal to", value: false } ];

	// Get the unit sorting criterias
	__OMEGA.unitSortingCriteria = XLSX.utils.sheet_to_json( __OMEGA.workbook.Sheets[ "Unit Sorting" ], { raw: true } );
	var defaultSortingCriterion = __OMEGA.unitSortingCriteria.find( function ( criterion ) { return criterion.Default } );
	__OMEGA.unitSortOptions = {
		basis: defaultSortingCriterion.Attribute,
		direction: defaultSortingCriterion.Direction.toLowerCase()
	};

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
		// Also, set the default values for the modifications
			// If no defaults have been set, default to the first option
	__OMEGA.userInput = { unitData: getDefaultModificationValues() };

	// Trigger a render of the pricing engine UI
	$( document ).trigger( "pricing-engine/ready" );
	// $( document ).trigger( "pricing-engine/render" );

} );





/*
 *
 * When the pricing engine has to be rendered
 *
 */
$( document ).on( "pricing-engine/render", function () {

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

	// Unhide all the sections of the pricing engine
	$( ".js_unit_classification" ).removeClass( "hidden" );
	$( ".js_unit_filter_bubbles" ).removeClass( "hidden" );
	$( ".js_unit_search" ).removeClass( "hidden" );
	$( ".js_unit_sort_section" ).removeClass( "hidden" );
	$( ".js_unit_listing_section" ).removeClass( "hidden" );

	$( ".js_pricing_engine_content" ).removeClass( "hidden" );
	$( ".js_pricing_engine_loading_stub" ).addClass( "hidden" );

	$( document ).trigger( "pricing-engine/render/after" );

} );
