
/*
 *
 * Login form ( on the Unit Listing section )
 *
 */
Loginner.registerLoginPrompt( "Unit Listing", {
	onTrigger: function ( event ) {
		// Set the heading
		var loginPromptHeading = __OMEGA.settings[ "Login Prompt Heading" ];
		$( ".js_login_prompt_heading" ).text( loginPromptHeading );

		$( ".js_unit_listing_login_prompt .js_phone_form_section" )
			.addClass( "show" )
			.find( "input, button" ).prop( "disabled", false )
		$( ".js_unit_listing_login_prompt .js_otp_form_section" ).removeClass( "show" );
		$( ".js_unit_listing_login_prompt" ).addClass( "show" );
	},
	onPhoneValidationError: function ( message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
	},
	onOTPValidationError: function ( message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
	},
	onPhoneSend: function () {
		$( this ).find( "[ type = submit ]" ).text( "Sending" );
	},
	onShowOTP: function ( domPhoneForm, domOTPForm ) {
		$( domPhoneForm ).parent().removeClass( "show" );
		$( domOTPForm ).parent().addClass( "show" );
	},
	onOTPSend: function () {
		$( this ).find( "[ type = submit ]" ).text( "Sending" );
	},
	onPhoneError: function ( code, message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
		$( this ).find( "[ type = submit ]" ).text( "Send" );
		$( this ).find( "input, select, button" ).prop( "disabled", false );
	},
	onOTPError: function ( code, message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
		$( this ).find( "[ type = submit ]" ).text( "Send" );
		$( this ).find( "input, select, button" ).prop( "disabled", false );
	},
	onOTPVerified: function ( context, phoneNumber ) {
		var url = "user/new/" + context.toLowerCase().replace( /[\s|]+/g, "-" );
		trackPageVisit( url );
	},
	onLogin: function ( user ) {

		// Hide the login form
		$( ".js_unit_listing_login_prompt" ).removeClass( "show" );

		// Show a welcome back message
		var userImplicitNamePrefix = __OMEGA.settings[ "User Implicit Name Prefix" ];
		var message = "Welcome back";
		if ( user.name.startsWith( userImplicitNamePrefix ) )
			message += "!";
		else
			message += ", " + user.firstName + ".";

		notify( message, {
			level: "info",
			context: "Login Prompt"
		} );

	},
	onRetry: function ( domForm ) {
		$( domForm ).find( "input, select, button" ).prop( "disabled", false );
	}
} );

// When the close button is hit
$( document ).on( "click", ".js_close_unit_listing_login_prompt", function ( event ) {
	$( ".js_unit_listing_login_prompt" ).removeClass( "show" );
} );

// When "Enter Different Number" link is hit
$( document ).on( "click", ".js_unit_listing_login_prompt .js_reenter_phone", function ( event ) {
	$( ".js_unit_listing_login_prompt" ).find( ".loginner_form_otp" ).parent().removeClass( "show" );
	$( ".js_unit_listing_login_prompt" ).find( ".loginner_form_otp" ).get( 0 ).reset();
	$( ".js_unit_listing_login_prompt" ).find( ".loginner_form_phone" ).parent().addClass( "show" )
	$( ".js_unit_listing_login_prompt" ).find( ".loginner_form_phone" ).find( "input, select, button" ).prop( "disabled", false );
} );







/*
 *
 * Login form ( on the Individual Unit Page )
 *
 */
Loginner.registerLoginPrompt( "Individual Unit View", {
	// onTrigger: function ( event ) {
	// 	$( ".js_unit_listing_login_prompt" ).addClass( "show" );
	// },
	onPhoneValidationError: function ( message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
		// $( this ).find( ".js_feedback_error" ).text( message )
	},
	onOTPValidationError: function ( message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
	},
	onPhoneSend: function () {
		$( this ).find( "[ type = submit ]" ).text( "Sending" );
	},
	onShowOTP: function ( domPhoneForm, domOTPForm ) {
		$( domPhoneForm ).parent().removeClass( "show" );
		$( domOTPForm ).parent().addClass( "show" );
	},
	onOTPSend: function () {
		$( this ).find( "[ type = submit ]" ).text( "Sending" );
	},
	onPhoneError: function ( code, message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
		$( this ).find( "[ type = submit ]" ).text( "Send" );
	},
	onOTPError: function ( code, message ) {
		notify( message, {
			level: "error",
			context: "Login Prompt"
		} );
		$( this ).find( "[ type = submit ]" ).text( "Send" );
	},
	onOTPVerified: function ( context, phoneNumber ) {
		var url = "user/new/" + context.toLowerCase().replace( /[\s|]+/g, "-" );
		trackPageVisit( url );
	},
	onLogin: function ( user ) {

		// Hide the login form
		$( ".js_page_login_prompt" ).slideUp();
		setTimeout( function () {
			$( document ).trigger( "user/logged-in" );
		}, 500 );

		// Show a welcome back message
		var userImplicitNamePrefix = __OMEGA.settings[ "User Implicit Name Prefix" ];
		var message = "Welcome back";
		if ( user.name.startsWith( userImplicitNamePrefix ) )
			message += "!";
		else
			message += ", " + user.firstName + ".";

		notify( message, {
			level: "info",
			context: "Login Prompt"
		} );

	}
} );

// When "Enter Different Number" link is hit
$( document ).on( "click", ".js_page_login_prompt .js_reenter_phone", function ( event ) {
	$( ".js_page_login_prompt" ).find( ".loginner_form_otp" ).parent().removeClass( "show" );
	$( ".js_page_login_prompt" ).find( ".loginner_form_otp" ).get( 0 ).reset();
	$( ".js_page_login_prompt" ).find( ".loginner_form_phone" ).parent().addClass( "show" )
	$( ".js_page_login_prompt" ).find( ".loginner_form_phone" ).find( "input, select, button" ).prop( "disabled", false );
} );
