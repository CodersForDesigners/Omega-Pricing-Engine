$(document).ready(function() {
	// Open Modal Box
	$('.js_modal_trigger').on('click', function( event ){
		event.preventDefault();

		var modId = $(event.target).data('modId');
		$('.js_modal_box').fadeIn( 350 ); // Show Modal Box
		$('.body').addClass('modal-open'); // Freeze Page Layer
		$('.js_modal_box_content[data-mod-id="'+ modId +'"]').addClass('active'); // Activate Appropriate Modal Content

	});


	// close the modal
	function closeModal ( event ) {

		event.stopImmediatePropagation();
		event.preventDefault();

		$('.js_modal_box').fadeOut( 350 ); // Hide Modal Box
		$('.body').removeClass('modal-open'); // UnFreeze Page Layer
		$('.js_modal_box_content').removeClass('active'); // Hide All Modal Content

		var $videoEmbeds = $( event.target )
			.closest( ".js_modal_box" )
			.find( ".youtube_embed" );
		$videoEmbeds.each( function ( _i, el ) {
			unsetVideoEmbed( el );
			setVideoEmbed( el );
		} )

		// Form reset operations
		$('.form-error').removeClass('form-error');

	}

	// Close Modal Box,
	// on clicking the close button
	$('.js_modal_box .js_modal_close').on('click', closeModal );
	// on hitting the escape key
	$( document ).on( "keyup", function ( event ) {

		var keyAlias = ( event.key || String.fromCharCode( event.which ) ).toLowerCase();
		var keyCode = parseInt( event.which || event.keyCode );

		if ( keyAlias == "esc" || keyAlias == "escape" || keyCode == 27 ) {
			closeModal( event );
		}

	} )

});
