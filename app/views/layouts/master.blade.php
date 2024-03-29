<!doctype html>

<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

		<title>Area53 - Big Spaceship</title>
		<meta name="description" content="">
		<meta name="author" content="">

		<!-- REQUIRE.JS -->
		<script src="/assets/javascripts/libs/require.js" data-main="/assets/javascripts/main.js"></script>

		<!-- styles -->
		<link rel="stylesheet" href="/assets/css/vendor/jquery-ui.css">
		<link rel="stylesheet" href="/assets/css/vendor/jquery.ui.timepicker.css">
		<link rel="stylesheet" href="/assets/css/vendor/wysihtml5.css">
		<link href="/assets/css/vendor/bootstrap.css" rel="stylesheet"> <!-- compiled from less/bootstrap.less -->
		<link href="http://www.bigspaceship.com/bss_favicon.ico" rel="icon"><!-- favicon -->

		<!-- Sass -->
		<link rel="stylesheet" href="/assets/css/style.css">
		<link rel="stylesheet" href="/assets/css/area53.css">
		<script>
			window.area53 = window.area53 || {};
	  
			// Config object.
			window.area53.config = {
				userId : {{Auth::user()->id}},
				user : {{Auth::user()}},
				userTimezone: '5.5',
				userCity: 'Bangalore, India'
			};
		</script>
	</head>
	<body>
		<header class="global-header">
		</header>
		<div id="page-content">
		</div>
		<footer class="container global-footer">
		</footer>
	</body>
</html>