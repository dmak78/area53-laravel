<?php

class PostCommentsController extends BaseController {

	

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($post_id)
	{
		$post = Post::find($post_id);

		$comments = $post->comments;
		$comments->load('author.profile');

		return (string) $comments->toJson();

		// return Response::json([
		// 	'error' => false,
		// 	'comments' => $comments->toArray()
		// ],200);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($post_id)
	{
		$input = Input::json();
		$comment = new Comment;
		$comment->body = $input['body'];
		$comment->author_id = Auth::user()->id;
		$post = Post::find($post_id);

		$comment = $post->comments()->save($comment);
		$comment->author;

		//return $comment;

		return (string) $comment->toJson();
	}

	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function show($id)
	{
		$comment = Comment::find($id);
		$comment->author->profile;

		return Response::json([
			'error' => false,
			'comment' => $comment->toArray()
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
	public function update($post_id, $id)
	{
		$comment = Comment::find($id);
		if(Input::has('body')){
			$comment->body = Input::get('body');
			$comment->save();
		}
		
		$comment->author->profile;

		return Response::json([
			'error' => false,
			'comment' => $comment->toArray()
		],200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @return Response
	 */
	public function destroy($post_id, $id)
	{
		$comment = Comment::find($id);
		$comment->delete();

		return Response::json([
			'error' => false,
			'message' => 'comment deleted'
		],200);
	}

}