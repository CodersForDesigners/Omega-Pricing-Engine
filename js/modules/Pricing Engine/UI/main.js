
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ SETUP AND INITIALIZATION
 * -/-/-/-/-/-/-
 */

// Register all the templates
$( function () {

	window.__UI = window.__UI || { };

	__UI.templates = { };
	$( ".js_template" ).each( function ( _i, domTemplate ) {
		var templateName = domTemplate.dataset.name;
		// Register as a template
		__UI.templates[ templateName ] = Handlebars.compile( domTemplate.innerText );
		// Register as a partial
		Handlebars.registerPartial( templateName, domTemplate.innerText );
	} );

	// Set template helpers
	for ( var helper in __UTIL.template ) {
		Handlebars.registerHelper( helper, __UTIL.template[ helper ] );
	}
	for ( var comparator in __UTIL.comparators ) {
		Handlebars.registerHelper( comparator, __UTIL.comparators[ comparator ] );
	}

} );
