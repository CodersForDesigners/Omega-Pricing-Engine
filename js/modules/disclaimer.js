
( function (){

	// if the disclaimer has already been viewed, do not proceed
	try {
		if ( sessionStorage.getItem( "first_time_this_session" ) ) {
			return;
		}
	}
	catch ( e ) {}

	// show the disclaimer
	$( "#page-wrapper" ).addClass( "freeze" );
	$( "#js_laz_disclaimer_markup" ).show();

	$('.js_laz_agree').on('click', function () {

		// record the fact that the disclaimer has been viewed
		try {
			sessionStorage.setItem( "first_time_this_session", true );
		}
		catch ( e ) {}

		$( "#js_laz_disclaimer_markup" ).remove();
		// $( ".js_laz_disclaimer" ).remove();
		$('#page-wrapper').removeClass('freeze');

	} );

}() );
