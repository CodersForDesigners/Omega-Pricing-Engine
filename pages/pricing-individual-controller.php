<?php

$page = 'pricing-individual';
$viewSlug = 'page-pricing-individual';

$cookieName = 'omega-user';

/*
 *
 * If an individual unit is being viewed, only show the contents if the user
 *	is logged in. Otherwise, show them the login form.
 *
 * Check if a valid user cookie is present.
 *
 */
// Is a single unit being viewed?
$singleUnitIsBeingViewed = ! empty( $_GET[ '_unit' ] );
// Is the user logged in?
$userIsLoggedIn = false;
if ( $_COOKIE[ $cookieName ] ) {
	try {
		$token = json_decode( base64_decode( $_COOKIE[ $cookieName ] ), true );
	} catch ( Exception $e ) {}
	if ( isset( $token[ 'uid' ] ) ) {
		$userIsLoggedIn = true;
	}
}

// Has a User ID been provided?
try {
	if ( ! empty( $_GET[ 'uid' ] ) )
		$userId = base64_decode( $_GET[ 'uid' ] );
	else
		$userId = null;
} catch ( \Exception $e ) {}

// The unit being viewed
if ( ! empty( $_GET[ '_unit' ] ) ) {
	$unit = $_GET[ '_unit' ];
}
if ( $singleUnitIsBeingViewed and empty( $unit ) ) {
	// Show 404 page
}

$viewName = $unit . ' Pricing';
$viewPath = __DIR__ . '/pricing.php';
$meta = json_decode( file_get_contents( __DIR__ . '/../account/data/meta.json' ), true );

// Conditionally add the Unit-specific text
$unitSpecificText = 'Pricing for ';
if ( ! empty( $meta[ 'data' ][ 'Term for "Unit"' ] ) )
	$unitSpecificText .= $meta[ 'data' ][ 'Term for "Unit"' ] . ' ';
$unitSpecificText .= $unit . ' | ';
$meta[ 'tags' ][ 'og:title' ] = $unitSpecificText . $meta[ 'tags' ][ 'og:title' ];

// Return the path of the template to be rendered
return [ $viewName, $viewPath, $viewSlug, $meta ];
