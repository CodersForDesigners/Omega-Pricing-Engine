
/*
 *
 * Returns the user's ID if the user is logged in, otherwise `false`
 *
 */
function isUserLoggedIn () {
	var cookieString;
	var cookieData;
	try {
		cookieString = docCookies.getItem( "omega-user" );
		cookieData = JSON.parse( atob( cookieString ) );
		if ( ! cookieData.uid )
			return false;
	} catch ( e ) {
		return false;
	}
	// Store the parsed cookie data in the application state
	__OMEGA.user = __OMEGA.user || { };
	__OMEGA.user = Object.assign( __OMEGA.user, cookieData );
	return cookieData.uid;
}
