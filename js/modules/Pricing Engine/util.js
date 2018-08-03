
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
	var workbookFile = "data/numbers.xlsx";
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
		acc[ curr.Detail || curr.Name ] = curr.Value;
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
 * Show a notification
 *
 * This shows a notification toast with the provided message.
 *
 */
function notify ( message, options ) {

	options = options || { };
	var level = options.level || "info";
	var context = options.context || "";

	if ( ! message ) {
		if ( level == "error" )
			message = "Something went wrong.";
		else
			return;
	}

	// If other notifications exist in the same in the same context, clear those out
	if ( context ) {
		var $existingNotificationInTheSameContext = __UI.$notificationSection.find( "[ data-context = '" + context + "' ]" );
		$existingNotificationInTheSameContext.remove();
	}

	// An object that maps notification levels to class names
	var levelToClassNameMap = {
		info: "fill-blue",
		success: "fill-green",
		error: "fill-red",
		alert: "fill-yellow"
	};
	// Get the corresponding class name for the notification level
	var levelClassName = levelToClassNameMap[ level ] || "";
	// Get the mark for the notification
	var notificationMarkup = __UI.templates.notification( {
		message: message,
		context: context,
		level: levelClassName
	} );
	var $notification = $( notificationMarkup );

	// Append the notification
	__UI.$notificationSection.append( $notification );
	// Animate it in
	$notification.get( 0 ).offsetTop; //
	$notification.addClass( "show" );

	// "Attempt" to remove the notification after a while
	// If the notification has already been removed by hitting the close button,
	// 	this will throw up, hence the try/catch block
	setTimeout( function () {
		try {
			$notification.remove();
		} catch ( e ) {}
	}, 9000 );

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
	var inputSheet = workbook.Sheets[ "Input" ];
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
	var points = XLSX.utils.sheet_to_json( __OMEGA.workbook.Sheets[ "Output" ], { raw: true } );
	/*
	 *
	 * Filter out line items,
	 * - that are not to be displayed (i.e. hidden)
	 * - whose values are empty (unless they're not "Text" content type)
	 *
	*/
	points = points.filter( function ( point ) {
		if ( point.Hide )
			if ( point.Name == "Grand Total" )
				return true;
			else
				return false;
		if ( ! point.Content )
			return false;
		if ( point.Value === 0 )
			return false;
		// if ( point.Content == "Helper" )
		// 	return true;
		// if ( ! point.Name ) {
		// 	if ( ( ! point.Content ) || point.Content == "Text" )
		// 		return false;
		// 	else
		// 		return true;
		// }
		// if ( ! point.Value ) {
		// 	if ( ! point.Modifiable )
		// 		return false;
		// }
		return true;
		// return point.Modifiable || ( ( ! point.Hide ) && point.Value );
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

	var url = location.origin;
	if ( __envProduction ) {
		url += "/secret-soil";
	}
	url += "/inc/set-cookie-async.php";
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
