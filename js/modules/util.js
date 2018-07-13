
__UTIL = { };

/*
 * functions based on native operations
 */
__UTIL.comparators = {
	"is equal to": function ( operand1, operand2 ) {
		return operand1 == operand2;
	},
	"is not equal to": function ( operand1, operand2 ) {
		return operand1 != operand2;
	},
	"is greater than to": function ( operand1, operand2 ) {
		return operand1 > operand2;
	},
	"is greater than or equal to": function ( operand1, operand2 ) {
		return operand1 >= operand2;
	},
	"is less than to": function ( operand1, operand2 ) {
		return operand1 < operand2;
	},
	"is less than or equal to": function ( operand1, operand2 ) {
		return operand1 <= operand2;
	}
};
__UTIL.comparators[ "is" ] = __UTIL.comparators[ "is equal to" ];
__UTIL.comparators[ "=" ] = __UTIL.comparators[ "is equal to" ];
__UTIL.comparators[ "==" ] = __UTIL.comparators[ "is equal to" ];
// __UTIL.comparators[ "===" ] = __UTIL.comparators[ "is deep equal to" ];
__UTIL.comparators[ "is not" ] = __UTIL.comparators[ "is not equal to" ];
__UTIL.comparators[ "!=" ] = __UTIL.comparators[ "is not equal to" ];
__UTIL.comparators[ "<>" ] = __UTIL.comparators[ "is not equal to" ];
// __UTIL.comparators[ "!==" ] = __UTIL.comparators[ "is not deep equal to" ];
__UTIL.comparators[ ">" ] = __UTIL.comparators[ "is greater than to" ];
__UTIL.comparators[ ">=" ] = __UTIL.comparators[ "is greater than or equal to" ];
__UTIL.comparators[ "<" ] = __UTIL.comparators[ "is less than to" ];
__UTIL.comparators[ "<=" ] = __UTIL.comparators[ "is less than or equal to" ];



/*
 * Renders a template with data
 */
__UTIL.renderTemplate = function () {

	var d;
	function replaceWith ( m ) {

		var pipeline = m.slice( 2, -2 ).trim().split( / *\| */ );
		var value = d[ pipeline[ 0 ] ];
		for ( var _i = 1; _i < pipeline.length; _i +=1 ) {
			value = __UTIL.template[ pipeline[ _i ] ]( value );
		}

		return value;

	}

	return function renderTemplate ( template, data ) {
		d = data;
		return template.replace( /({{[^{}]+}})/g, replaceWith );
	}

}();

__UTIL.template = { };
__UTIL.template.getTemplateName = function getTemplateName () {
	return Array.prototype.slice.call( arguments, 0, arguments.length - 1 ).join( "" );
};
__UTIL.template.INR = formatNumberToIndianRupee;
// A template helper that gives the floor number in an ordinal word form
__UTIL.template.floorInOrdinalWord = function () {
	var floorToWords = [ "Ground", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third", "Twenty-Fourth", "Twenty-Fifth", "Twenty-Sixth", "Twenty-Seventh" ];
	return function floorInOrdinalWord ( floor ) {
		return floorToWords[ floor ] || "";
	}
}();
__UTIL.template.isMultipleOf = function isMultipleOf ( number, multipleOf ) {
	return number % multipleOf == 0;
};
__UTIL.template.hiddenIfNull = function hiddenIfNull ( thing ) {
	return thing ? "" : "hidden";
};

/*
 *
 * Group an list of elements by a specific attribute
 *
 * For example,
 * 	[ { n: 1, y: "a" }, { n: 5, y: "e" }, { n: 1, y: "la" }, { n: 6, y: "f" } ]
 * 	grouped by `n`, will be
 *	{
 * 		"1": [ { n: 1, y: "a" }, { n: 1, y: "la" } ],
 * 		"5": [ { n: 5, y: "e" } ],
 * 		"6": [ { n: 6, y: "f" } ]
 * 	}
 *
 */
__UTIL.groupListBy = function groupListBy ( list, by ) {
	var groupedObject = { };
	var _i;
	var listLength = list.length;
	var value;
	for ( _i = 0; _i < listLength; _i += 1 ) {
		value = list[ _i ][ by ]
		if ( ! ( value in groupedObject ) )
			groupedObject[ value ] = [ list[ _i ] ];
		else
			groupedObject[ value ] = groupedObject[ value ].concat( [ list[ _i ] ] );
	}
	return groupedObject;
};

/*
 *
 * Parse a number formatted as a string to valid JavaScript number
 *
 */
function parseStringToNumber ( value ) {

	// If the value is not a string, return it back
	if ( typeof value != "string" )
		return value;

	// If the value contains any character other than a digit, comma or a decimal point, return it back
	if ( /[^\d\.,]/.test( value ) )
		return value;

	return parseFloat( value.replace( /,/g, "" ) );

}

/*
 *
 * Format a number to an Indian Rupee
 *
 */
function formatNumberToIndianRupee ( number, options ) {

	options = options || { };
	var formattedNumber;

	var roundedNumber = number.toFixed( 0 );
	var integerAndFractionalParts = ( roundedNumber + "" ).split( "." );
	var integerPart = integerAndFractionalParts[ 0 ];
	var fractionalPart = integerAndFractionalParts[ 1 ];

	var lastThreeDigitsOfIntegerPart = integerPart.slice( -3 );
	var allButLastThreeDigitsOfIntegerPart = integerPart.slice( 0, -3 );

	formattedNumber = allButLastThreeDigitsOfIntegerPart.replace( /\B(?=(\d{2})+(?!\d))/g, "," );

	if ( allButLastThreeDigitsOfIntegerPart ) {
		formattedNumber += ",";
	}
	formattedNumber += lastThreeDigitsOfIntegerPart;

	if ( fractionalPart ) {
		formattedNumber += "." + fractionalPart;
	}

	var symbol = options.symbol === false ? "" : "₹";
	if ( /^-/.test( formattedNumber ) ) {
		formattedNumber = formattedNumber.replace( /^-/, "minus " + symbol );
	}
	else {
		formattedNumber = symbol + formattedNumber;
	}

	return formattedNumber;

}


/*
 *
 * Animate the count-down or count-up of a number in the INR format
 *
 */
function countToAmount ( $el, amount ) {

	// Cancel any animations that are already in progress for this element
	$el.stop( true );

	// We want to explicitly the starting point for the animation.
	// The is only needed for the first time an animation on an element is run.
	var currentAmount = $el.text().replace( /[^\d\.]/g, "" );
	$el.animate( { amount: currentAmount }, 0 ).stop( true, true );

	// Now, tween on!
	$el.animate( { amount: amount }, {
		duration: 999,
		progress: function () {
			$el.text( formatNumberToIndianRupee( this.amount ) );
		}
	} );

}

function waitFor ( seconds ) {

	return new Promise( function ( resolve, reject ) {
		setTimeout( function () {
			resolve();
		}, seconds * 1000 );
	} );

}
