<?php

$page = 'pricing-individual';

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
	if ( isset( $token[ 'id' ] ) ) {
		$userIsLoggedIn = true;
	}
}

// The unit being viewed
if ( ! empty( $_GET[ '_unit' ] ) ) {
	$unit = $_GET[ '_unit' ];
}
if ( $singleUnitIsBeingViewed and empty( $unit ) ) {
	// Show 404 page
}

$viewName = "Pricing for #" . $unit;
$viewPath = __DIR__ . '/pricing.php';
// Return the path of the template to be rendered
return [ $viewName, $viewPath ];
