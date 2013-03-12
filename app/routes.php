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

Route::get('/', function()
{
	return View::make('layouts.master');
});


Route::resource('posts', 'PostsController');

Route::resource('groups', 'GroupsController');

Route::resource('comments', 'CommentsController');

Route::resource('photos', 'PhotosController');

Route::resource('links', 'LinksController');

Route::resource('events', 'EventsController');

Route::resource('tags', 'TagsController');

Route::resource('categories', 'CategoriesController');

Route::controller('/newsfeed', 'NewsfeedController');