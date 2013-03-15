<?php

class PhotoCommentsController extends BaseController {

	

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($photo_id)
	{
		$photo = Photo::find($photo_id);

		$comments = $photo->comments;
		$comments->load('author.profile');

		return Response::json([
			'error' => false,
			'comments' => $comments->toArray()
		],200);
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
	public function store($photo_id)
	{
		$comment = new Comment(Input::only('body','author_id'));
		$comment->author_id = Auth::user()->id;
		$content = Photo::find($photo_id);

		$comment = $content->comments()->save($comment);
		$comment->author->profile;

		//return $comment;

		return Response::json([
			'error' => false,
			'comment' => $comment->toArray()
		],200);
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
	public function update($photo_id, $id)
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
	public function destroy($photo_id, $id)
	{
		$comment = Comment::find($id);
		$comment->delete();

		return Response::json([
			'error' => false,
			'message' => 'comment deleted'
		],200);
	}

}