
/*
 *
 * On logging in,
 *	Log a note to the user's record on the CRM
 *
 */
$( document ).on( "user/logged-in", function ( event, data ) {

	var noteContent = "Omega Event Log";
	addNoteToUser( "Customer SEARCHED for Units on the Listing Page.", noteContent );

} );

/*
 *
 * On viewing ( specifically, after rendering ) the "index" Pricing page,
 *	if the user is already logged in and
 * 		if the user was last seen **more than an hour ago**
 * 	then log a note to the user's record on the CRM
 *
 */
$( document ).on( "pricing-engine/render/after", function ( event, data ) {

	if ( $( "html" ).data( "page" ) != "page-pricing-index" )
		return;

	getUser( { meta: true } ).then( function ( user ) {

		if ( user.lastSeenAt )
			if ( Date.now() - parseInt( user.lastSeenAt, 10 ) < ( 60 * 60 * 1000 ) )
				return loginUser( user );

		var noteContent = "Customer SEARCHED for Units on the Listing Page.";
		addNoteToUser( "Omega Event Log", noteContent );
		// Update the user object "cookie" entry with a fresh `lastSeenAt` timestamp
		user.lastSeenAt = Date.now();
		loginUser( user );

	} );

} );

/*
 *
 * On viewing a unit,
 *	1. Log a note to the user's record on the CRM
 *
 */
$( document ).on( "unit/view/done", function ( event, data ) {

	if ( data.context == "modification" )
		return;

	var unitNumber = data.unitNumber;
	var noteContent = "Customer viewed unit #" + unitNumber + " on the Pricing Engine";
	addNoteToUser( "Omega Customer Insights", noteContent );

} );
