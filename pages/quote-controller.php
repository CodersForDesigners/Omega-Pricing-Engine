<?php

$page = 'quote';

$cookieName = 'ruser';

// Invalidate the cookie if it has expired
// 	( i.e. if it's present in the first place )
$userIsLoggedIn = false;
if ( isset( $_COOKIE[ $cookieName ] ) ) {
	try {
		$token = json_decode( base64_decode( $_COOKIE[ $cookieName ] ), true );
		if ( time() < $token[ 'expires' ] ) {
			$userIsLoggedIn = true;
		} else {
			// Invalidate the cookie
			setcookie( $cookieName, '', time() - 999, '/' );
		}
		$user = $token;
	} catch ( Exception $e ) {}
}

$viewName = "Quote";
$viewPath = __DIR__ . '/pricing.php';
// Return the path of the template to be rendered
return [ $viewName, $viewPath ];
