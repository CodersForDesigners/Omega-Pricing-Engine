
/*

	this code is responsible for,
		overriding the default behaviour of anchor elements
		fetching page contents asychronously and plonking it onto the page
		managing the history timeline of the browser tab

*/

if ( ! sessionStorage.getItem( "timeOnTheLine" ) || sessionStorage.getItem( "timeOnTheLine" ).length ) {
	sessionStorage.setItem( "timeOnTheLine", 0 );
}

// make an initial entry to the history timeline
( function () {

	var pageName = document.querySelector( ".js_nav_button.active" ).dataset.pageId;
	// get everything after the TLD (top-level domain), i.e. for example, ".in"
	// query-strings and hashes included
	var currentDomainAndPath = window.location.toString().split( "//" )[ 1 ];
	var currentURI =
		currentDomainAndPath.slice( currentDomainAndPath.indexOf( "/" ) );

	history.replaceState( {
		name: pageName,
		uri: currentURI,
		timeOnTheLine: sessionStorage.getItem( "timeOnTheLine" )
	}, pageName, currentURI );

}() );

// this takes a page name and its content (i.e. markup) in the form of a string
// and swaps out the current page with that
// and makes other tiny changes accordingly
function turnPage ( name, markup ) {

	// remove the "loading" indicator
	$( "#page-content" ).removeClass( "loading" );

	// swap out the markup
	var $pageContent = $( "#page-content" );

	$pageContent
		.addClass( "fade" );

	setTimeout( function () {

		$pageContent.html( markup );

		// re-set the "active" navigation button
		$( ".js_nav_button.active" ).removeClass( "active" );
		$( "a[ data-page-id = '" + name + "' ]" ).addClass( "active" );

		// set a data-attribute on the page-wrapper element
		$( "#page-wrapper" ).attr( "data-page", name );

		// if successful, trigger a "page::load" event
		$( document ).trigger( "page::load" );

		// change the document title accordingly
		document.title = document.title.split( "|" )[ 0 ].trim() +
						" | " +
						name[ 0 ].toUpperCase() + name.slice( 1 );

		// fade the page back in
		$pageContent
			.removeClass( "fade" )
			.removeClass( "animate-reverse" );

	}, 500 );

}

$( function () {

	// on clicking a hyperlink anchor link
	// depending on the manner in which it was clicked
	// fetch that page's contents, or
	// open the target page on a new tab
	$( ".js_nav_button" ).on( "click", function ( event ) {

		// if the command/ctrl key was pressed, retain the default behaviour
		// of opening that link on a new tab
		var commandOrCtrlKeyWasPressed = event.metaKey || event.ctrlKey;
		if ( commandOrCtrlKeyWasPressed ) {
			return;
		}

		event.preventDefault();
		var $clickedNavButton = $( event.target );

		// if the link is already active, i.e. we're already on that page,
		// then do nothing
		if ( $clickedNavButton.hasClass( "active" ) ) {
			return;
		}

		var targetURI = $clickedNavButton.attr( "href" );
		// modify the URI to follow a trailing slash convention
		// ( only if there's no query-string attached to it )
		targetURI = targetURI.indexOf( "?" ) == -1 ?
			targetURI + "/" :
			targetURI;
		var pageName = $clickedNavButton.data( "page-id" );

		// initiate a loading-indicator / page-transition effect
		$( "#page-content" ).addClass( "loading" );

		// fetch the page's contents asynchronously
		// once done, transition to it and do some manual history management
		$.ajax( {
			url: targetURI,
			data: {
				async: true,
				// REMOVE
				// uri: targetURI,
				// type: "markup"
			},
			dataType: "html"
		} )
			.done( function ( response, status, xhr ) {

				turnPage( pageName, response );

				// increment the history timeline
				sessionStorage.setItem(
					"timeOnTheLine",
					parseInt( sessionStorage.getItem( "timeOnTheLine" ), 10 ) + 1
				);
				// make an entry in history
				history.pushState( {
					name: pageName,
					uri: targetURI,
					timeOnTheLine: parseInt( sessionStorage.getItem( "timeOnTheLine" ), 10 )
				}, pageName, targetURI );

			} )

	} );

	/*

		on traversing through history ( using the ←/→ buttons ),
		fetch the appropriate page contents

	*/
	$( window ).on( "popstate", function ( event ) {

		// get the native DOM event object, not the jQuery wrapped one
		var page = event.originalEvent.state;

		// figure out if we're going backwards or forwards?
		var timeOnTheLine = parseInt( sessionStorage.getItem( "timeOnTheLine" ), 10 );
		var distanceInTime = timeOnTheLine - page.timeOnTheLine;
		sessionStorage.setItem(
			"timeOnTheLine",
			timeOnTheLine - distanceInTime
		);

		// do a loading indicator / page transition effect
		// if we're going backwards, animate in reverse
		// REMOVE this snippet if you're making use of this
		if ( distanceInTime > 0 ) {
			$( "#page-content" ).addClass( "animate-reverse" );
		}
		$( "#page-content" ).addClass( "loading" );

		// fetch the page contents (asynchronously)
		// once done, transition to it
		$.ajax( {
			url: page.uri,
			data: {
				async: true,
				// uri: page.uri,
				// type: "markup"
			},
			dataType: "html"
		} )
			.done( function ( response, status, xhr ) {

				// transition to the page
				turnPage( page.name, response );

			} )

	} );

} );
