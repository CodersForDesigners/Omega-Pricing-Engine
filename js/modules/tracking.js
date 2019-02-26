
/*
 *
 * On logging in,
 *	Log a note to the user's record on the CRM
 *
 */
$( document ).on( "user/logged-in", function ( event, data ) {

	var noteContent = "Customer viewed the Pricing Engine";
	addNoteToUser( "Omega Customer Insights", noteContent );

} );

/*
 *
 * On viewing a unit,
 *	1. Log a note to the user's record on the CRM
 *
 */
$( document ).on( "unit/view/done", function ( event, data ) {

	var unitNumber = data.unitNumber;
	var noteContent = "Customer viewed unit #" + unitNumber + " on the Pricing Engine";
	addNoteToUser( "Omega Customer Insights", noteContent );

} );
