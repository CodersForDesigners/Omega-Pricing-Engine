
// Store references to places in the DOM
$( function () {
	window.__UI = window.__UI || { };

	__UI.$unitSearch = $( ".js_unit_search" );

	__UI.$unitFilters = $( ".js_selected_unit_filters" );

	__UI.$unitListing = $( ".js_unit_listing" );

	__UI.$unitDetailsSection = $( ".js_section_unit_details_and_mods" );
	__UI.$unitDetailsUnitNumber = __UI.$unitDetailsSection.find( ".js_unit_number_heading" );
	__UI.$unitDetailsList = __UI.$unitDetailsSection.find( ".js_unit_details_and_mods" );
} );

// A template helper that gives the floor number in an ordinal word form
__UTIL.template.floorInOrdinalWord = function () {
	var floorToWords = [ "Ground", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third", "Twenty-Fourth", "Twenty-Fifth", "Twenty-Sixth", "Twenty-Seventh" ];
	return function floorInOrdinalWord ( floor ) {
		return floorToWords[ floor ] || "";
	}
}();
/*
 *
 * When the unit listing UI is to be rendered
 *
 */
$( document ).on( "unit-listing.render", function ( event, data ) {

	var units = data.units;

	var unitListItemTemplate = $( ".tmpl-unit-list-item" ).html();
	var unitListingMarkup = units.reduce( function ( markup, unit ) {
		return markup + __UTIL.renderTemplate( unitListItemTemplate, unit );
	}, "" );
	__UI.$unitListing.html( unitListingMarkup );

} );

/*
 *
 * When the unit search UI is to be rendered
 *
 */
$( document ).on( "unit-filtration.render", function ( event, data ) {

	var taxonomies = data.taxonomies;
	var filters = data.filters;

	// Build the Search/Discovery/Filtration interface
	var filtrationUIAjaxRequest = $.ajax( {
		url: "pages/components/unit-filtration.php",
		method: "GET",
		data: {
			taxonomies: taxonomies,
			filters: filters
		},
		// dataType: "text/html"
	} );
	filtrationUIAjaxRequest.done( function ( response ) {
		__UI.$unitSearch.html( response );
	} );
	filtrationUIAjaxRequest.always( function ( response, status, jqXHR ) {
		// console.log( arguments )
	} )

} );


/*
 *
 * When a unit filter parameter is clicked.
 * 	Either, add or remove the corresponding filter.
 *
 */
$( document ).on( "click", ".js_unit_search .js_unit_filter", function ( event ) {

	var $target = $( event.target ).closest( ".js_unit_filter" );
	var taxonomy = $target.data( "taxonomy" );
	var type = $target.data( "type" );
	var filter = {
		taxonomy: taxonomy,
		type: type
	};
	if ( $target.hasClass( "selected" ) ) {
		$( document ).trigger( "unit-filter.remove", filter );
	}
	else {
		$( document ).trigger( "unit-filter.add", filter );
	}

} );


/*
 *
 * When a unit filter parameter "bubble" is clicked.
 * 	Remove the corresponding filter.
 *
 */
$( document ).on( "click", ".js_selected_unit_filters .js_remove", function ( event ) {

	var $unitFilter = $( event.target ).closest( ".js_unit_filter" );
	var taxonomy = $unitFilter.data( "taxonomy" );
	var type = $unitFilter.data( "type" );
	var filter = {
		taxonomy: taxonomy,
		type: type
	};
	$( document ).trigger( "unit-filter.remove", filter );

} );

/*
 *
 * When the filter is added,
 *	Add a corresponding filter bubble
 *
 */
$( document ).on( "unit-filter.add", function ( event, filter ) {
	addFilterBubble( filter );
} );

/*
 *
 * When the filter is removed,
 *	Remove the corresponding filter bubble
 *
 */
$( document ).on( "unit-filter.remove", function ( event, filter ) {
	removeFilterBubble( filter );
} );

/*
 *
 * Adds a filter bubble to the Selected Filters section
 *
 */
function addFilterBubble ( filter ) {

	var bubbleTemplate = $( ".tmpl-filter-bubble" ).html();
	var bubbleMarkup = __UTIL.renderTemplate( bubbleTemplate, filter );
	__UI.$unitFilters.append( bubbleMarkup );

}

/*
 *
 * Remove a filter bubble from the Selected Filters section
 *
 */
function removeFilterBubble ( filter ) {

	var $filterBubble = __UI.$unitFilters.find( ".js_unit_filter" ).filter( function ( _i, el ) {
		var $el = $( el );
		return (
			$el.data( "taxonomy" ) == filter.taxonomy
			&& $el.data( "type" ) == filter.type
		);
	} );
	$filterBubble.remove();

}





/*
 * -/-/-/-/-/-/-
 * 	~~~~~ UNIT DETAILS
 * -/-/-/-/-/-/-
 */
/*
 *
 * When a unit listing item is clicked,
 * 	view that unit.
 *
 */
$( document ).on( "click", ".js_unit_list_item", function ( event ) {

	var $unitListItem = $( event.target ).closest( ".js_unit_list_item" );
	var unitNumber = $unitListItem.data( "unit" );

	$( document ).trigger( "unit.view", { unit: unitNumber } );

} );

/*
 *
 * When the Unit Details UI is to be rendered
 *
 */
$( document ).on( "unit-details.render", function ( event, data ) {

	var unit = data.unit;
	var details = data.details;

	var unitDetailListItemTemplate = $( ".tmpl-unit-detail-list-item" ).html();
	var unitDetailsMarkup = details.reduce( function ( markup, detail ) {
		return markup + __UTIL.renderTemplate( unitDetailListItemTemplate, detail );
	}, "" );
	__UI.$unitDetailsUnitNumber.text( unit );
	__UI.$unitDetailsList.html( unitDetailsMarkup );
	__UI.$unitDetailsSection.removeClass( "hidden" );

	// Render the EMI calculator
	$( document ).trigger( "emi-calculator.render" );

} );





/*
 * -/-/-/-/-/-/-
 * 	~~~~~ EMI CALCULATION
 * -/-/-/-/-/-/-
 */

$( document ).on( "emi-calculator.render", function ( event ) {
	$( ".js_section_emi_calculator" ).removeClass( "hidden" );
} );

$( document ).on( "emi-calculator.render", function ( event ) {
	//
} );
