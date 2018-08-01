
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ UNIT SEARCH
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Unit Search
	__UI.$unitSearch = $( ".js_search_form" );

} );

$( document ).on( "click", ".js_clear_search", function ( event ) {

	// If there is a query in the search bar, proceed to clear / de-activate the search
	var searchQuery = $( event.target ).closest( ".js_search_form" ).find( ".js_search_query" ).val();
	if ( searchQuery ) {
		$( document ).trigger( "unit/search/deactivate", { query: "" } );
	}

} );

$( document ).on( "submit", ".js_search_form", function ( event ) {

	event.preventDefault();

	var $form = $( event.target );
	var query = $form.find( ".js_search_query" ).val();

	$( document ).trigger( "unit/search", { query: query } );

} );

$( document ).on( "unit/search/clear", function ( event ) {

	__UI.$unitSearch.get( 0 ).reset();

} );
