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

		$posts->load('author');
		$posts->load('mentions');
		$posts->load('comments.author');
		$posts->load('likes.user');

		return Response::json([
			'error' => false,
			'posts' => $posts->toArray()
		],200);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		$posts = Post::all();
		$posts->load('author');
		return View::make('posts.create')->with('posts', $posts);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$post = new Post(Input::only('body', 'title'));
		$post->author_id = Auth::user()->id;
		$post->admin_post = false;
		$post->save();
		if(Input::has('mentions')){
			$mentions = Input::get('mentions');
			foreach($mentions as $mention){
				$post->mentions()->attach($mention);
			}
		}
		$post->author;
		$post->mentions;
		return Response::json([
			'error' => false,
			'post' => $post->toArray()
		],200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function show($id)
	{
		$post = Post::find($id);
		$post->comments->load('author');
		$post->author;
		return Response::json([
			'error' => false,
			'post' => $post->toArray()
		],200);
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
		$post = Post::find($id);

		if(Input::has('body')){
			$post->body = Input::get('body');
		}
		if(Input::has('title')){
			$post->title = Input::get('title');
		}
		if(Input::has('admin_post')){
			$post->admin_post = Input::get('admin_post');
		}

		$post->save();
		$post->author;

		return Response::json([
			'error' => false,
			'post' => $post->toArray()
		],200);
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