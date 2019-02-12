
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ NOTIFICATIONS
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Notifications
	__UI.$notificationSection = $( ".js_notification_section" );

} );

/*
 *
 * When the close button on a notification is hit,
 * 	discard it.
 *
 */
$( document ).on( "click", ".js_notification_section .js_notification_close", function ( event ) {

	var $notification = $( event.target ).closest( ".js_notification" );
	$notification.remove();

} );

/*
 *
 * On devices of a certain height,
 * 	hide the "To see all available Apartments, Click Here" on scrolling down
 *
 */
$( function () {

	if ( $( "html" ).hasClass( "page-pricing-individual" ) ) {

		var toggleNavigationBar = function () {

			var lastScrollTopPosition = window.scrollY || document.body.scrollTop
			var $navigationBar = __UI.$notificationSection.find( ".js_user_bar" );

			return function toggleNavigationBar () {

				var currentScrollTopPosition = window.scrollY || document.body.scrollTop;

				// When scrolling down, hide the navigation bar
				if ( currentScrollTopPosition > lastScrollTopPosition )
					$navigationBar.addClass( "hide" );
				// When scrolling up, show the navigation bar
				else if ( currentScrollTopPosition < lastScrollTopPosition )
					$navigationBar.removeClass( "hide" );

				lastScrollTopPosition = currentScrollTopPosition;

			};

		}();

		$( window ).on( "scroll", toggleNavigationBar );

	}

} );
