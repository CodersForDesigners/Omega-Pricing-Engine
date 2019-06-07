#!/usr/bin/php
<?php

ini_set( "display_errors", 'stderr' );
ini_set( "error_reporting", E_ALL );

// Set the timezone
date_default_timezone_set( 'Asia/Kolkata' );
// Do not let this script timeout
set_time_limit( 0 );









// Allow this to run in the command line only
// if ( php_sapi_name() != 'cli' )
	// throw new Exception( 'This application must be run on the command line.' );

require_once __DIR__ . '/../../vendor/autoload.php';


function getClient () {

	$client = new Google_Client();
	$client->setApplicationName( 'Omega Pricing Sheet Import' );
	$client->setScopes( Google_Service_Drive::DRIVE );
	$authCredentialsFilename = __DIR__ . '/../../__environment/configuration/google-credentials.json';
	$client->setAuthConfig( $authCredentialsFilename );
	$client->setAccessType( 'offline' );
	$client->setPrompt( 'select_account consent' );

	/*
	 * Load previously authorized token from a file, if it exists.
	 * The file token.json stores the user's access and refresh tokens, and is
	 * created automatically when the authorization flow completes for the first
	 * time.
	 */
	$tokenPath = __DIR__ . '/../../__environment/configuration/google-token.json';
	if ( file_exists( $tokenPath ) ) {
		$accessToken = json_decode( file_get_contents( $tokenPath ), true );
		$client->setAccessToken( $accessToken );
	}

	// If an access token exists and is not expired, return
	if ( ! $client->isAccessTokenExpired() )
		return $client;

	// If an access token does not exist or is expired,
		// Refresh the token if possible
	if ( $client->getRefreshToken() ) {
		$client->fetchAccessTokenWithRefreshToken( $client->getRefreshToken() );
		return $client;
	}

		// Else, fetch a new one

	// Request authorization from the user.
	$authUrl = $client->createAuthUrl();
	printf( 'Open the following link in your browser:\n%s\n', $authUrl );
	print 'Enter verification code: ';
	$authCode = trim( fgets( STDIN ) );
	// Exchange authorization code for an access token.
	$accessToken = $client->fetchAccessTokenWithAuthCode( $authCode );
	$client->setAccessToken( $accessToken );
	// Check to see if there was an error.
	if ( array_key_exists( 'error', $accessToken ) )
		throw new Exception( join( ', ', $accessToken ) );
	// Save the token to a file.
	if ( ! file_exists( dirname( $tokenPath ) ) )
		mkdir( dirname( $tokenPath ), 0700, true );
	file_put_contents( $tokenPath, json_encode( $client->getAccessToken(), JSON_PRETTY_PRINT ) );

	return $client;

}

function main () {

	$client = getClient();
	$service = new Google_Service_Drive( $client );

	$pricingSheetMeta = json_decode( file_get_contents( __DIR__ . '/../../__environment/configuration/pricing-sheet.json' ), true );

	// First, fetch the dependencies the main sheet refers to
	//  	However, discard the responses
	$dependencies = $pricingSheetMeta[ 'dependencies' ];
	foreach ( $dependencies as $dependencyId ) {
		$service->files->export(
			$dependencyId,
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			[ 'alt' => 'media' ]
		);
	}

	// Now, fetch the main sheet
	$fileId = $pricingSheetMeta[ 'id' ];
	$response = $service->files->export(
		$fileId,
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		[ 'alt' => 'media' ]
	);
	$content = $response->getBody()->getContents();

	// Write the contents to disk
	$outputFilename = __DIR__ . '/../../account/data/numbers.xlsx';
	file_put_contents( $outputFilename, $content );

}





main();
