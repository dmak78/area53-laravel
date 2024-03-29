<?php

class PhotosController extends BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$photos = Photo::all();

		$photos->load('author');

		return Response::json([
			'error' => false,
			'posts' => $photos->toArray()
		],200);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		$photo = new Photo;
		$photos = Photo::all();
		$photos->load('author');
		return View::make('photos.create')->with('photos', $photos);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$photo = new Photo(Input::only('url', 'title', 'description', 'author_id'));
		$photo->author_id = Auth::user()->id;
		$photo->save();
		$photo->author;
		return Redirect::to('/api/v1/photos/create');
		return Response::json([
			'error' => false,
			'photo' => $photo->toArray()
		],200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function show($id)
	{
		$photo = Photo::find($id);
		$photo->comments->load('author');
		$photo->author;
		return Response::json([
			'error' => false,
			'photo' => $photo->toArray()
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
		$photo = Photo::find($id);

		if(Input::has('url')){
			$photo->url = Input::get('url');
		}

		$photo->save();
		$photo->author;

		return Response::json([
			'error' => false,
			'photo' => $photo->toArray()
		],200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @return Response
	 */
	public function destroy($id)
	{
		$photo = Photo::find($id);
		$photo->delete();

		return Response::json([
			'error' => false,
			'message' => 'photo deleted'
		],200);

	}

}