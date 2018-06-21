
/*

 YouTube embeds across the site are initialized and loaded ↵
 after the DOM is "ready". This is so the page loading isn't slowed down.

 Page loads can be synchronous or asynchronous.

 Markup structure of the embed are like so,

	<div class="youtube_embed ga_video" data-src="https://www.youtube.com/embed/lncVHzsc_QA?rel=0&amp;showinfo=0" data-ga-video-src="Sample - Video">
		<div class="youtube_load"></div>
		<iframe width="1280" height="720" src="" frameborder="0" allowfullscreen></iframe>
	</div>

As you can see, we store the video URL in a data-src attribute of the enclosing element.
That URL is then plugged into the iframe element asynchronously.

*/

// takes a DOM element as input
// copies the URL from its "data-src" attribute
// and attaches to the `src` attribute of the iframe element that is a descendant of it
function setVideoEmbed ( domEl ) {

	$el = $( domEl );
	var src = $el.data( 'src' );
	$el.find( 'iframe' ).attr( 'src', src );

}

// takes a DOM element as input
// removes the `src` attribute of the iframe element that is a descendant of it
function unsetVideoEmbed ( domEl ) {

	$( domEl ).find( 'iframe' ).attr( 'src', '' );

}

// initializes the video embeds asynchronously after a timeout
function initVideoEmbeds () {

	window.setTimeout(function() {
		$( '.youtube_embed:not(.js_in_carousel)' ).each( function () {
			setVideoEmbed( this );
		} );
		$( '.facebook_embed' ).each( function () {
			setVideoEmbed( this );
		} );
	}, 3000);

}

$( function () {

	// initializes and loads the video embeds on **synchronous** page loads
	initVideoEmbeds();

	// initializes and loads the video embeds on **asynchronous** page loads
	// hooks onto a custom event that is emitted, "page::load"
	$( document ).on( "page::load", initVideoEmbeds );

} );
