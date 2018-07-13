
<?php

// set default params
$defaultView = "pageone";
$resourceNotFoundView = "404";

$resourceNotFoundViewPath = "pages/" . $resourceNotFoundView . ".php";

/*

	Incoming requests from the browser can be either synchronous or asynchronous
	An example of an asynchronous request is when a form is submitted;
		instead of loading an entirely new page, we only send back a status
		message to indicate how things went, and then accordingly update the UI
	Another example of an asynchronous request is when
		we need to fetch contents for another page and update the existing
		page "in-place", so for that we'll only need to send back a chunk of
		markup, and not an entire page

	Hence, we need a way to differentiate between the two.

	If the URI has a query param of "async",
		that's when we interpret the request to be asynchronous
	else
		assume that it is a synchronous request

 */

// extract the resource name
	// 1. trim whitespace on either end
	// 2. remove any trailing slash and/or a query-string if present
$resourceName = preg_replace(
	"/^\/(.*)\/?(?:\?.*)?$/U",
	"$1",
	$_SERVER[ "REQUEST_URI" ]
);
$resourceName = $resourceName == "" ? $defaultView : $resourceName;

/* -----
 ASYNCHRONOUS
 ----- */

if ( isset( $_REQUEST[ "async" ] ) && $_REQUEST[ "async" ] == "true" ) {

	$resourcePath = "pages/" . $resourceName . ".php";

	if ( file_exists( $resourcePath ) ) {
		$response = require $resourcePath;
		die( $response );
	}

}


/* -----
 SYNCHRONOUS
 ----- */

// Assuming the resource is a "view", i.e. markup
// if it exists, return it
$resourcePath = "pages/" . $resourceName . ".php";
if ( file_exists( $resourcePath ) ) {
	return [ $resourceName, $resourcePath ];
}

// Assuming the resource is
// simply data, i.e. some constant values, or
// a trigger for some action or computation, i.e. sending an e-mail
// if it exists, execute it
$resourcePath = "server/" . $resourceName . ".php";
if ( file_exists( $resourcePath ) ) {

	// initializing the response
	$response = [
		"status" => false,
		"message" => "could not ables",
		"data" => null
	];

	// $response = require $resourcePath;
	require $resourcePath;
	die( json_encode( $response ) );

}

// else, return the "not found" view
return [ $resourceNotFoundView, $resourceNotFoundViewPath ];
