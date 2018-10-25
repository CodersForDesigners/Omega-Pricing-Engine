
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ UNIT LISTING
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Unit Listing
	__UI.$unitListingSection = $( ".js_unit_listing_section" );
	__UI.$unitListing = __UI.$unitListingSection.find( ".js_unit_listing" );
	__UI.$numberOfUnitsInListing = $( ".js_units_in_list" );

} );

/*
 *
 * When a unit listing item is clicked,
 * 	view that unit.
 *
 */
$( document ).on( "click", ".js_unit_list_item", function ( event ) {

	// if ( $( "html" ).hasClass( "js_embedded" ) ) {
	// 	if ( $( document ).width() > 640 ) {
	// 		return;
	// 	}
	// }

	/*
	 * Mark the selected unit
	 */
	// Get the unit list item
	var $unitListItem = $( event.target ).closest( ".js_unit_list_item" );

	// Mark it as "selected"
	__UI.$unitListing.find( ".js_unit_list_item" ).removeClass( "selected" );
	$unitListItem.addClass( "selected" );

	/*
	 * If on a mobile device, continue to show the unit details on the same page
	 * 	otherwise open the unit on a new tab
	 */
	if ( $( document ).width() > 640 ) {
		return;
	}

	event.preventDefault();

	// Get the unit number
	var unitNumber = $unitListItem.data( "unit" );

	$( document ).trigger( "unit/view", {
		unitData: {
			Unit: unitNumber
		}
	} );

} );


/*
 *
 * When the unit listing UI is paged,
 *	mark the "currentSlide" ( which will no longer be current soon after this ) with a class of "previous"
 *
 */
$( ".js_unit_listing_section .js_unit_listing" ).on( "beforeChange", function ( event, slick, currentSlideIndex, nextSlideIndex ) {
	var $dots = slick.$dots.find( "li" );
	var numberOfDots = $dots.length;
	$dots.removeClass( "previous previous-most next" );
	// $dots.eq( nextSlideIndex - 1 ).addClass( "previous" )
	$dots.eq( nextSlideIndex + 1 ).addClass( "next" );
	// If the last dot is selected, show the 3rd-last and 4th-last dots as well
	if ( numberOfDots - nextSlideIndex == 1 ) {
		$dots.eq( nextSlideIndex - 1 ).addClass( "previous" );
		$dots.eq( nextSlideIndex - 2 ).addClass( "previous" );
		$dots.eq( nextSlideIndex - 3 ).addClass( "previous previous-most" );
	}
	// If the 2nd-last dot is selected, show the 4th-last dot as well
	else if ( numberOfDots - nextSlideIndex == 2 ) {
		$dots.eq( nextSlideIndex - 1 ).addClass( "previous" );
		$dots.eq( nextSlideIndex - 2 ).addClass( "previous previous-most" );
	}
	// Else in all other instances
	else {
		$dots.eq( nextSlideIndex - 1 ).addClass( "previous previous-most" )
	}
} );


/*
 *
 * When the unit listing UI is to be rendered
 *
 */
$( document ).on( "unit-listing/render", function ( event, data ) {

	if ( ! ( data && data.units ) ) {
		__UI.$numberOfUnitsInListing.text( "Searching....." );
		__UI.$unitListingSection.find( ".js_content" ).addClass( "invisible" );
		__UI.$unitListingSection.addClass( "loading" );
		return;
	}

	var units = data.units;
	var freePreviews = __OMEGA.settings[ "Free Previews" ] || 0;

	// Plonk in the message that tells how many units were found
	var numberOfUnitsInListing = units.length;
	var termForUnit = __OMEGA.settings[ "Term for \"Unit\"" ];
	var unitsFoundText;
	if ( numberOfUnitsInListing == 0 )
		unitsFoundText = "No " + termForUnit + "s were found.";
	else if ( numberOfUnitsInListing == 1 )
		unitsFoundText = "1 " + termForUnit + " found.";
	else
		unitsFoundText = numberOfUnitsInListing + " " + termForUnit + "s found.";
	__UI.$numberOfUnitsInListing.text( unitsFoundText );

	// Build the actual unit listing markup
	var unitListingMarkup = __UI.templates.unitListing( {
		units: units,
		freePreviews: freePreviews,
		rootPath: location.pathname.replace( /\/$/, "" )
	} );

	if ( __UI.$unitListing.hasClass( "slick-initialized" ) ) {
		__UI.$unitListing.slick( "unslick" );
	}
	__UI.$unitListing.html( unitListingMarkup );

	// waitFor( 0.5 ).then( function () {

		__UI.$unitListing.slick( {
			centerMode: true,
			centerPadding: 0,
			speed: 250,
			cssEase: 'ease-out',
			slidesToShow: 1,
			rows: 5,
			dots: true,
			arrows: false,
			fade: true,
			infinite: false
		} );

		// Finally, reveal the UI
		__UI.$unitListingSection.find( ".js_content" ).removeClass( "invisible" );
		__UI.$unitListingSection.removeClass( "loading" );

	// } );

} );
