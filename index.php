<?php

	// :: ONLY DURING DEVELOPMENT ::
	// debugging
	ini_set( "display_errors", "On" );
	ini_set( "error_reporting", E_ALL );

	/*
	 * Versioning Assets to invalidate the browser cache
	 */
	$ver = '?v=20180327';

	// get info on the request
	$view = require "server/pageless.php";
	$viewName = $view[ 0 ];
	$viewPath = $view[ 1 ];

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
	<title>Page Title <?php echo ( $viewName != "404" ? " | " . $viewName : "" ) ?></title>

	<?php echo gethead(); ?>

</head>

<body id="body" class="body">

<!--  ★  MARKUP GOES HERE  ★  -->

<div id="page-wrapper" data-page="<?php echo $viewName ?>"><!-- Page Wrapper -->

	<!-- Header Section -->
	<!-- <section class="header-section">
		<div class="container">
			<div class="header row">
				<div class="columns small-3">
					<a class="logo" href="/">
						<img src="/media/img/logo.svg<?php //echo $ver ?>">
					</a>
				</div>
				<div class="text-right columns small-9">
					<div class="navigation inline">
						<a class="button js_nav_button <?php //echo ( $viewName == "contact" ? "active" : "" ) ?>" data-page-id="contact" href="/contact">contact</a>
					</div>
				</div>
			</div>
		</div>
	</section> --> <!-- END : Header Section -->

	<!-- Page Content -->
	<div id="page-content">

		<?php require $viewPath; ?>

	</div><!-- END : Page Content -->


	<!-- Lazaro Signature -->
	<?php //lazaro_signature(); ?>
	<!-- END : Lazaro Signature -->

</div><!-- END : Page Wrapper -->









<!--  ☠  MARKUP ENDS HERE  ☠  -->

<?php lazaro_disclaimer(); ?>









<!-- Global vars -->
<script type="text/javascript">
	window.__OMEGA = window.__OMEGA || { };
</script>

<!-- JS Modules -->
<script type="text/javascript" src="js/modules/util.js"></script>
<script type="text/javascript" src="js/modules/user.js"></script>

<script type="text/javascript" src="plugins/SheetJS/xlsx-core-v0.13.0.min.js"></script>
<script type="text/javascript" src="plugins/xlsx-calc/xlsx-calc-v0.4.1.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/spreadsheet-formulae.js"></script>
<script type="text/javascript" src="plugins/handlebars/handlebars-v5.0.0a1.min.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/util.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/UI/main.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/UI/unit-filtration.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/UI/unit-search.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/UI/unit-sort.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/UI/unit-listing.js"></script>
<script type="text/javascript" src="plugins/slick/slick.min.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/UI/unit-detailed-view.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/UI/emi-calculator.js"></script>
<script type="text/javascript" src="js/modules/Pricing Engine/index.js"></script>

<script type="text/javascript">

	// Store references to places in the DOM
	$( function () {
		var OMEGA = window.__OMEGA = window.__OMEGA || { };
		OMEGA.unitFiltersSelected = [ { taxonomy: "Availability", type: "Available", attribute: "Availability", comparison: "is equal to", value: 1 } ];
		OMEGA.unitData = { };
		OMEGA.unitSortingBasis = "Floor Number";
	} );

	$( function () {

		// For now, to get things working
		// setTimeout( function () {
		// 	$( document ).trigger( "user.details.received" );
		// }, 0 )

		// If the user is not signed in, show the login prompt
		if ( ! ( __OMEGA && __OMEGA.user && __OMEGA.user.id ) ) {
			$( document ).trigger( "user/login/show" );
			return;
		}

		// If the user is signed in, fetch the user's details
		$( document ).trigger( "user/details/fetch", { id: __OMEGA.user.id } );

	} );

</script>

</body>

</html>
