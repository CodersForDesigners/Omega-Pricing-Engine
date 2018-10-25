
/*
 *
 * When a unit is to be viewed,
 * 	1. Render stub UIs for the Unit Detailed View and EMI Calculator
 * 	2. Save the user input data on the side.
 * 	3. Run the computations through the pricing engine.
 * 	4. Store the grand total value on the global state.
 * 	5. Render the Unit Details UI.
 * 	6. Render the EMI Calculator UI.
 *	7. Expose a hook
 *
 */
$( document ).on( "unit/view", function ( event, data ) {

	// 1. Render stub UIs for the Unit Detailed View and EMI Calculator
	$( document ).trigger( "unit-details/render" );
	$( document ).trigger( "emi-calculator/render" );

	// 2. Save the user input data on the side.
	var newUnitData = data.unitData;
	__OMEGA.userInput.unitData = Object.assign( __OMEGA.userInput.unitData, newUnitData );

	// 3. Run the computations through the pricing engine
	computeUnitData();
	var points = getComputedUnitData();

	// Filter out the modifications that aren't applicable for the unit
	// 	and set the unit-specific values for them ( if present )
	var modifications = __OMEGA.modifications;
	var selectedUnitNumber = __OMEGA.userInput.unitData.Unit;
	var selectedUnit = __OMEGA.units.find( function ( unit ) {
		return unit.Unit == selectedUnitNumber;
	} );
	points = points
		.filter( function ( point ) {
			// This part may be a bit tricky to follow.
			// Firstly, if the line item **does not** represent a modification, let it through
			if ( ! point.Modifiable ) return true;
			// If it **does** represent a modification, and if it is applicable to for this unit, let it through
			if ( selectedUnit.modifications[ point.Name ] ) return true;
			// Else, do not let it through
			return false;
		} )
		.map( function ( point ) {
			if ( ! point.Modifiable )
				return point;
			point.modification = selectedUnit.modifications[ point.Name ];
			return point;
		} );

	// 4. Store the grand total value on the global state
	var grandTotal;
	points.some( function ( point ) {
		if ( point.Content == "Grand Total" ) {
			grandTotal = parseFloat( point.Value );
			return true;
		}
	} );
	__OMEGA.unitData.grandTotal = grandTotal;

	// 5. Render the Unit Details UI
	var eventData = {
		unitNumber: selectedUnitNumber,
		points: points
	};
		// Get the context
	if ( data.context )
		eventData.context = data.context;
	// If something other than the unit number changed,
		// it must be a modification
	else if ( newUnitData && newUnitData.Unit == void 0 )
		eventData.context = "modification";

	$( document ).trigger( "unit-details/render", eventData );

	// 6. Render the EMI Calculator UI
	$( document ).trigger( "emi-calculator/render", { total: grandTotal } );

	// 7. Expose a hook
	$( document ).trigger( "unit/view/done", { total: grandTotal } );

} );


/*
 *
 * For when the EMI calculator has got to calculate various figures
 *
 */
$( document ).on( "emi-calculator/calculate", function ( event, data ) {

	// Pull out the relevant data
	var downPayment = __OMEGA.emi.downPayment;
	var loanAmount = __OMEGA.emi.loanAmount;
	var tenure = __OMEGA.emi.tenure;
	var interestRate = __OMEGA.emi.interestRate / 1200;

	// Calculate the various figures
	var emi = Math.round( ( loanAmount * interestRate * Math.pow( 1 + interestRate, tenure ) ) / ( Math.pow( 1 + interestRate, tenure ) - 1 ) );
	var totalAmountPayable = emi * tenure;
	var principalAmount = loanAmount;
	var interestAmount = emi * tenure - loanAmount;

	$( document ).trigger( "emi-calculator/render/figures", {
		emi: emi,
		totalAmountPayable: totalAmountPayable,
		principalAmount: principalAmount,
		interestAmount: interestAmount
	} );

} );



/*
 *
 * When a modification is configured
 *
 */
$( document ).on( "modification/changed", function ( event, data ) {

	var modification = { };
	modification[ data.name ] = data.value;
	$( document ).trigger( "unit/view", {
		unitData: modification
	} );

} );
