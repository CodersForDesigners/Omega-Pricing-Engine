
/*
 * -/-/-/-/-/-/-/-/-
 * Helper Functions
 * -/-/-/-/-/-/-/-/-
 */

/*
 *
 * Fetches the workbook and triggers a "spreadsheet.load" event once it has it
 *
 */
function getWorkbook () {

	// var workbookFile = client + "/numbers.xlsx";
	var workbookFile = "/media/assets/numbers.xlsx";
	// cache-busting
	// workbookFile += "?v=" + window.__PRICING_ENGINE__.version.replace( /\./g, "" );
	workbookFile += "?v=" + +( new Date() );

	// Set up an async GET request
	var request = new XMLHttpRequest();
	request.open( "GET", workbookFile, true );
	request.responseType = "arraybuffer";

	request.onload = function ( event ) {

		var data = new Uint8Array( request.response );
		var workbook = XLSX.read(
			data,
			{
				type: "array",
				cellHTML: false,
				cellText: false
			}
		);

		$( document ).trigger( "spreadsheet.load", workbook );

	}

	request.send();

}
$( document ).on( "spreadsheet.fetch", getWorkbook );



/*
 *
 * This function pull the pricing engine settings into a neat JavaScript object
 *
 */
var getSettings = function () {

	var settings;

	return function getSettings ( workbook ) {

		if ( settings ) return settings;

		var sheet = workbook.Sheets.Settings;
		var startAndEndCells = sheet[ "!ref" ].split( ":" );
		var firstRow = parseInt( startAndEndCells[ 0 ].match( /\d+/ )[ 0 ], 10 );
		var lastRow = parseInt( startAndEndCells[ 1 ].match( /\d+/ )[ 0 ], 10 );

		settings = { };
		var currentRow, key, value;
		for ( currentRow = firstRow; currentRow <= lastRow; currentRow += 1 ) {
			if ( ! sheet[ "A" + currentRow ] )
				continue;
			key = sheet[ "A" + currentRow ].v
			value = sheet[ "B" + currentRow ] ? sheet[ "B" + currentRow ].v : "";
			settings[ key ] = value
		}

		return settings;

	};

}();


function filterByAnyCriteria ( things, criteria ) {

	if ( ! criteria.length )
		return things;

	var thingsBasedOnCriteria = things.filter( function ( unit ) {
		return criteria.some( function ( criterion ) {
			var comparator = __UTIL.comparators[ criterion.comparison ];
			return comparator( unit[ criterion.attribute ], criterion.value );
		} );
	} );

	return thingsBasedOnCriteria;

}

function filterByAllCriteria ( things, criteria ) {

	if ( ! criteria.length )
		return things;

	var thingsBasedOnCriteria = things.filter( function ( unit ) {
		return criteria.every( function ( criterion ) {
			var comparator = __UTIL.comparators[ criterion.comparison ];
			return comparator( unit[ criterion.attribute ], criterion.value );
		} );
	} );

	return thingsBasedOnCriteria;

}


/*
 *
 * Return the list of apartments that match the given conditions.
 * Conditions include,
 * 	- Type
 * 	- Floor?
 * 	- Availability
 *
 */
function getApartmentsBasedOnCriteria ( units, criteria ) {

	var theUnits = units
		.filter( function ( unit ) {
			var criterion;
			for ( criterion in criteria ) {
				if (
					( criteria[ criterion ] != void 0 )
					&& ( unit[ criterion ] != criteria[ criterion ] )
				) {
					return false;
				}
			}
			return true;
		} );

	return theUnits;

}



/*
 *
 * This function runs the user input through the spreadsheet
 * More specifically, it
 *	- takes in input
 *	- writes it to the spreadsheet
 *	- performs a re-calculation
 *
 */
function computeUnitData ( parameters ) {

	var workbook = __OMEGA.workbook;
	var inputSheet = workbook.Sheets[ "User Input" ];
	var unit = parameters.Unit;

	// Get input sheet structure
	var inputFields = XLSX.utils.sheet_to_json( inputSheet, { raw: true } );
	var inputDataStructure = inputFields.map( function ( field ) {
		return [ parameters[ field.Field ] || "" ];
	} );

	// Inject the input into the input sheet
	XLSX.utils.sheet_add_aoa( inputSheet, inputDataStructure, { origin: "C3" } );

	// Trigger a re-calculation on the spreadsheet
	XLSX_CALC( workbook );

	return workbook;

}
/*
 *
 * This function returns the computed values from the spreadsheet
 *
 */
function getComputedUnitData () {

	// Pull the computed values
	var points = XLSX.utils.sheet_to_json( __OMEGA.workbook.Sheets[ "Computed Unit Details" ], { raw: true } );
	points = points.filter( function ( point ) {
		return point.Display != "N";
	} );
	return points;

}




/*
 *
 * Get the markup containing all the details pertaining to a unit
 *
 */
function getUnitView ( unitId ) {

	// Disable the interface
	// Fill in this space

	var unitParameters = __PRICING_ENGINE__.unitParameters;
	var allUnits = __PRICING_ENGINE__.allUnits;
	var unitIndex;
	allUnits.some( function ( unit, index ) {
		if ( unit.Unit == unitId ) {
			unitIndex = index;
			return true;
		}
	} );

	__PRICING_ENGINE__.unitConstants = allUnits[ unitIndex ];

	// Calculate data from the spreadsheet and assign to the local state
	__PRICING_ENGINE__.unitData = getComputedApartmentDetails( __PRICING_ENGINE__.workbook, { unit: unitParameters.unit } );


	// Build and plonk in the markup
	$( ".js_unit_info_container" ).load(
		// projectPath + "/templates/test.php",
		projectPath + "/templates/unit-info.php",
		$.extend( { projectPath: projectPath }, __PRICING_ENGINE__.unitConstants, __PRICING_ENGINE__.unitData, __PRICING_ENGINE__.unitParameters )
	);

	// Broadcast the fact that a unit view has been fetched
	$( document ).trigger( "load::unit-view", { unit: unitId } );

	// For the EMI calculator
	$( ".js_emi_toggle" ).removeClass( "hidden" )
	totalPrice = __PRICING_ENGINE__.unitData.total_grand

	// Reflect the new figures elsewhere
	$( document ).trigger( "change::grand-total" );

	// $( ".js_enquiry_form [ name = enquiry-unit ]" ).val( unitId );


	// Re-enable the interface
	// Fill in this space

}


/*
 *
 * Calculate the EMI
 *
 */
function calculateEMI () {

	var $emiDownPayment = $( ".js_emi_calculator [ name = 'down-payment' ]" );
	var $emiDownPaymentPercentage = $( ".js_emi_calculator .js_down_payment_percentage" );
	var $emiLoanAmount = $( ".js_emi_calculator [ name = 'loan-amount' ]" );
	var $emiTenure = $( ".js_emi_calculator [ name = 'tenure' ]" );
	var $emiInterestRate = $( ".js_emi_calculator [ name = 'interest-rate' ]" );

	var loanAmount = parseInt( $emiLoanAmount.val().replace( /[^\d\.]/g, "" ), 10 );
	var tenureInMonths = parseInt( $emiTenure.val(), 10 )
	var interestRate = $emiInterestRate.val() / 1200

	var emi = Math.round( ( loanAmount * interestRate * Math.pow( 1 + interestRate, tenureInMonths ) ) / ( Math.pow( 1 + interestRate, tenureInMonths ) - 1 ) )

	$( ".js_estimated_emi" ).text( formatNumberToIndianRupee( emi ) );
	$( ".js_total_amount_payable" ).text( formatNumberToIndianRupee( emi * tenureInMonths ) );
	$( ".js_principal_amount" ).text( formatNumberToIndianRupee( loanAmount ) );
	$( ".js_interest_amount" ).text( formatNumberToIndianRupee( emi * tenureInMonths - loanAmount ) );

}


/*
 *
 * Set a cookie asynchronously
 *
 * @params
 * 	name -> the name of the cookie
 * 	data -> an object with data that is to be encoded into the cookie
 * 	duration -> how long before the cookie expires ( in seconds )
 *
 */
function setCookie ( name, data, duration ) {

	var url = "http://omega.api/lib/set-cookie-async.php";
	var queryString = "?" + "_cookie=" + encodeURIComponent( name );
	queryString += "&_duration=" + encodeURIComponent( duration );
	queryString += "&data=" + encodeURIComponent( JSON.stringify( data ) );

	var $iframe = $( "<iframe>" );
	$iframe.attr( {
		width: 0,
		height: 0,
		title: "Set cookie",
		src: url + queryString,
		style: "display:none;",
		class: "js_iframe_cookie_setter"
	} );
	$( "body" ).append( $iframe );

	// Remove the iframe afterwards,
	// when we can safely that the page has been loaded and the cookie set
	setTimeout( function () {
		$iframe.remove()
	}, 5000 );

}
