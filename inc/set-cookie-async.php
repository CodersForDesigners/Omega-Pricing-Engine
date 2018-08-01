<?php

if ( empty( $_GET ) )
	exit;

$cookieName = $_GET[ '_cookie' ];
$cookieDuration = (int) $_GET[ '_duration' ];
$cookieValue = base64_encode( $_GET[ 'data' ] );

setcookie( $cookieName, $cookieValue, time() + $cookieDuration, '/' );

exit;
