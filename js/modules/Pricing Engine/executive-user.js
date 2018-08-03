
/*
 *
 * Returns the user's ID if the user is logged in, otherwise `false`
 *
 */
function isUserLoggedIn () {
	var cookieString;
	var cookieData;
	try {
		cookieString = docCookies.getItem( "ruser" );
		cookieData = JSON.parse( atob( cookieString ) );
	} catch ( e ) {
		return false;
	}
	// Store the parsed cookie data in the application state
	__OMEGA.user = __OMEGA.user || { };
	__OMEGA.user = Object.assign( __OMEGA.user, cookieData );
	return cookieData.identifier;
}
