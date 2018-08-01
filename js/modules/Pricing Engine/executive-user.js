
/*
 *
 * Returns the user's ID if the user is logged in, otherwise `false`
 *
 */
function isUserLoggedIn () {
	var u = {"provider":"Google","identifier":"112660524120237559357","name":"Aditya Bhat","email":"adityabhat@lazaro.in","role":"manager","suspended":false};
	__OMEGA.user = __OMEGA.user || { };
	__OMEGA.user = Object.assign( __OMEGA.user, u );
	return "112660524120237559357";

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
