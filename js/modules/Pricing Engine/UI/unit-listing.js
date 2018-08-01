
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

} );

/*
 *
 * When a unit listing item is clicked,
 * 	view that unit.
 *
 */
$( document ).on( "click", ".js_unit_list_item", function ( event ) {

	if ( $( "html" ).hasClass( "js_embedded" ) ) {
		if ( $( document ).width() > 640 ) {
			return;
		}
	}
	event.preventDefault();

	var $unitListItem = $( event.target ).closest( ".js_unit_list_item" );
	// If the unit is already selected, do nothing
	if ( $unitListItem.hasClass( "selected" ) )
		return;

	// Mark it as "selected"
	__UI.$unitListing.find( ".js_unit_list_item" ).removeClass( "selected" );
	$unitListItem.addClass( "selected" );

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
 * When the unit listing UI is to be rendered
 *
 */
$( document ).on( "unit-listing/render", function ( event, data ) {

	if ( ! ( data && data.units ) ) {
		__UI.$unitListingSection.find( ".js_content" ).addClass( "invisible" );
		__UI.$unitListingSection.find( ".js_loading_stub" ).removeClass( "hidden" );
		return;
	}

	var units = data.units;

	var unitListingMarkup = __UI.templates.unitListing( {
		units: units,
		rootPath: location.pathname.replace( /\/$/, "" )
	} );

	if ( __UI.$unitListing.hasClass( "slick-initialized" ) ) {
		__UI.$unitListing.slick( "unslick" );
	}
	__UI.$unitListing.html( unitListingMarkup );

	setTimeout( function () {

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
		__UI.$unitListingSection.find( ".js_loading_stub" ).addClass( "hidden" );

	}, 0 );

} );
