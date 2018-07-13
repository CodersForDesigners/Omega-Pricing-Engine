
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
	var workbookFile = "/data/numbers.xlsx";
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

		$( document ).trigger( "spreadsheet/load", workbook );

	}

	request.send();

}
$( document ).on( "spreadsheet/fetch", getWorkbook );


/*
 *
 * This function will parse a (spread)sheet row-wise into an object.
 *
 * 	This is with the asumption that key belongs to the column `Detail`,
 *	and the value to the column `Value`.
 *
 */
function getDataFromSheet ( sheet ) {

	var dataArray = XLSX.utils.sheet_to_json( sheet, { raw: true } );

	var data = dataArray.reduce( function ( acc, curr ) {
		acc[ curr.Detail ] = curr.Value;
		return acc;
	}, { } );

	return data;

};


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
 * Get the value of a modification that has been configured by a user
 *
 */
function getModification ( event ) {

	var $unitModification = $( event.target );
	// var name = $unitModification.data( "modification" );
	var name = $unitModification.attr( "name" );
	var value = $unitModification.val();

	return {
		name: name,
		value: value
	};

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
	// Filter out points that are not to be display and ones whose values are empty
	points = points.filter( function ( point ) {
		return point.Modifiable || ( ( ! point.Hide ) && point.Value );
	} );
	return points;

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
