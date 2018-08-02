
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
