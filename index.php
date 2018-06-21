<?php

	// :: ONLY DURING DEVELOPMENT ::
	// debugging
	ini_set( "display_errors", "On" );
	ini_set( "error_reporting", E_ALL );

	/*
	 * Versioning Assets to invalidate the browser cache
	 */
	$ver = '?v=20180327';

	// included external php files with functions.
	require ('inc/head.php');
	require ('inc/lazaro.php'); /* -- Lazaro disclaimer and footer -- */

?>

<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
	prefix="og: http://ogp.me/ns# fb: http://www.facebook.com/2008/fbml">

<head>


	<!-- Nothing Above This -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<!-- Page Title | Page Name -->
	<title>Pricing Engine</title>

	<?php echo gethead(); ?>

</head>

<body id="body" class="body">

<!--  ★  MARKUP GOES HERE  ★  -->

<div id="page-wrapper"><!-- Page Wrapper -->

	<!-- Header Section -->
	<section class="header-section">
		<div class="container">
			<div class="header row">
				<div class="columns small-3">
					<a class="logo" href="/">
						<img src="/media/img/logo.svg<?php echo $ver ?>">
					</a>
				</div>
				<div class="text-right columns small-9">
					<div class="navigation inline">
						<a class="button js_nav_button <?php echo ( $viewName == "contact" ? "active" : "" ) ?>" data-page-id="contact" href="/contact">contact</a>
					</div>
				</div>
			</div>
		</div>
	</section> <!-- END : Header Section -->


	<!-- Page Content -->
	<div id="page-content">

		<!-- Simply Emtpy Space -->
		<div style="height: 100px;"></div>

		<!-- Selected Unit Filters -->
		<section class="section-selected-unit-filters">
			<div class="container js_selected_unit_filters">
				<!-- Markup will be managed by JavaScript -->
			</div>
		</section>

		<!-- Unit Classifications -->
		<section class="section-unit-search">
			<div class="container js_unit_search">
				<!-- Markup will be managed by JavaScript -->
			</div>
		</section>

		<section class="section-unit-listing">
			<h1 class="h3">Units</h1>
			<div class="container js_unit_listing">
				<!-- Markup will be managed by JavaScript -->
			</div>
		</section>

		<section class="section-unit-details-and-mods js_section_unit_details_and_mods hidden">
			<h1 class="h3">
				<span>Unit</span>
				<span class="js_unit_number_heading"></span>
			</h1>
			<div class="container js_unit_details_and_mods">
				<!-- Markup will be managed by JavaScript -->
			</div>
		</section>

		<section class="section-emi-calculator js_section_emi_calculator hidden">
			<div class="js_section_emi_toggle">
				<h1 class="h3">Estimate Your EMI</h1>
			</div>
			<div class="container js_section_emi_main">
				<div class="input-fields">
					<div>
						<div class="label">Down payment (in ₹)</div>
						<div class="ctr-input">
							<input type="text" name="down-payment">
							<div class="">20%</div>
						</div>
					</div>
					<div>
						<div class="label">Loan amount</div>
						<div class="ctr-input">
							<input type="text" name="loan-amount">
						</div>
					</div>
					<div>
						<div class="label">Tenure</div>
						<div class="ctr-input">
							<input type="text" name="tenure">
							<div class="">months</div>
						</div>
					</div>
					<div>
						<div class="label">Interest rate</div>
						<div class="ctr-input">
							<input type="text" name="interest-rate">
							<div class="">P.A.</div>
						</div>
					</div>
				</div>
				<div class="figures">
					<div class="figure em">
						<div>Estimated EMI</div>
						<div class="amt"></div>
					</div>
					<div class="figure">
						<div>Total Amount Payable</div>
						<div class="amt"></div>
					</div>
					<div class="figure">
						<div>Principal Amount</div>
						<div class="amt"></div>
					</div>
					<div class="figure">
						<div>Interest Amount</div>
						<div class="amt"></div>
					</div>
				</div>
			</div>
		</section>

		<!-- Simply Emtpy Space -->
		<div style="height: 100px;"></div>

	</div><!-- END : Page Content -->


	<!-- Lazaro Signature -->
	<?php lazaro_signature(); ?>
	<!-- END : Lazaro Signature -->

</div><!-- END : Page Wrapper -->









<!--  ☠  MARKUP ENDS HERE  ☠  -->

<?php lazaro_disclaimer(); ?>









<!-- Templates -->

<template class="tmpl-filter-bubble">
	<div class="unit-filter js_unit_filter" data-taxonomy="{{ taxonomy }}" data-type="{{ type }}">
		<span class="name">{{ type }}</span>
		<span class="remove js_remove"></span>
	</div>
</template>

<template class="tmpl-unit-list-item">
	<div class="unit-list-item js_unit_list_item" data-unit="{{ Unit }}">
		<span class="number">{{ Unit }}</span>
		<span class="floor">{{ Floor | floorInOrdinalWord }} floor</span>
		<span class="area">{{ BHK }}BHK</span>
		<span class="area">{{ Area }} sqft</span>
		<span class="view-details">view</span>
	</div>
</template>

<template class="tmpl-unit-detail-list-item">
	<div class="unit-detail-list-item {{ Value | hiddenIfNull }}">
		<span class="detail">{{ Detail }}</span>
		<span class="value">{{ Value }}</span>
	</div>
</template>

<!-- TEMPLATES END HERE -->


<!-- Global vars -->
<script type="text/javascript">
	window.__OMEGA = window.__OMEGA || { };
</script>

<!-- JS Modules -->
<script type="text/javascript" src="js/modules/util.js"></script>
<!-- <script type="text/javascript" src="plugins/jquery/jQuery-v3.3.1.min.js"></script> -->
<script type="text/javascript" src="js/modules/Pricing Engine/lib.js"></script>
<script type="text/javascript" src="js/modules/user.js"></script>

<script type="text/javascript" src="plugins/SheetJS/xlsx-core-v0.13.0.min.js"></script>
<script type="text/javascript" src="plugins/xlsx-calc/xlsx-calc-v0.4.1.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/spreadsheet-formulae.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/ui.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/index.js"></script>

<script type="text/javascript">

	// Store references to places in the DOM
	$( function () {
		var OMEGA = window.__OMEGA = window.__OMEGA || { };
		OMEGA.unitFiltersSelected = [ { taxonomy: "Availability", type: "Available", attribute: "Availability", comparison: "is equal to", value: 1 } ];
	} );

	$( function () {

		// For now, to get things working
		// setTimeout( function () {
		// 	$( document ).trigger( "user.details.received" );
		// }, 0 )

		// If the user is not signed in, show the login prompt
		if ( ! ( __OMEGA && __OMEGA.user && __OMEGA.user.id ) ) {
			$( document ).trigger( "user.login.show" );
			return;
		}

		// If the user is signed in, fetch the user's details
		$( document ).trigger( "user.details.fetch", { id: __OMEGA.user.id } );

	} );

</script>

</body>

</html>
