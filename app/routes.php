<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', array( 'before' => 'auth', function()
{
	return View::make('layouts.master');
}));

Route::get('login', array('as' => 'login' , function(){
	return View::make('layouts.login');
}));

Route::get('logout', function(){
	Auth::logout();
	return Redirect::to('home');
});

Route::post('login', function(){

	if (Auth::attempt(['email' => Input::get('email'), 'password' => Input::get('password')]))
	{
	    return Redirect::to('home');
	}
	else{
		return Redirect::to('login');
	}
});

Route::get('home', array( 'before' => 'auth' ,function()
{
	return View::make('pages.home');
}));

Route::group(array('prefix' => 'api/v1'), function() {
 
	Route::resource('users', 'UsersController');

	Route::resource('groups', 'GroupsController');

	Route::group(array('prefix' => 'posts/{post_id}'), function() {
		Route::resource('comments', 'PostCommentsController');
	});

	Route::resource('posts', 'PostsController');

	Route::group(array('prefix' => 'photos/{photo_id}'), function() {
		Route::resource('comments', 'PhotoCommentsController');
	});

	Route::resource('comments', 'CommentsController');

	Route::resource('photos', 'PhotosController');

	Route::resource('links', 'LinksController');

	Route::resource('likes', 'LikesController');

	Route::resource('events', 'EventsController');

	Route::resource('tags', 'TagsController');

	Route::controller('newsfeed', 'NewsfeedController');
 
});
