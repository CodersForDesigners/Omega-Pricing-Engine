<?php function gethead(){ ?>

	<?php
		global $ver;
		global $productionEnv;
		global $projectFolderName;
	?>

	<!--
	*
	*	SEO Content
	*
	- -->
	<!-- Short description of your document's subject -->
	<meta name="subject" content="your document's subject">
	<!-- Short description of the document (limit to 150 characters) -->
	<!-- This content *may* be used as a part of search engine results. -->
	<meta name="description" content="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod. Excepteur sint occaecat cupidatat non proident.">
	<!-- Key Words -->
	<meta name="keywords" content="Keyword_A, Keyword_B, Keyword_C, Keyword_D, Keyword_E">



	<!--
	*
	*	Authors
	*
	- -->
	<!-- Links to information about the author(s) of the document -->
	<meta name="author" content="Lazaro Advertising">
	<link rel="author" href="humans.txt">

	<!-- Provides information about an author or another person -->
	<link rel="me" href="https://google.com/profiles/thenextweb" type="text/html">
	<link rel="me" href="mailto:name@example.com">
	<link rel="me" href="sms:+15035550125">



	<!--
	*
	*	SEO meta
	*
	- -->
	<!-- Set the base URL for all relative URLs within the document -->
	<?php if ( $productionEnv == true ) : ?>
		<base href="/<?php echo $projectFolderName ?>/"><!-- ( example : http://example.com/page.html ) -->
	<?php else : ?>
		<base href="/"><!-- ( example : http://example.com/page.html ) -->
	<?php endif; ?>
	<!-- Links to top level resource in an hierarchical structure -->
	<link rel="index" href="http://example.com/article/">
	<!-- Helps prevent duplicate content issues -->
	<link rel="canonical" href="https://example.com/">
	<!-- Control the behavior of search engine crawling and indexing -->
	<meta name="robots" content="index,follow"><!-- All Search Engines -->
	<meta name="googlebot" content="index,follow"><!-- Google Specific -->
	<!-- Verify website ownership -->
	<meta name="google-site-verification" content="verification_token"><!-- Google Search Console -->
	<meta name="alexaVerifyID" content="verification_token"><!-- Alexa Console -->
	<!-- Links to an AMP HTML version of the current document -->
	<link rel="amphtml" href="http://example.com/path/to/amp-version.html">



	<!--
	*
	*	Web Application
	*
	- -->
	<!-- Name of web application (only should be used if the website is used as an app) -->
	<meta name="application-name" content="Application Name">

	<!-- Links to a JSON file that specifies "installation" credentials for the web applications -->
	<link rel="manifest" href="manifest.json">

	<!-- ~ iOS ~ -->
	<!-- Disable automatic detection and formatting of possible phone numbers -->
	<meta name="format-detection" content="telephone=no">
	<!-- Launch Screen Image -->
	<link rel="apple-touch-startup-image" href="/path/to/launch.png">
	<!-- Launch Icon Title -->
	<meta name="apple-mobile-web-app-title" content="App Title">
	<!-- Enable standalone (full-screen) mode -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<!-- Status bar appearance (has no effect unless standalone mode is enabled) -->
	<meta name="apple-mobile-web-app-status-bar-style" content="black">

	<!-- ~ Android ~ -->
	<!-- Add to home screen -->
	<meta name="mobile-web-app-capable" content="yes">
	<!-- More info: https://developer.chrome.com/multidevice/android/installtohomescreen -->



	<!--
	*
	*	Social
	*
	- -->
	<!-- Facebook Open Graph -->
	<meta property="fb:app_id" content="123456789">
	<meta property="og:url" content="http://example.com/page.html">
	<meta property="og:type" content="website">
	<meta property="og:title" content="Content Title">
	<meta property="og:image" content="http://example.com/image.jpg">
	<meta property="og:description" content="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod. Excepteur sint occaecat cupidatat non proident.">
	<meta property="og:site_name" content="Site Name">
	<meta property="og:locale" content="en_US">
	<meta property="article:author" content="">



	<!-- ~ Facebook Instant Article ~ -->
	<!-- (sample : https://developers.facebook.com/docs/instant-articles/reference) -->
	<!-- (source : https://developers.facebook.com/docs/instant-articles/guides/articlecreate) -->
	<meta property="op:markup_version" content="v1.0">
	<!-- The URL of the web version of your article -->
	<link rel="canonical" href="http://example.com/article.html">
	<!-- The style to be used for this article -->
	<meta property="fb:article_style" content="myarticlestyle">

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary">
	<meta name="twitter:site" content="@site_handle">
	<meta name="twitter:creator" content="@publisher_handle">
	<meta name="twitter:url" content="http://example.com/page.html">
	<meta name="twitter:title" content="Post Title">
	<meta name="twitter:description" content="Content description less than 200 characters">
	<meta name="twitter:image" content="http://example.com/image.jpg">

	<!-- Google+ / Schema.org -->
	<link href="https://plus.google.com/+YourPage" rel="publisher">
	<meta itemprop="name" content="Content Title">
	<meta itemprop="description" content="Content description less than 200 characters">
	<meta itemprop="image" content="http://example.com/image.jpg">



	<!--
	*
	*	Favicon
	*
	- -->
	<link rel="apple-touch-icon" sizes="57x57" href="favicon/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="favicon/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="favicon/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="favicon/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="favicon/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="favicon/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="favicon/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="favicon/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"  href="favicon/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="favicon/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
	<link rel="manifest" href="favicon/manifest.json">
	<meta name="msapplication-TileColor" content="#444444">
	<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
	<meta name="theme-color" content="#444444">

	<!-- Safari Pinned Tab Icon -->
	<link rel="mask-icon" href="/path/to/icon.svg" color="blue">



	<!--
	*
	*	PreFetching, PreLoading, PreBrowsing
	*
	- -->
	<!-- More info: https://css-tricks.com/prefetching-preloading-prebrowsing/ -->
	<!-- <link rel="dns-prefetch" href="//example.com/">
	<link rel="preconnect" href="https://www.example.com/">
	<link rel="prefetch" href="https://www.example.com/">
	<link rel="prerender" href="http://example.com/">
	<link rel="preload" href="image.png" as="image"> -->



	<!--
	*
	*	Enqueue Files
	*
	- -->

	<!-- Fonts -->
	<link href="https://fonts.googleapis.com/css?family=Concert+One|Roboto:400,400i,700" rel="stylesheet">
	<!-- Icons -->
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<!-- Stylesheet -->
	<?php require __DIR__ . '/../style.php'; ?>
	<!-- Globals -->
	<script type="text/javascript">
		window.__envProduction = <?php if ( $productionEnv ) echo 'true'; else echo 'false'; ?>
	</script>
	<!-- jQuery -->
	<script type="text/javascript" src="plugins/jquery/jQuery-v3.3.1.min.js<?php echo $ver ?>"></script>
	<!-- Slick Carousel -->
	<link rel="stylesheet" type="text/css" href="plugins/slick/slick.css<?php echo $ver ?>"/>
	<link rel="stylesheet" type="text/css" href="plugins/slick/slick-theme.css<?php echo $ver ?>"/>

<?php } ?>
