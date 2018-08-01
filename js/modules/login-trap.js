
/*
 *
 * Login form ( on the Unit Listing section )
 *
 */
Loginner.registerLoginPrompt( "Unit Listing", {
	onTrigger: function ( event ) {
		$( ".js_unit_listing_login_prompt" )
			.addClass( "show" )
			.find( ".js_phone_form_section" ).addClass( "show" );
	},
	onPhoneValidationError: function ( message ) {
		$( this ).find( ".js_feedback_error" ).text( message )
	},
	onOTPValidationError: function ( message ) {
		$( this ).find( ".js_feedback_error" ).text( message )
	},
	onShowOTP: function ( domPhoneForm, domOTPForm ) {
		$( domPhoneForm ).parent().removeClass( "show" );
		$( domOTPForm ).parent().addClass( "show" );
	},
	onPhoneError: function ( code, message ) {
		alert( message );
	},
	onOTPError: function ( code, message ) {
		$( this ).find( ".js_feedback_error" ).text( message )
	},
	onLogin: function () {
		$( ".js_unit_listing_login_prompt" ).removeClass( "show" );
		// Pre-fill the Enquiry Form with the user's phone number
		$( ".js_enquiry_form" ).find( "[ name = 'phone' ]" ).val( __OMEGA.user.phoneNumber );
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
		$( this ).find( ".js_feedback_error" ).text( message )
	},
	onOTPValidationError: function ( message ) {
		$( this ).find( ".js_feedback_error" ).text( message )
	},
	onShowOTP: function ( domPhoneForm, domOTPForm ) {
		$( domPhoneForm ).parent().removeClass( "show" );
		$( domOTPForm ).parent().addClass( "show" );
	},
	onPhoneError: function ( code, message ) {
		alert( message );
	},
	onOTPError: function ( code, message ) {
		$( this ).find( ".js_feedback_error" ).text( message )
	},
	onLogin: function () {
		$( ".js_page_login_prompt" ).slideUp();
		setTimeout( function () {
			$( document ).trigger( "user/logged-in" );
		}, 500 );
		// Pre-fill the Enquiry Form with the user's phone number
		$( ".js_enquiry_form" ).find( "[ name = 'phone' ]" ).val( __OMEGA.user.phoneNumber );
	}
} );

// When "Enter Different Number" link is hit
$( document ).on( "click", ".js_page_login_prompt .js_reenter_phone", function ( event ) {
	$( ".js_page_login_prompt" ).find( ".loginner_form_otp" ).parent().removeClass( "show" );
	$( ".js_page_login_prompt" ).find( ".loginner_form_otp" ).get( 0 ).reset();
	$( ".js_page_login_prompt" ).find( ".loginner_form_phone" ).parent().addClass( "show" )
	$( ".js_page_login_prompt" ).find( ".loginner_form_phone" ).find( "input, select, button" ).prop( "disabled", false );
} );
