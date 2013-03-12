<?php

class PostsController extends BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$posts = Post::all();

		return View::make('posts.index')->with('posts', $posts);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		$post = new Post;
		return View::make('posts.create')->with('post', $post);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		 $post = new Post;

		 $post->title = Input::get('title');
		// $post->author_id = Input::get('author_id');
		 $post->body = Input::get('body');
		// $post->admin_post = Input::get('admin_post');
		// $post->type_id = Input::get('type_id');

		 $post->save();

		 return Redirect::to('/posts');

		//return $post;
	}

	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function show($id)
	{
		
		$post = Post::find($id);
		return $post;
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @return Response
	 */
	public function update($id)
	{
		// $post = Post::find($id);
		// if(Input::get('title')){
		// 	$post->title = Input::get('title');
		// }
		// if(Input::get('author_id')){
		// 	$post->author_id = Input::get('author_id');
		// }
		// if(Input::get('body')){
		// 	$post->body = Input::get('body');
		// }
		// if(Input::get('admin_post')){
		// 	$post->admin_post = Input::get('admin_post');
		// }
		// if(Input::get('type_id')){
		// 	$post->type_id = Input::get('type_id');
		// }

		// $post->save();

		// return $post;

		return 'h1';
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @return Response
	 */
	public function destroy($id)
	{
		$post = Post::find($id);
		$post->delete();

		return Response::json([
			'error' => false,
			'message' => 'post deleted'
			],200);

	}

}