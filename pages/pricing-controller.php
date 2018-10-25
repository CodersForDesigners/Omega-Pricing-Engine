<?php

$page = 'pricing';

$cookieName = 'omega-user';

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

$viewName = "Pricing";
$viewPath = __DIR__ . '/pricing.php';
$metaAttributes = json_decode( file_get_contents( __DIR__ . '/../account/data/meta.json' ), true );
// Return the path of the template to be rendered
return [ $viewName, $viewPath, '', $metaAttributes ];
