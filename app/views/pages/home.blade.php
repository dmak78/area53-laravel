@extends('layouts.master')

@section('content')
<div class="homepage-banner">
  <div class="container">
    <div class="slider homepage-slider">
      <a href="#" class="prev">Previous Slide</a>
      <a href="#" class="next">Next Slide</a>
      
      <div class="slides">
        <div class="slide-wrap">
          <?php
          $slides = array(
            array(
              'classname' => 'welcome',
              'image' => '/assets/images/sliders/homepage/facesCarousel.jpg',
              'title' => '',
              'content' => '',
              'href' => null,
              'button' => null
            ),
            array(
              'classname' => 'newsletter-subscribe',
              'image' => '/assets/images/sliders/homepage/sizzleCarousel.jpg',
              'title' => 'Stay in the loop.',
              'content' => 'Join the PPS Group page to start up conversations and exchange thoughts with colleagues all over the world.',
              'href' => null,
              'button' => null
            ),
            array(
              'classname' => 'group-page',
              'image' => '/assets/images/sliders/homepage/facesCarousel.jpg',
              'title' => 'Join the OneHP group page.',
              'content' => 'You can help shape the future of OneHP. Join our community of supporters and share ideas about how we can improve OneHP.',
              'href' => '#',
              'button' => 'Subscribe Now'
            ),
            array(
              'classname' => 'welcome',
              'image' => '/assets/images/sliders/homepage/sizzleCarousel.jpg',
              'title' => 'Welcome to OneHP beta.',
              'content' => 'Time to collaborate with HP colleagues around the globe. Start exploring everything that our new internal social network has to offer.',
              'href' => null,
              'button' => null
            )
          );
          
          foreach ($slides as $key => $slide): ?>
            <?php $classname = isset($slide['classname']) ? ' ' . $slide['classname'] : ''; ?>
            <li class="slide <?php echo $classname; if ($key === 0) echo ' active'; ?>" style="background-image: url(<?php echo $slide['image']; ?>);">
              <div class="slide-contents">
                <h1 class="slide-title"><?php echo $slide['title']; ?></h1>
                <p class="slide-content"><?php echo $slide['content']; ?></p>

                <?php if (!is_null($slide['button'])): ?>
                  <a href="<?php echo $slide['href']; ?>" class="button"><?php echo $slide['button']; ?></a>
                <?php endif; ?>
              </div>
            </li>
          <?php endforeach; ?>
        </div>
      </div>
      
      <ul class="dots">
        <?php foreach (range(0, count($slides) - 1) as $index): ?>
          <li <?php if ($index === 0) { echo 'class="active"'; } ?> data-index="<?php echo $index; ?>">
            Slide <?php echo $index; ?>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</div>
<div class="platform-social-network">
	<section class="sidebars">
		<aside class="primary-sidebar" style="display:none;">
		</aside>
		<aside class="secondary-sidebar">
		</aside>
	</section>
	<section class="newsfeed" style="width:70%;">
		<form class="post-form post-status" data-type="status" name="post-to-wall">
		  <fieldset>
		    <div class="wysiwyg-textarea-wrapper">
		      <div class="textarea-wrapper">
		        <textarea class="post-content-input" placeholder="Share your thoughts&hellip;" name="body" rows="5"></textarea>
		      </div>
		    </div>
		  </fieldset>
		  
		  <fieldset class="tagging-interface">
		    <ul class="tag-list"></ul>
		    <input type="text" class="add-tag-typeahead" placeholder="Tag this post with a person&hellip;">
		  </fieldset>
		  
		  <ul class="tagged-users"></ul>
		  
		  <fieldset class="hidden-fields">
		    <input type="text" class="add-tag-typeahead" placeholder="Tag this post with a person&hellip;">
		  </fieldset>
		  
		  <div class="button-bar">
		    <a href="#" class="button add-tag">Add Tag</a>
		    
		    <input class="button post" type="submit" value="Post Comment">
		  </div>
		</form>
    
	    <nav class="newsfeed-tabs">
	      <ul class="nav nav-tabs">
	        <li class="active"><a href="#newsfeed-all" data-toggle="tab">All Activity</a></li>
	        <li><a href="#newsfeed-profile" data-toggle="tab">My Subscriptions</a></li>
	      </ul>
	    </nav>
	    
	    <div class="newsfeed-contents tab-content" style="display:block;">
	      <section class="tab-pane fade in active" id="newsfeed-all">
	          <img src="/assets/images/ajax-loader.gif" style="width:15px;height:15px;display:block;margin:0 auto;"/>
	      </section>
	      
	      <section class="tab-pane fade" id="newsfeed-profile">
	          <img src="/assets/images/ajax-loader.gif" style="width:15px;height:15px;display:block;margin:0 auto;"/>
	      </section>
	      
	      <div class="newsfeed-more">
	        <a href="#" class="button misc">More</a>
	      </div>
	    </div>
	</section>
</div>
@stop