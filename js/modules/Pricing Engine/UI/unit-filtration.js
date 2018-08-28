
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ UNIT FILTRATION
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Unit Search
	__UI.$unitClassification = $( ".js_unit_classification" );

	__UI.$selectedUnitFilters = $( ".js_selected_unit_filters" );

} );

/*
 *
 * When the unit search UI is to be rendered
 *
 */
$( document ).on( "unit-filtration/render", function ( event, data ) {

	var taxonomies = data.taxonomies;
	var filters = data.filters;

	taxonomies[ 0 ].selected = "selected";

	// Build the Search/Discovery/Filtration interface
	var unitFiltrationMarkup = __UI.templates.unitFiltration( {
		taxonomies: taxonomies,
		filters: filters
	} );
	__UI.$unitClassification.html( unitFiltrationMarkup );

} );

$( document ).on( "unit-filtration/render/change", function ( event, data ) {

	var taxonomies = data.taxonomies;
	var filters = data.filters;

	__UI.$unitClassification.find( ".js_unit_filter" ).removeClass( "selected" );
	filters.forEach( function ( filter ) {
		__UI.$unitClassification
			.find( ".js_unit_filter" )
			.filter( "[ data-taxonomy = '" + filter.taxonomy + "' ]" )
			.filter( "[ data-type = '" + filter.type + "' ]" )
			.addClass( "selected" )
	} );

} );


/*
 *
 * When a unit taxonomy is selected.
 * 	Show the types in that taxonomy
 *
 */
$( document ).on( "click", ".js_unit_classification .js_tab_button", function ( event ) {

	// Get the selected taxonomy
	var $selectedTaxonomy = $( event.target ).closest( ".js_tab_button" );

	__UI.$unitClassification.find( ".js_tab_group" ).removeClass( "selected" );
	__UI.$unitClassification.find( ".js_tab_button" ).removeClass( "selected" );

	// Get the index of the selected taxonomy in the DOM
	var taxonomyIndex = $selectedTaxonomy.parent().children().index( $selectedTaxonomy );

	// "Select" the corresponding taxonomy heading and tab
	__UI.$unitClassification.find( ".js_tab_group" ).eq( taxonomyIndex ).addClass( "selected" );
	$selectedTaxonomy.addClass( "selected" );

} );


/*
 *
 * When a unit filter parameter is clicked.
 * 	Either, add or remove the corresponding filter.
 *
 */
$( document ).on( "click", ".js_unit_classification .js_unit_filter", function ( event ) {

	var $target = $( event.target ).closest( ".js_unit_filter" );
	var taxonomy = $target.data( "taxonomy" );
	var type = $target.data( "type" );
	var filter = {
		taxonomy: taxonomy,
		type: type
	};
	if ( $target.hasClass( "selected" ) ) {
		$( document ).trigger( "unit-filter/remove", filter );
	}
	else {
		$( document ).trigger( "unit-filter/add", filter );
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
	$( document ).trigger( "unit-filter/remove", filter );

} );

/*
 *
 * When the filter is added,
 *	Add a corresponding filter bubble
 *
 */
$( document ).on( "unit-filter/add", function ( event, filter ) {
	addFilterBubble( filter );
} );

/*
 *
 * When the filter is removed,
 *	Remove the corresponding filter bubble
 *
 */
$( document ).on( "unit-filter/remove", function ( event, filter ) {
	removeFilterBubble( filter );
} );

/*
 *
 * Adds a filter bubble to the Selected Filters section
 *
 */
function addFilterBubble ( filter ) {

	var bubbleMarkup = __UI.templates.unitFiltrationTags( filter );
	__UI.$selectedUnitFilters.append( bubbleMarkup );

}

/*
 *
 * Remove a filter bubble from the Selected Filters section
 *
 */
function removeFilterBubble ( filter ) {

	var $filterBubble = __UI.$selectedUnitFilters.find( ".js_unit_filter" ).filter( function ( _i, el ) {
		var $el = $( el );
		return (
			$el.data( "taxonomy" ) == filter.taxonomy
			&& $el.data( "type" ) == filter.type
		);
	} );
	$filterBubble.remove();

	// If there are **no** selected filters, clear the container element regardless.
	// This is so the CSS for when the container is empty will kick in.
	// By default, there is an HTML comment in it.
	if ( ! __UI.$selectedUnitFilters.children().length ) {
		__UI.$selectedUnitFilters.empty()
	}

}
