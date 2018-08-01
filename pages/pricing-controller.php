<?php

$page = 'pricing';

$cookieName = 'omega-user';

// Is the user logged in?
$userIsLoggedIn = false;
if ( $_COOKIE[ $cookieName ] ) {
	try {
		$token = json_decode( base64_decode( $_COOKIE[ $cookieName ] ), true );
	} catch ( Exception $e ) {}
	if ( isset( $token[ '_id' ] ) ) {
		$userIsLoggedIn = true;
	}
}

$viewName = "Pricing";
$viewPath = __DIR__ . '/pricing.php';
// Return the path of the template to be rendered
return [ $viewName, $viewPath ];
