<?php
?>
<!DOCTYPE html>
<html lang="en">

<head>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<title></title>

</head>



<body>

	<script type="text/javascript">

		window.onload = function () {
			setTimeout( function () {
				window.parent.postMessage( {
					status: "ready"
				}, location.origin );
			}, 1000 );
		};

	</script>





</body>

</html>
