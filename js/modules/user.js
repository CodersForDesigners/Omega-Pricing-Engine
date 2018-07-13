
/*
 *
 * When the login prompt is to be shown
 *
 */
$( document ).on( "user/login/show", function () {

	var phoneNumber = prompt( "Please provide your phone number:" );
	// alert( phoneNumber );
	$( document ).trigger( "user/authenticate", { phoneNumber: phoneNumber } )

} );



/*
 *
 * When a user's credentials have been authenticated and are legit
 *
 */
$( document ).on( "user/authenticate", function ( event, data ) {

	var phoneNumber = data.phoneNumber;

	// Fetch the user based on the phone number
	// Assume for now, it's all good.
	$( document ).trigger( "user/details/received" );

} );



/*
 *
 * When a user's credentials have been authenticated and are legit
 *
 */
$( document ).on( "user/authenticated", function ( event, data ) {

	// Create a cookie
	var cookieName = "omega-user";
	var cookieDuration = 90 * 24 * 60 * 60;
	setCookie( cookieName, data, cookieDuration );

} );



/*
 *
 * When a user's data is to be fetched
 *
 */
$( document ).on( "user/details/fetch", function ( event, data ) {

	// Fetch the lead based on the phone number
	var requestPayload = { id: data.id };
	var ajaxRequest = $.ajax( {
		url: "http://omega.api/api/v1/users",
		method: "GET",
		data: requestPayload,
		dataType: "json"
	} );
	ajaxRequest.done( function ( response ) {

		// Store the user data in the global state
		var userData = {
			verified: true,
			id: response.data.id,
			name: response.data.name,
			firstName: response.data.firstName,
			email: response.data.email,
			phoneNumber: response.data.phoneNumber
		};
		__OMEGA.user = userData;

		// Authenticate the user  ( what's this? )
		// $( document ).trigger( "user::authenticated", {
		// 	verified: true,
		// 	id: response.data.id
		// } );

		// Broadcast the user data
		$( document ).trigger( "user/details/received", userData );

	} );

} );
