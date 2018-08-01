<?php

	// :: ONLY DURING DEVELOPMENT ::
	// debugging
	ini_set( "display_errors", 0 );
	ini_set( "error_reporting", E_ALL );

	// Get the environment
	require __DIR__ . '/inc/env.php';

	// get info on the request
	// $view = require "server/pageless.php";
	// $route = $view[ 0 ];
	$route = $_GET[ '_route' ];
	$controllerPath = __DIR__ . '/pages/' . $route . '-controller.php';

	// The controller returns the name (path) of the template to be rendered.
	// If not, then we search for the template in the "pages" folder.
	list( $viewName, $viewPath ) = include_once $controllerPath;
	if ( empty( $viewName ) ) {
		$viewName = $route;
	}
	if ( empty( $viewPath ) ) {
		$viewPath = __DIR__ . '/pages/' . $route . '.php';
	}

	/*
	 * Versioning Assets to invalidate the browser cache
	 */
	$ver = '?v=20180726_4';

	// included external php files with functions.
	require_once 'inc/head.php';

?>

<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
	prefix="og: http://ogp.me/ns# fb: http://www.facebook.com/2008/fbml">

<head>


	<!-- Nothing Above This -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<!-- Page Title | Page Name -->
	<title>LivingWalls | Secret Soil | <?php echo $viewName ?></title>

	<?php echo gethead(); ?>

</head>

<body id="body" class="body">

<!--  ★  MARKUP GOES HERE  ★  -->

<div id="page-wrapper" data-page="<?php echo $viewName ?>"><!-- Page Wrapper -->

	<!-- Page Content -->
	<div id="page-content">

		<?php require $viewPath; ?>

	</div><!-- END : Page Content -->

</div><!-- END : Page Wrapper -->

<!--  ☠  MARKUP ENDS HERE  ☠  -->

</body>

</html>
