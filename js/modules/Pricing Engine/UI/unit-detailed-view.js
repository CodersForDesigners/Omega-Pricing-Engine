
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ UNIT VIEW
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// Unit Details
	__UI.$unitDetailsSection = $( ".js_section_unit_details_and_mods" );
	__UI.$unitDetailsList = __UI.$unitDetailsSection.find( ".js_content" );

} );

/*
 *
 * When a unit modification is inputted or changed
 * 	re-render the unit view.
 *
 */
// For binary input modifications
$( document ).on( "change", ".js_unit_modification__binary", function ( event ) {

	var modification = getModification( event );

	$( document ).trigger( "modification/changed", modification );

} );
// For manual input modifications

/*
 *
 * On hitting the "ENTER" or "RETURN" key, commit the modification value
 *
 */
$( document ).on( "keyup", ".js_unit_modification__manual", function ( event ) {

	var keyAlias = ( event.key || String.fromCharCode( event.which ) ).toLowerCase();
	var keyCode = parseInt( event.which || event.keyCode );

	if ( ! ( keyAlias == "enter" || keyAlias == "return" || keyCode == 13 ) ) {
		return;
	}

	setModificationValue( event );

} );

$( document ).on( "blur", ".js_unit_modification__manual", setModificationValue );

function setModificationValue ( event ) {

	var modification = getModification( event );
	var $modificationInput = $( event.target );

	// If the modification is a number,
	// clamp the values between the specified minimum and maximum
	var min = __OMEGA.modifications[ modification.name ][ "Minimum value" ];
	var max = __OMEGA.modifications[ modification.name ][ "Maximum value" ];
	modification.value = parseStringToNumber( modification.value );
	if ( typeof modification.value == "number" ) {
		if ( typeof max == "number" && modification.value > max ) {
			modification.value = max;
			notify( "Please enter a number between <i><b>" + min + "</b></i> and <i><b>" + max + "</b></i>.", { context: "modification", escape: true } );
		}
		if ( typeof min == "number" && modification.value < min ) {
			modification.value = min;
			notify( "Please enter a number between <i><b>" + min + "</b></i> and <i><b>" + max + "</b></i>.", { context: "modification", escape: true } );
		}
	}

	// If the value has not changed, then do nothing
	if ( $modificationInput.data( "value" ) == modification.value ) {
		$modificationInput.val( modification.value );
		return;
	}

	$modificationInput.data( "value", modification.value );
	$( document ).trigger( "modification/changed", modification );

}

// For multi-choice modifications
$( document ).on( "change", ".js_unit_modification__multiple", function ( event ) {

	var modification = getModification( event );
	var $modificationInput = $( event.target );

	// If the value has not changed, then do nothing
	if ( $modificationInput.data( "value" ) == modification.value )
		return;

	$modificationInput.data( "value", modification.value );
	$( document ).trigger( "modification/changed", modification );

} );

/*
 *
 * When the Unit Details UI is to be rendered
 *
 */
$( document ).on( "unit-details/render", function ( event, data ) {

	if ( data && data.hide ) {
		__UI.$unitDetailsSection.slideUp();
		return;
	}

	if ( ! data ) {
		__UI.$unitDetailsSection.addClass( "loading" );
		__UI.$unitDetailsSection.css( "height", function ( _i, height ) {
			return height;
		} );
		// Reveal the section itself ( if it has not been shown even once )
		__UI.$unitDetailsSection.show();
		return;
	}

	var unitNumber = data.unitNumber;
	var points = data.points.filter( function ( detail ) { return ! detail.Hide } );
	var modifications = __OMEGA.modifications;

	var unitDetailsMarkup = __UI.templates.unitDetails( {
		points: points,
		// modifications: modifications
	} );
	__UI.$unitDetailsList.html( unitDetailsMarkup );

	// Finally, reveal the UI _with_ the data
	__UI.$unitDetailsSection.find( ".js_content" ).removeClass( "hidden" );
	__UI.$unitDetailsSection.css( "height", "" );
	__UI.$unitDetailsSection.removeClass( "loading" );

	$( document ).trigger( "enquiry-form/show" );

	// And last but not the least, scroll down to the Unit Details
	if ( ! [ "modification", "single-view" ].includes( data.context ) ) {
		waitFor( 0.5 ).then( function () {
			var offsetPosition = __UI.$unitDetailsSection.offset().top - 10
			var scrollTop = window.scrollY || document.body.scrollTop;
			if ( scrollTop < offsetPosition ) {
				window.scrollTo( {
					top: offsetPosition,
					behavior: "smooth"
				} );
			}
		} );
	}

} );

var unstickGrandTotalLineItem = function () {

	var $window = $( window );
	var $grandTotalLineItem;
	var $grandTotalLineItemSticky;

	// When a unit is viewed
	$( document ).on( "unit/view/done", function () {

		$grandTotalLineItem = $( ".js_grand_total_line_item" );

		// Clone the "Grand Total" line ( this one will be sticky floating )
		$grandTotalLineItemSticky = $grandTotalLineItem.clone();
		$grandTotalLineItemSticky
			.removeClass( "js_grand_total_line_item" )
			.addClass( "fixed js_grand_total_line_item_sticky" );
		__UI.$unitDetailsSection.find( ".js_content" ).prepend( $grandTotalLineItemSticky );

		// Statically position the original "Grand Total" line
			// for Safari
		$grandTotalLineItem.css( { position: "static" } );
	} );

	return function unstickGrandTotalLineItem ( event ) {

		// If no unit's details has been loaded
		if ( ! $grandTotalLineItem || ! $grandTotalLineItem.length ) {
			return;
		}

		var scrollTop = window.scrollY || document.body.scrollTop;
		var viewportHeight = $window.height();
		var scrollBottom = scrollTop + viewportHeight;

		var grandTotalLineItemHeight = $grandTotalLineItem.outerHeight();

		if (
			// When the top of the screen goes past the top of the Unit Details
			scrollTop < __UI.$unitDetailsSection.offset().top
				||
			// When the bottom of the screen goes past the static position of the grand total
			scrollBottom >= $grandTotalLineItem.offset().top - grandTotalLineItemHeight * 4
			) {
			$grandTotalLineItemSticky.removeClass( "show" );
		}
		else {
			$grandTotalLineItemSticky.addClass( "show" );
		}

	};

}();
$( window ).on( "scroll", unstickGrandTotalLineItem );
