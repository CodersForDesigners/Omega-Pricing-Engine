<?php

ini_set( 'display_errors', 0 );
ini_set( 'error_reporting', E_ALL );

// Set the timezone
date_default_timezone_set( 'Asia/Kolkata' );
// Do not let this script timeout
set_time_limit( 0 );

// Respond in JSON format
header( 'Content-Type: text/html' );

// Extract the input
if ( empty( $_GET[ 'taxonomies' ] ) ) {
	http_response_code( 400 );
	echo 'Taxonomies not provided.';
	exit;
}

$taxonomies = $_GET[ 'taxonomies' ];
$filters = $_GET[ 'filters' ] ?? [ ];

?>


<?php foreach ( $taxonomies as $taxonomy ) : ?>
<div class="taxonomy">
	<h1 class="h3 name"><?php echo $taxonomy[ 'name' ] ?></h1>
	<div class="types">
		<?php foreach ( $taxonomy[ 'types' ] as $type ) : ?>
			<?php
				$filterIsSelected = "";
				foreach ( $filters as $filter ) {
					if (
						$filter[ 'type' ] == $type[ 'Name' ]
							and
						$filter[ 'taxonomy' ] == $taxonomy[ 'name' ]
					) {
						$filterIsSelected = "selected";
						break;
					}
				}
			?>
			<div class="type js_unit_filter <?php echo $filterIsSelected ?>" data-taxonomy="<?php echo $taxonomy[ 'name' ] ?>" data-type="<?php echo $type[ 'Name' ] ?>">
				<div class="name"><?php echo $type[ 'Name' ] ?></div>
				<div class="description"><?php echo $type[ 'Description' ] ?></div>
			</div>
		<?php endforeach; ?>
	</div>
</div>
<?php endforeach; ?>
