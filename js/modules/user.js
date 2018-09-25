
/*
 *
 * When the pricing engine is accessed and a unit is intended to be viewed,
 * 	Check whether the user is logged into the system, otherwise show the login form.
 *
 *
 *
 */

/*
 *
 * Cookie library
 *
 * madmurphy/cookies.js
 *
 */
var docCookies={getItem:function(e){return e?decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null:null},setItem:function(e,o,n,t,r,c){if(!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e))return!1;var s="";if(n)switch(n.constructor){case Number:s=n===1/0?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+n;break;case String:s="; expires="+n;break;case Date:s="; expires="+n.toUTCString()}return document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(o)+s+(r?"; domain="+r:"")+(t?"; path="+t:"")+(c?"; secure":""),!0},removeItem:function(e,o,n){return this.hasItem(e)?(document.cookie=encodeURIComponent(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(n?"; domain="+n:"")+(o?"; path="+o:""),!0):!1},hasItem:function(e){return!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e)?!1:new RegExp("(?:^|;\\s*)"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},keys:function(){for(var e=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),o=e.length,n=0;o>n;n++)e[n]=decodeURIComponent(e[n]);return e}};"undefined"!=typeof module&&"undefined"!=typeof module.exports&&(module.exports=docCookies);

/*
 *
 * Public API
 *
 */
var Loginner = window.Loginner = { };
Loginner.prompts = { };
Loginner.registerLoginPrompt = function registerLoginPrompt ( name, handlers ) {
	Loginner.prompts[ name ] = handlers;
};

/*
 *
 * Gets a user from the database, given an id.
 *
 * Returns a promise with,
 * @params
 * 	user -> an object containing data on the user
 *
 */
function getUser ( identifyingAttribute, options ) {

	if ( ! identifyingAttribute ) {
		return;
	}

	options = options || { };
	options.by = options.by || 'uid';

	var project = __OMEGA.settings.Project;
	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/users";

	var data = { }
	data[ options.by ] = identifyingAttribute;
	data.project = project;

	var ajaxRequest = $.ajax( {
		url: url,
		method: "GET",
		data: data,
		dataType: "json"
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {
			var user = response.data;
			resolve( user );
		} );
		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var statusCode = -1;
			var message;
			if ( jqXHR.responseJSON ) {
				statusCode = jqXHR.responseJSON.statusCode;
				message = jqXHR.responseJSON.message;
			}
			else if ( typeof e == "object" ) {
				message = e.stack;
			}
			else {
				message = jqXHR.responseText;
			}
			reject( { code: statusCode, message: message } );
		} );

	} );

}

function triggerAuthFlowIfRequired ( event ) {

	// If the user is logged in, let the user through
	if ( isUserLoggedIn() )
		return;

	// If the user **is not** logged in, but limited preview(s) are being allowed
	// 		then also let the user through
	// 			but do set/update a/the cookie for the next time round
	var $targetElement = $( event.target ).closest( ".js_user_required" );
	var viewThreshold = $targetElement.data( "views" ) || 0;
	if ( timesUserHasBeenLetBefore() < viewThreshold ) {
		// Update ( or create ) the cookie
		var cookie = getCookieData( "omega-user-let" );
		if ( typeof cookie.views == "number" )
			cookie.views += 1;
		else
			cookie.views = 1;
		setCookie( "omega-user-let", cookie, 90 * 24 * 60 * 60 );
		return;
	}

	// If the user is **not** logged in, prevent the registered event handlers from executing
	event.preventDefault();
	event.stopImmediatePropagation();

	// Prompt the user to "log in"
	var loginPrompt = $( event.target ).closest( "[ data-loginner ]" ).data( "loginner" );
	if ( Loginner.prompts[ loginPrompt ] )
		Loginner.prompts[ loginPrompt ].onTrigger( event );
	$( document ).trigger( "user/login/prompt", { domLoginPromptTrigger: event.target } );

}

$( "body" ).on( "click", ".js_user_required:not( form )", triggerAuthFlowIfRequired );
$( "body" ).on( "submit", "form.js_user_required", triggerAuthFlowIfRequired );

// function getLoginPrompt ( domLoginPromptInitiator ) {

// 	var $loginInitiator = $( domLoginPromptInitiator );
// 	var loginPromptAddress = $loginInitiator.closest( "[ data-login ]" ).data( "login" );
// 	var $loginPrompt = $( loginPromptAddress );

// 	return $loginPrompt.get( 0 );

// }

/*
 *
 * When the login prompt is to be shown, contextual to the trigger
 *
 */
$( document ).on( "user/login/prompt", function ( event, data ) {

	// var domLoginPromptTrigger = data.domLoginPromptTrigger;
	// var domLoginPrompt = getLoginPrompt( domLoginPromptTrigger );

	// $( domLoginPrompt ).addClass( "show" );

} );



/*
 *
 * On submitting a phone number.
 *
 */
$( document ).on( "submit", ".loginner_form_phone", function ( event ) {

	/* -----
	 * Prevent the default form submission behaviour
	 * 	which triggers the loading of a new page
	 ----- */
	event.preventDefault();

	var $form = $( event.target );
	var domForm = $form.get( 0 );

	// Get the login prompt
	var loginPrompt = $form.closest( "[ data-loginner ]" ).data( "loginner" );

	/* -----
	 * Disable the form
	 ----- */
	$form.find( "input, select, button" ).prop( "disabled", true );

	/* -----
	 * Pull the data from the form
	 ----- */
	// country code
	$phoneCountryCode = $form.find( "[ name = 'phone-country-code' ]" );
	// phone number
	$phoneNumber = $form.find( "[ name = 'phone-number' ]" );

	/* -----
	 * Sanitize the data
	 ----- */
	// phone number
	$phoneNumber.val( function ( _i, value ) {
		return value.replace( /\D/g, "" );
	} );

	/* -----
	 * Assemble the data
	 ----- */
	var phoneNumber = $phoneCountryCode.val().replace( /[^+\d]/g, "" )
					+ $phoneNumber.val();

	/* -----
	 * Store the data on the side
	 ----- */
	__OMEGA.user = __OMEGA.user || { };
	__OMEGA.user.phoneNumber = phoneNumber;


	/* -----
	 * Process the data
	 ----- */
	// Authenticate the user
	Loginner.prompts[ loginPrompt ].onPhoneSend.call( domForm );
	getUser( phoneNumber, { by: "phoneNumber" } )
		.then( function ( user ) {
			// Store the user on the side
			__OMEGA.user = user;
			// If the user exists, log the user in
			loginUser( user );
			// Then, close the login prompt
			Loginner.prompts[ loginPrompt ].onLogin.call( domForm, user );
		} )
		.catch( function ( { code, message } ) {
			// If no user was found, send an OTP
			if ( code == 1 ) {
				return sendOTP( phoneNumber )
			}
			else { // code == -1
				Loginner.prompts[ loginPrompt ].onPhoneError.call( domForm, code, message );
			}
		} )
		.then( function ( otpSessionId ) {
			if ( ! otpSessionId ) return;
			__OMEGA.user = __OMEGA.user || { };
			__OMEGA.user.otpSessionId = otpSessionId;
			var domOTPForm = $form.closest( "[ data-loginner ]" ).find( ".loginner_form_otp" ).get( 0 );
			Loginner.prompts[ loginPrompt ].onShowOTP( domForm, domOTPForm );
		} )
		.catch( function ( { code, message } ) {
			if ( code == 1 ) {
				Loginner.prompts[ loginPrompt ].onPhoneError.call( domForm, code, message );
				$form.find( "input, select, button" ).prop( "disabled", false );
			}
		} );

} );



/*
 *
 * When the login OTP verification prompt is to be shown, contextual to the trigger
 *
 */
// $( document ).on( "user/login/otp/prompt", function ( event, data ) {

// 	var domContext = data.domContext;
// 	var domLoginPrompt = getLoginPrompt( domLoginPromptTrigger );

// 	$( domLoginPrompt ).find( ".loginner_form_phone" ).addClass( "invisible" );
// 	$( domLoginPrompt ).find( ".js_form_login_otp" ).removeClass( "invisible" );

// } );


/*
 *
 * Get a cookie
 *
 */
function getCookieData ( name ) {
	var cookieString;
	var cookieData;
	try {
		cookieString = docCookies.getItem( name );
		cookieData = JSON.parse( atob( cookieString ) );
	}
	catch ( e ) {}
	return cookieData || { };
}

/*
 *
 * Has the user been allowed to view authorized content before?
 *	And if so, how many times?
 *
 */
function timesUserHasBeenLetBefore () {

	var cookie = getCookieData( "omega-user-let" );
	return cookie.views || 0;

}


/*
 *
 * Send an OTP to a given phone number
 *
 */
function sendOTP ( phoneNumber ) {

	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var OTPTemplate = __OMEGA.settings.OTPTemplate;

	var ajaxRequest = $.ajax( {
		url: apiEndpoint + "/otp?phoneNumber=" + phoneNumber + "&template=" + OTPTemplate,
		method: "GET",
		dataType: "json"
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {

			if ( response.Status.toLowerCase() != "error" ) {
				// return the OTP Session ID
				resolve( response.Details );
				return;
			}

			var statusCode = 1;
			var responseErrorMessage = response.Details.toLowerCase();
			if ( /invalid/.test( responseErrorMessage ) ) {
				reject( { code: statusCode, message: "The phone number you've provided is not valid. Please try again." } );
			}

		} );

		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var statusCode = -1;
			var message;
			if ( jqXHR.responseJSON ) {
				statusCode = jqXHR.responseJSON.statusCode;
				message = jqXHR.responseJSON.message;
			}
			else if ( typeof e == "object" ) {
				message = e.stack;
			}
			else {
				message = jqXHR.responseText;
			}
			reject( { code: statusCode, message: message } );
			// reject( statusCode, "Something went wrong. Please try again." );
		} );

	} );

}



/*
 *
 * On submitting an OTP.
 *
 */
$( document ).on( "submit", ".loginner_form_otp", function ( event ) {

	/* -----
	 * Prevent the default form submission behaviour
	 * 	which triggers the loading of a new page
	 ----- */
	event.preventDefault();

	var $form = $( event.target );
	var domForm = $form.get( 0 );

	// Get the login prompt
	var loginPrompt = $form.closest( "[ data-loginner ]" ).data( "loginner" );

	// Confirm with the user if they're okay with us collecting their personal info
	// var userIsOkayWithOurTerms = window.confirm( "By saying \"OK\", you agree to our terms, of which there are many." );

	// if ( ! userIsOkayWithOurTerms ) {
		// alert( "Sorry, you won't be able to view the full pricing." );
		// return;
	// }

	/* -----
	 * Disable the form
	 ----- */
	$form.find( "input, select, button" ).prop( "disabled", true );

	/* -----
	 * Pull the data from the form
	 ----- */
	// OTP
	$otp = $form.find( "[ name = 'otp' ]" );

	/* -----
	 * Validate the data
	 ----- */
	// Remove any prior "error"s
	$form.find( ".js_error" ).removeClass( "js_error" );
	// OTP
	if ( ! $otp.val().trim() ) {
		$otp.addClass( "js_error" );
		// alert( "Please enter the OTP." );
		Loginner.prompts[ loginPrompt ].onOTPValidationError.call( $form.get( 0 ), "Please enter the OTP." );
	}
	// If the form has even one error ( i.e. validation issue )
	// do not proceed
	if ( $form.find( ".js_error" ).length ) {
		$form.find( "input, select, button" ).prop( "disabled", false );
		return;
	}

	/* -----
	 * Assemble the data
	 ----- */
	var otp = $otp.val();

	/* -----
	 * Process the data
	 ----- */
	// Verify the OTP
	Loginner.prompts[ loginPrompt ].onOTPSend.call( domForm );
	verifyOTP( otp )
		.then( function ( response ) {
			// If the OTP matched,
			var context = $form.closest( "[ data-loginner ]" ).data( "context" );
			// Register the user
			var phoneNumber = __OMEGA.user.phoneNumber;
			var project = __OMEGA.settings.Project;
				// Call the `onOTPVerified` hook
			if ( Loginner.prompts[ loginPrompt ].onOTPVerified )
				Loginner.prompts[ loginPrompt ].onOTPVerified( context, phoneNumber, project );

			createUser( phoneNumber, context, project )
				// Then, log in the user
				.then( function ( user ) {
					// Log the user in
					loginUser( user );
					// Then, close the login prompt
					Loginner.prompts[ loginPrompt ].onLogin.call( domForm, user );
				} )
				.catch( function ( { code, message } ) {
					if ( code == 1 ) {
						alert( message )
					}
				} )
			// Register a conversion
			// registerConversion( context );
			// Close the login prompt
			// closeLoginPrompt( loginPrompt );
		} )
		.catch( function ( { code, message } ) {
			if ( code == 1 ) {
				Loginner.prompts[ loginPrompt ].onOTPError.call( domForm, code, message );
				$form.find( "input, select, button" ).prop( "disabled", false );
			}
		} );

} );


/*
 *
 * Send an OTP to a given phone number
 *
 */
function verifyOTP ( otp ) {

	var apiEndpoint = __OMEGA.settings.apiEndpoint;

	var verificationFlow = $.ajax( {
		url: apiEndpoint + "/otp",
		method: "POST",
		data: {
			otp: otp,
			sessionId: __OMEGA.user.otpSessionId
		},
		dataType: "json"
	} );

	return new Promise( function ( resolve, reject ) {

		verificationFlow.done( function ( response ) {
			if ( response.Status.toLowerCase() != "error" ) {
				resolve( response.Details );
				return;
			}
			var statusCode = 1;
			var responseErrorMessage = response.Details.toLowerCase();
			if ( /mismatch/.test( responseErrorMessage ) ) {
				reject( { code: statusCode, message: "OTP does not match. Please try again." } );
			}
			else if ( /combination/.test( responseErrorMessage ) ) {
				reject( { code: statusCode, message: "OTP does not match. Please try again." } );
			}
			else if ( /expire/.test( responseErrorMessage ) ) {
				reject( { code: statusCode, message: "OTP has expired. Please try again." } );
			}
			else if ( /missing/.test( responseErrorMessage ) ) {
				reject( { code: statusCode, message: "Please provide an OTP." } );
			}
			else {
				reject( { code: statusCode, message: response.Details } );
			}
		} );
		verificationFlow.fail( function ( jqXHR, textStatus, e ) {
			var statusCode = -1;
			var message;
			if ( jqXHR.responseJSON ) {
				statusCode = jqXHR.responseJSON.statusCode;
				message = jqXHR.responseJSON.message;
			}
			else if ( typeof e == "object" ) {
				message = e.stack;
			}
			else {
				message = jqXHR.responseText;
			}
			reject( { code: statusCode, message: message } );
			// reject( statusCode, "The OTP you provided does not match the one we sent you." );
		} );

	} );

}



/*
 *
 * Create a user
 *
 */
function createUser ( phoneNumber, context, project ) {

	// Get the current timestamp
	var timestamp = getDateAndTimeStamp( { separator: "-" } );

	// Build the payload
	var userImplicitNamePrefix = __OMEGA.settings.userImplicitNamePrefix;
	var assignmentRuleId = __OMEGA.settings.assignmentRuleId;
	var requestPayload = {
		phoneNumber: phoneNumber,
		firstName: userImplicitNamePrefix + " " + context,
		lastName: timestamp,
		project: project,
		assignmentRuleId: assignmentRuleId
	};

	// Fetch the lead based on the phone number
	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var createUser__AjaxRequest = $.ajax( {
		url: apiEndpoint + "/users",
		method: "POST",
		data: requestPayload
	} );

	return new Promise( function ( resolve, reject ) {

		createUser__AjaxRequest.done( function ( response ) {
			var userData = {
				_id: response.data._id,
				phoneNumber: phoneNumber
			};
			__OMEGA.user = userData;

			resolve( userData );
		} );

		createUser__AjaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var statusCode = -1;
			var message;
			if ( jqXHR.responseJSON ) {
				statusCode = jqXHR.responseJSON.statusCode;
				message = jqXHR.responseJSON.message;
			}
			else if ( typeof e == "object" ) {
				message = e.stack;
			}
			else {
				message = jqXHR.responseText;
			}
			reject( { code: statusCode, message: message } );
		} );

	} );

}

/*
 *
 * Update a user
 *
 */
function updateUser ( id, project, data ) {

	// Build the payload
	var requestPayload = { fields: data };

	return new Promise( function ( resolve, reject ) {

		// Fetch the lead based on the phone number
		var apiEndpoint = __OMEGA.settings.apiEndpoint;
		var updateUser__AjaxRequest = $.ajax( {
			url: apiEndpoint + "/users/" + id,
			method: "POST",
			data: requestPayload
		} );
		updateUser__AjaxRequest.done( function ( response ) {
			// var userData = response.data;
			// __OMEGA.user = userData;

			// resolve( userData );
			resolve();
		} );
		updateUser__AjaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var statusCode = -1;
			var message;
			if ( jqXHR.responseJSON ) {
				statusCode = jqXHR.responseJSON.statusCode;
				message = jqXHR.responseJSON.message;
			}
			else if ( typeof e == "object" ) {
				message = e.stack;
			}
			else {
				message = jqXHR.responseText;
			}
			reject( { code: statusCode, message: message } );
		} );

	} );

}

/*
 *
 * Gets the latest details on a user and saves it in memory
 *
 */
function loginUser ( user ) {
	// Create a cookie
	var cookieName = "omega-user";
	var cookie = {
		_id: user._id,
		uid: user.uid,
		phoneNumber: user.phoneNumber,
		project: user.project,
	}
	setCookie( cookieName, cookie, 90 * 24 * 60 * 60 );
}

/*
 *
 * Register a conversion
 *
 */
function registerConversion ( name ) {

	var url = location.origin + "/trac/" + name;

	var $iframe = $( "<iframe>" );
	$iframe.attr( {
		width: 0,
		height: 0,
		title: "Analytics and Tracking",
		src: url,
		style: "display:none;",
		class: "js_iframe_trac"
	} );

	$( "body" ).append( $iframe );

	var domIframe = $iframe.get( 0 );
	domIframe.contentWindow.onload = function ( e ) {
		setTimeout( function () {
			$iframe.remove();
		}, 25000 );
	}

}

/*
 *
 * Close a given login prompt
 *
 */
// function closeLoginPrompt ( domContext ) {
// 	$( domContext ).addClass( "invisible" );
// }
