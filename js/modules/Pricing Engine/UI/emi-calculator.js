
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ EMI CALCULATOR
 * -/-/-/-/-/-/-
 */

// Store references to places in the DOM
$( function () {

	window.__UI = window.__UI || { };

	// EMI Calculator
	__UI.$emiSection = $( ".js_section_emi_calculator" );
	__UI.$emiDownPayment = __UI.$emiSection.find( ".js_down_payment" );
	__UI.$emiDownPaymentPercentage = __UI.$emiSection.find( ".js_down_payment_percentage" );
	__UI.$emiLoanAmount = __UI.$emiSection.find( ".js_loan_amount" );
	__UI.$emiTenure = __UI.$emiSection.find( ".js_tenure" );
	__UI.$emiInterestRate = __UI.$emiSection.find( ".js_interest_rate" );

	__UI.$emiEstimated = __UI.$emiSection.find( ".js_estimated_emi" );
	__UI.$emiTotalAmountPayable = __UI.$emiSection.find( ".js_total_amount_payable" );
	__UI.$emiPrincipalAmount = __UI.$emiSection.find( ".js_principal_amount" );
	__UI.$emiInterestAmount = __UI.$emiSection.find( ".js_interest_amount" );

} );

$( document ).on( "emi-calculator/render", function ( event, data ) {

	// If no data is provided, hide the EMI Calculator
	if ( ! data ) {
		$( ".js_section_emi_calculator" ).addClass( "hidden" );
		return;
	}

	var total = data.total;

	// Set the `Down payment` to be 20% of total by default
	var downPayment = 0.2 * total;
	var downPaymentPercentage = 20;
	var loanAmount = total - downPayment;
	var tenure = 240;
	var interestRate = 8.35;

	__UI.$emiDownPayment.val( formatNumberToIndianRupee( downPayment ) );
	__UI.$emiDownPaymentPercentage.text( downPaymentPercentage + "%" );
	__UI.$emiLoanAmount.val( formatNumberToIndianRupee( loanAmount ) );
	__UI.$emiTenure.val( tenure );
	__UI.$emiInterestRate.val( interestRate );

	// Store the input values on the global state
	__OMEGA.emi = {
		downPayment: downPayment,
		loanAmount: loanAmount,
		tenure: tenure,
		interestRate: interestRate
	};

	// Calculate the remaining figures
	$( document ).trigger( "emi-calculator/calculate" );

	$( ".js_section_emi_calculator" ).removeClass( "hidden" );

} );

$( document ).on( "emi-calculator/render/figures", function ( event, data ) {

	if ( ! data )
		return;

	var emi = data.emi
	var totalAmountPayable = data.totalAmountPayable
	var principalAmount = data.principalAmount
	var interestAmount = data.interestAmount

	__UI.$emiEstimated.text( formatNumberToIndianRupee( emi ) );
	__UI.$emiTotalAmountPayable.text( formatNumberToIndianRupee( totalAmountPayable ) );
	__UI.$emiPrincipalAmount.text( formatNumberToIndianRupee( principalAmount ) );
	__UI.$emiInterestAmount.text( formatNumberToIndianRupee( interestAmount ) );

} );

/*
 *
 * Changing the values of either of either,
 * 	- Down payment
 * 	- Loan amount
 * 	- Tenure
 * 	- Interest rate
 *
 */
// Down payment
$( document ).on( "input", ".js_down_payment", function () {

	var total = __OMEGA.unitData.grandTotal;

	// Pull the values from the markup, stripping away the formatting
	var downPayment = parseInt( __UI.$emiDownPayment.val().replace( /[^\d\.]/g, "" ), 10 );
	__OMEGA.emi.downPayment = downPayment;

	// Calculate the percentage of the Grand Total that the Down Payment is
	var downPaymentPercentage = Math.round( ( downPayment / total ) * 100 );
	__UI.$emiDownPaymentPercentage.text( downPaymentPercentage + "%" );

	// Calculate the loan amount
	var loanAmount = total - downPayment;
	__OMEGA.emi.loanAmount = loanAmount;

	// Reflect it in the UI
	__UI.$emiLoanAmount.val( formatNumberToIndianRupee( loanAmount ) );

	// Re-calculate the EMI figures
	$( document ).trigger( "emi-calculator/calculate" );

} );
$( document ).on( "blur", ".js_down_payment", function () {
	__UI.$emiDownPayment.val( function ( _i, downPayment ) {
		downPayment = parseInt( downPayment.replace( /[^\d\.]/g, "" ), 10 );
		return formatNumberToIndianRupee( downPayment );
	} );
} );
// Loan amount
$( document ).on( "input", ".js_loan_amount", function () {

	var total = __OMEGA.unitData.grandTotal;

	// Pull the values from the markup, stripping away the formatting
	var loanAmount = parseInt( __UI.$emiLoanAmount.val().replace( /[^\d\.]/g, "" ), 10 );
	__OMEGA.emi.loanAmount = loanAmount;

	// Calculate the down payment
	var downPayment = total - loanAmount;
	__OMEGA.emi.downPayment = downPayment;

	// Calculate the percentage of the Grand Total that the Down Payment is
	var downPaymentPercentage = Math.round( ( downPayment / total ) * 100 );
	__UI.$emiDownPaymentPercentage.text( downPaymentPercentage + "%" );

	// Reflect it in the UI
	__UI.$emiDownPayment.val( formatNumberToIndianRupee( downPayment ) );

	// Re-calculate the EMI figures
	$( document ).trigger( "emi-calculator/calculate" );

} );
$( document ).on( "blur", ".js_loan_amount", function () {
	__UI.$emiLoanAmount.val( function ( _i, loanAmount ) {
		loanAmount = parseInt( loanAmount.replace( /[^\d\.]/g, "" ), 10 );
		return formatNumberToIndianRupee( loanAmount );
	} );
} );
// Tenure
$( document ).on( "input", ".js_tenure", function () {

	// Pull the values from the markup, stripping away the formatting
	var tenure = parseInt( __UI.$emiTenure.val().replace( /[^\d\.]/g, "" ), 10 );
	__OMEGA.emi.tenure = tenure;

	// Re-calculate the EMI figures
	$( document ).trigger( "emi-calculator/calculate" );

} );
// Interest rate
$( document ).on( "input", ".js_interest_rate", function () {

	// Pull the values from the markup, stripping away the formatting
	var interestRate = parseInt( __UI.$emiInterestRate.val().replace( /[^\d\.]/g, "" ), 10 );
	__OMEGA.emi.interestRate = interestRate;

	// Re-calculate the EMI figures
	$( document ).trigger( "emi-calculator/calculate" );

} );
