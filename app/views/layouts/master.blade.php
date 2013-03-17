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
			<section class="supernav">
			  <ul>
					<li><a href="http://www.bigspaceship.com">Big Spaceship</a></li>
					<li><a href="https://bigspaceship.harvestapp.com">Harvest</a></li>
					<li><a href="#">Basecamp</a></li>
					<li><a href="https://esc.insperity.com">Insperity Employee Service Center</a></li>
					<li><a href="#">BSS Seating Chart</a></li>
					<li><a href="#">@DUMBO</a></li>
					<li><a href="http://mail.bigspaceship.com">BSS Google Mail</a></li>
			  </ul>
			</section>
			
			<div class="container header-content">
			  <div class="logos">
		  	  <a href="/home" class="global-logo" title="My Newsfeed" data-placement="bottom"><h1>AREA<small style="line-height:20px;">53</small></h1></a>

		  	  <a href="http://www.bigspaceship.com" class="hp-logo">Big Spaceship</a>
			  </div>
			  
				<nav class="primary-navigation">
		      <ul>
		        <li><a href="/profile/{{Auth::user()->id}}">My Profile</a></li>
		        <li><a href="/group">Groups</a></li>
		        <li><a href="/logout" class="about-link">Log Out</a></li>
		      </ul>
		    </nav>
		    
		    <div class="search-content">
		      <form>
		        <fieldset class="search-input">
		          <input type="text" class="search" placeholder="Search Area53">
		          <input type="submit" class="search-submit" value="Go">
		        </fieldset>
		      </form>
		    </div>
		  </div>
		</header>
		<div class="content">
			@yield('content')
		</div>
		<footer class="container global-footer" style="display:none;">
		  <nav class="footer-navigation">
		    <ul>
		      <li><a href="#">About</a></li>
		  		<li><a href="#">Feedback</a></li>
		  		<li><a href="http://www.bigspaceship.com/">bigspaceship.com</a></li>
		    </ul>
		  </nav>
		  
		  <p class="copyright">&copy; 2013 Big Spaceship LLC</p>
		</footer>
	</body>
</html>