
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
	var workbookFile = "account/data/numbers.xlsx";
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
	var escape = options.escape || false;

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
		escape: escape,
		context: context,
		level: levelClassName
	} );
	var $notification = $( notificationMarkup );

	// Append the notification
	__UI.$notificationSection.append( $notification );
	// Animate it in
	$notification.get( 0 ).offsetTop; //
	$notification.addClass( "show" );
	// For devices that auto-zoom when focusing on a form element,
	//  	we offset the notification accordingly
	if ( window.screen ) {
		if ( window.screen.height != window.innerHeight ) {
			// We wait for a bit because on Chrome on Android, the height value
			//  	takes into account the open virtual keyboard
			setTimeout( function () {
				var verticalOffset = Math.floor(
					( ( 1 - window.innerHeight / window.screen.height ) * 1000 ) / 2
				);
				$notification.css( "transform", "translateY( " + verticalOffset + "% )" );
			}, 500 )
		}
	}

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
	var value;
	if ( $unitModification.attr( "type" ) == "checkbox" )
		if ( $unitModification.prop( "checked" ) )
			value = $unitModification.data( "value-when-checked" );
		else
			value = "";
	else
		value = $unitModification.val();

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
function computeUnitData () {

	// 1. Gather all the required input data
		// the customer is stored in the `customer` field on the Quote page
		// 	and the `user` field on the Pricing page
	var customer = __OMEGA.customer || __OMEGA.user || { };
	var inputParameters = Object.assign( { }, __OMEGA.userInput.unitData );
	// Not assuming that this is gonna run **only** when a user is authenticated
	if ( customer.phoneNumber )
		inputParameters = Object.assign( inputParameters, {
			Phone: customer.phoneNumber,
			Name: customer.name,
			Email: customer.email
		} );
	inputParameters[ "User ID" ] = customer.uid || "";
	for ( var _k in customer ) {
		if ( _k.startsWith( "_ " ) )
			inputParameters[ _k.replace( "_ ", "" ) ] = customer[ _k ];
	}
	inputParameters[ "Timestamp" ] = getDateAndTimeStamp();

	// 2. Set the input data to the `Input` sheet
	var workbook = __OMEGA.workbook;
	var inputSheet = workbook.Sheets[ "Input" ];
	var unit = __OMEGA.userInput.unitData.Unit;

	// Get input sheet structure
	var inputFields = XLSX.utils.sheet_to_json( inputSheet, { raw: true } );
	var inputDataStructure = inputFields.slice( 1 ).map( function ( field ) {
		return [ inputParameters[ field.Field ] || "" ];
	} );

	// Inject the input into the input sheet
	XLSX.utils.sheet_add_aoa( inputSheet, inputDataStructure, { origin: "C3" } );

	// Trigger a re-calculation on the spreadsheet
	XLSX_CALC( workbook );
		// Once more, for Safari
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
	// Pull the executive-specific computed values
	var userRole = __OMEGA.user && __OMEGA.user.role;
	if ( userRole ) {
		var executivesPoints = XLSX.utils.sheet_to_json( __OMEGA.workbook.Sheets[ "Output (" + userRole + ")" ], { raw: true } );
		points = points.concat( executivesPoints );

		// Extract a possible "Error" field ( if present )
		var error = points.find( function ( point ) { return point.Name == "Error" } );
		__OMEGA.unitData.error = error ? error.Value : false;
	}

	// Extract the Grand Total line and give it special treatment
	var grandTotalLine = points.find( function ( point ) { return point.Name == "Grand Total" } );
	grandTotalLine.Name = __OMEGA.settings[ "\"Grand Total\" Label" ];
	grandTotalLine.Content = "Grand Total";
	grandTotalLine.Unit = __OMEGA.userInput.unitData.Unit;

	/*
	 *
	 * Filter out line items,
	 * - that are not to be displayed (i.e. hidden)
	 * - whose values are empty (unless they're not "Text" content type)
	 *
	*/
	points = points.filter( function ( point ) {
		if ( point.Hide )
			// if ( point.Name == "Grand Total" )
			// 	return true;
			// else
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

	// Append back the "Grand Total" line ( un-hide it first )
	grandTotalLine.Hide = false;
	points.push( grandTotalLine );

	return points;

}

function getComputedUnitDataForPrint () {

	// Pull the computed values
	var points = XLSX.utils.sheet_to_json( __OMEGA.workbook.Sheets[ "Output (PDF)" ], { raw: true } );

	/*
	 *
	 * Filter out line items,
	 * - that are not to be displayed (i.e. hidden)
	 * - whose values are empty (unless they're not "Text" content type)
	 *
	*/
	points = points.filter( function ( point ) {

		if ( point.Hide )
				return false;

		if ( ! point.Content )
			return false;

		if ( point.Value === 0 )
			return false;

		return true;

	} );

	return points;

}


function getDefaultModificationValues () {

	var defaults = { };
	var modifications = __OMEGA.modifications;

	for ( var name in modifications ) {

		var modification = modifications[ name ];
		var type = modification[ "Input type" ];

		if ( [ null, void 0 ].indexOf( modification[ "Default value" ] ) === -1 )
			defaults[ name ] = modification[ "Default value" ];
		else if ( type == "Manual" && modification[ "Minimum value" ] )
			defaults[ name ] = modification[ "Minimum value" ];
		else if ( type == "Multiple" )
			defaults[ name ] = modification.Options[ 0 ].value;
		else
			defaults[ name ] = "";

	}

	return defaults;

}



/*
 *
 * Set a cookie asynchronously
 *
 * @params
 * 	name -> the name of the cookie
 * 	data -> it's either an object with data that is to be encoded into the cookie, or a string that is simply to be the cookie's value with no processing whatsoever
 * 	duration -> how long before the cookie expires ( in seconds )
 *
 */
function setCookie ( name, data, duration ) {

	var url = location.origin;
	if ( __envProduction ) {
		url += "/" + document.getElementsByTagName( "base" )[ 0 ].getAttribute( "href" ).replace( /\//g, "" );
	}
	url += "/inc/set-cookie-async.php";
	var queryString = "?" + "_cookie=" + encodeURIComponent( name );
	queryString += "&_duration=" + encodeURIComponent( duration );
	if ( typeof data == "string" )
		queryString += "&value=" + encodeURIComponent( data );
	else
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



/*
 *
 * "Track" a page visit
 *
 * @params
 * 	name -> the url of the page
 *
 */
function trackPageVisit ( name ) {

	/*
	 *
	 * Open a blank page and add the tracking code to it
	 *
	 */
	// Build the URL
	var projectBaseURL = __OMEGA.settings.projectBaseURL;
	var baseURL = location.origin.replace( /\/$/, "" ) + "/" + projectBaseURL + "/trac";
	name = name.replace( /^[/]*/, "" );
	var url = baseURL + "/" + name;

	// Build the iframe
	var domIframe = openPageInIframe( url, "Tracking and Analytics" );

	setTimeout( function () {

		// Inject the tracking code
		var domDocument = domIframe.contentWindow.document;
		$( domDocument.head ).find( "title" ).text( "Tracking" );
		$( domDocument.head ).append( __OMEGA.settings.beforeClosingHeadTag );
		$( domDocument.body ).prepend( __OMEGA.settings.afterOpeningBodyTag );
		$( domDocument.body ).append( __OMEGA.settings.beforeClosingBodyTag );

		// Remove the iframe after a while
		setTimeout( function () { $( domIframe ).remove() }, 27 * 1000 );

	}, 1500 );

}



/*
 *
 * "Post" a mail
 *
 * @params
 * 	name -> the url of the page
 *
 */
function postMail ( subject, body, to ) {

	var data = {
		subject,
		body,
		to
	};

	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/mail";

	var ajaxRequest = $.ajax( {
		url: url,
		method: "POST",
		data: data,
		dataType: "json"
	} );

	return new Promise( function ( resolve, reject ) {
		ajaxRequest.done( function ( response ) {
			resolve( response );
		} );
		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var errorResponse = getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );
	} );

}
