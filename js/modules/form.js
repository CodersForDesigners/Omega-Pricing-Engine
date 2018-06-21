
$( function () {

	$( document ).on( "submit", "#js_form_contact", function ( event ) {

		event.preventDefault();

		$form = $( event.target );

		var data = {
			async: true,
			name: $form.find( "#form_contact_name" ).val(),
			email: $form.find( "#form_contact_email" ).val(),
			contact: parseInt( $form.find( "#form_contact_number" ).val(), 10 ),
		};

		$.ajax( {
			url: "/handle_form_data",
			method: "POST",
			data: data,
			success: function ( responseJSON, status, xhr ) {

				var response;
				try {
					response = JSON.parse( responseJSON );
				} catch ( e ) {
					console.log( e );
					response = responseJSON;
				}
				console.log( "status :: " + status );
				console.log( "response ::" );
				console.log( response );
				console.log( "the XHR object ::" );
				console.log( xhr );

				if ( ! response.status ) {
					return;
				}

				// feedback
				$( "h2" ).text( "( LIAR! )" );
				$( "input" )
					.prop( "disabled", true )
					.addClass( "block" )
					.val( "I SHALL NOT TELL LIES. ".repeat( 9 ) );

				$( "button[ type='submit' ]" )
					.prop( "disabled", true )
					.text( "you lied!" );

			}
		} );

	} );

} );
