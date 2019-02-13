
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


/*
 *
 * Gets a user (lead) from the database, given an id.
 *
 * Returns a promise with,
 * @params
 * 	user -> an object containing data on the user (lead)
 *
 */
function getLead ( identifyingAttribute, options ) {

	if ( identifyingAttribute && typeof identifyingAttribute == "object" ) {
		options = identifyingAttribute;
		identifyingAttribute = null;
	}
	else
		options = options || { };


	identifyingAttribute = identifyingAttribute || user.uid;
	options.by = options.by || 'uidv2';

	var project = __OMEGA.settings.Project;
	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/users";

	var data = { }
	data[ options.by ] = identifyingAttribute;
	// If we're getting the user by UID
		// Only send the project through if an executive is using the system
	if ( options.by.startsWith( "uid" ) ) {
		if ( __OMEGA.user && __OMEGA.user.role )
			data.project = project;
	}
	else {
		data.project = project;
	}

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
			var errorResponse = getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );

	} );

}
