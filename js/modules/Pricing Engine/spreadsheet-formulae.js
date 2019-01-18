
/*
 *
 * -/-/-/-/-/-/-/-/-
 * This file adds support for more spreadsheet formulaes.
 * -/-/-/-/-/-/-/-/-
 *
 */
( function ( rootNamespace ) {

	/*
	 * Utility constants
	 */
	var errors = {
		error: new Error( "#ERROR!" ),
		value: new Error( "#VALUE!" ),
		number: new Error( "#NUM!" ),
		na: new Error( "#N/A!" ),
	}
	var daysOfTheWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	var monthsOfTheYear = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	var dayOrdinals = [ "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st" ];

	/*
	 * Utility functions
	 */
	var utils = { };

	utils.anyIsError = function anyIsError () {
		var n = arguments.length;
		while ( n-- ) {
			if ( arguments[ n ] instanceof Error ) {
				return true;
			}
		}
		return false;
	};

	utils.parseNumber = function parseNumber ( string ) {
		if ( string === undefined || string === "" ) {
			return errors.value;
		}
		if ( ! isNaN( string ) ) {
			return parseFloat( string );
		}
		return errors.value;
	};

		// January 1st, 1900
	var date__01_01_1900 = new Date( Date.UTC( 1900, 0, 1 ) );
	utils.parseDate = function ( date ) {
		if ( ! isNaN( date ) ) {
			if ( date instanceof Date ) {
				return new Date( date );
			}
			var d = parseInt( date, 10 );
			if ( d < 0 ) {
				return errors.number;
			}
			if ( d <= 60 ) {
				return new Date( date__01_01_1900.getTime() + ( d - 1 ) * 86400000 );
			}
			return new Date( date__01_01_1900.getTime() + ( d - 2 ) * 86400000 );
		}
		if ( typeof date === 'string' ) {
			date = new Date( date );
			if ( ! isNaN( date ) ) {
				return date;
			}
		}
		return errors.value;
	};

	utils.argsToArray = function argsToArray ( args ) {
		var result = [ ];

		utils.arrayEach( args, function ( value ) {
			result.push( value );
		} );

		return result;
	};

	utils.arrayEach = function arrayEach ( array, iteratee ) {
		var index = -1, length = array.length;

		while ( ++index < length ) {
			if ( iteratee( array[ index ], index, array ) === false ) {
				break;
			}
		}

		return array;
	};

	utils.isFlat = function isFlat ( array ) {
		if ( ! array ) {
			return false;
		}

		for ( var i = 0; i < array.length; ++i ) {
			if ( Array.isArray( array[ i ] ) ) {
				return false;
			}
		}

		return true;
	};

	utils.flattenShallow = function flattenShallow ( array ) {
		if ( ! array || ! array.reduce ) {
			return array;
		}

		return array.reduce( function( a, b ) {
			var aIsArray = Array.isArray( a );
			var bIsArray = Array.isArray( b );

			if ( aIsArray && bIsArray ) {
				return a.concat( b );
			}
			if ( aIsArray ) {
				a.push( b );
				return a;
			}
			if ( bIsArray ) {
				return [ a ].concat( b );
			}

			return [ a, b ];
		} );
	};

	utils.flatten = function flatten () {
		var result = utils.argsToArray.apply( null, arguments );

		while ( ! utils.isFlat( result ) ) {
			result = utils.flattenShallow( result );
		}

		return result;
	};

	function dateToString () {

		var dayOfTheWeek = daysOfTheWeek[ this.getDay() ];
		var month = monthsOfTheYear[ this.getMonth() ];
		var year = this.getFullYear();
		var dayOfTheMonth = this.getDate();
		var dayOfTheMonthOrdinal = dayOrdinals[ dayOfTheMonth ];

		var string = dayOfTheWeek + ", "
					+ month + " "
					+ dayOfTheMonth
					+ dayOfTheMonthOrdinal + ", "
					+ year;

		return string;

	}



	/*
	 * Formulae functions
	 */
	var formulae = { };


	formulae.TRUE = function () {
		return true;
	};

	formulae.FALSE = function () {
		return false;
	};

	formulae.NOT = function ( logical ) {
		return ! logical;
	};

	formulae.OR = function () {
		var args = utils.flatten( arguments );
		var result = false;
		for ( var i = 0; i < args.length; i +=1 ) {
			if ( args[ i ] ) {
				result = true;
				break;
			}
		}
		return result;
	};

	formulae.AND = function () {
		var args = utils.flatten( arguments );
		var result = true;
		for ( var i = 0; i < args.length; i +=1 ) {
			if ( ! args[ i ] ) {
				result = false;
			}
		}
		return result;
	};

	formulae.NE = function ( operand1, operand2 ) {
		return operand1 != operand2;
	};

	formulae.CHOOSE = function () {
		if ( arguments.length < 2 )
			return error.na;

		var index = arguments[ 0 ];
		if ( index < 1 || index > 254 )
			return error.value;

		if ( arguments.length < index + 1 )
			return error.value;

		return arguments[ index ];
	};

	formulae.CONCATENATE = function () {
		var args = utils.flatten( arguments );

		var trueFound = 0;
		while ( ( trueFound = args.indexOf( true ) ) > -1 ) {
			args[ trueFound ] = "TRUE";
		}

		var falseFound = 0;
		while ( ( falseFound = args.indexOf( false ) ) > -1 ) {
			args[ falseFound ] = "FALSE";
		}

		return args.join( "" );
	};

	formulae.ROUND = function( number, digits ) {
		number = utils.parseNumber( number );
		digits = utils.parseNumber( digits );
		if ( utils.anyIsError( number, digits ) ) {
			return error.value;
		}
		return Math.round( number * Math.pow( 10, digits ) ) / Math.pow( 10, digits );
	};

	formulae.ROUNDUP = function ( number, digits ) {
		number = utils.parseNumber( number );
		digits = utils.parseNumber( digits );
		if ( utils.anyIsError( number, digits ) ) {
			return errors.value;
		}
		var sign = ( number > 0 ) ? 1 : -1;
		return sign * ( Math.ceil( Math.abs( number ) * Math.pow( 10, digits ) ) ) / Math.pow( 10, digits );
	};

	formulae.ROUNDDOWN = function ( number, digits ) {
		number = utils.parseNumber( number );
		if ( digits === void 0 ) digits = 0;
		digits = utils.parseNumber( digits );
		if ( utils.anyIsError( number, digits ) ) {
			return errors.value;
		}
		var sign = ( number > 0 ) ? 1 : -1;
		return sign * ( Math.floor( Math.abs( number ) * Math.pow( 10, digits ) ) ) / Math.pow( 10, digits );
	};

		/*
		 * Dates and Times
		 */
	formulae.TODAY = function () {
		return new Date();
	};

	formulae.YEAR = function ( date ) {

		date = utils.parseDate( date );

		if ( date instanceof Error ) {
			return date;
		}

		return date.getFullYear();

	};

	formulae.MONTH = function ( date ) {

		date = utils.parseDate( date );

		if ( date instanceof Error ) {
			return date;
		}

		return date.getMonth() + 1;

	}

	formulae.DAY = function ( date ) {

		date = utils.parseDate( date );

		if ( date instanceof Error ) {
			return date;
		}

		return date.getDate();

	};

	formulae.WEEKDAY = function ( date, baseFormat ) {

		date = utils.parseDate( date );

		if ( date instanceof Error ) {
			return date;
		}

		var dayInSequence = date.getDay();
		baseFormat = baseFormat || 1;
		// reference:
		// 	WEEKDAY function in Google Sheets
		// 	https://support.google.com/docs/answer/3092985?hl=en
		if ( baseFormat == 1 )
			return dayInSequence + 1;
		if ( baseFormat == 2 )
			return dayInSequence ? dayInSequence : 7;
		if ( baseFormat == 3 )
			return dayInSequence ? dayInSequence - 1 : 6;

	};

	formulae.DATE = function ( year, month, day ) {

		var result;

		var year = utils.parseNumber( year );
		var month = utils.parseNumber( month );
		var day = utils.parseNumber( day );

		if ( utils.anyIsError( year, month, day ) ) {
			result = errors.value;
		}
		else if ( year < 0 || month < 0 || day < 0 ) {
			result = errors.number;
		}
		else {
			result = new Date( year, month - 1, day );
			result.toString = dateToString;
		}

		return result;

	};

	// stub
	formulae.TRANSPOSE = function ( ) {};





	rootNamespace.spreadsheetFormulae = formulae;

} )( window );
