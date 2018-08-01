<?php

if ( getenv( 'EXECUTION_ENVIRONMENT' ) == 'production' ) {
	$productionEnv = true;
} else {
	$productionEnv = false;
}
