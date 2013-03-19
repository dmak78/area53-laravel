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
		foreach($posts as $post){
			$post->comment_count = $post->comments()->count();
			$post->mention_count = $post->mentions()->count();
			$post->like_count = $post->likes()->count();
			if($post->like_count > 0){
				$post->is_liked = $this->userLikes($post->likes->toArray());	
			}
			else{
				$post->is_liked = false;	
			}
				
		}
			
		return (string) $posts->toJson();

		// return Response::json([
		// 	'error' => false,
		// 	'posts' => $posts->toArray()
		// ],200);
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
		$input = Input::json();
		$post = new Post;
		$post->body = $input['body'];
		$mentions = $input['mentions'];
		$post->author_id = Auth::user()->id;
		$post->admin_post = false;
		$post->save();
		if(count($mentions) > 0 ){
			foreach($mentions as $mention){
				$mentioned_user = User::where('username', $mention)->first();
				$post->mentions()->attach($mentioned_user->id);
			}
		}
		$post->is_liked = $this->userLikes($post->likes);
		$post->author;
		$post->mentions;
		$post->comment_count = 0;
		$post->like_count = 0;
		$post->mention_count = count($mentions);
		return (string) $post->toJson();
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
		$input = Input::json();
		$post = Post::find($id);
		$user = Auth::user();

		if($input['is_liked']){
			$like = new Like(array('user_id' => $user->id));
			$post->likes()->save($like);
			$post->is_liked = true;
		}
		elseif(!$input['is_liked']){
			$like = $post->likes()->where('user_id', '=', $user->id)->first();
			$like->delete();
			$post->is_liked = false;
		}
		$post->author;
		$post->mentions;
		$post->likes->load('user');
		$post->comment_count = $post->comments()->count();
		$post->like_count = $post->likes()->count();
		$post->mention_count = $post->mentions()->count();

		return (string) $post->toJson();
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @return Response
	 */
	public function destroy($id)
	{
		$post = Post::find($id);
		$post->comments()->delete();
		$post->likes()->delete();
		$post->mentions()->delete();
		$post->delete();

		return Response::json([
			'error' => false,
			'message' => 'post deleted'
		],200);

	}

	/**
	 * Check to see if the current user likes a post
	 *
	 * @return boolean 
	 */

	protected function userLikes($likes){
		foreach($likes as $like){
			if($like['user']['id'] == Auth::user()->id){
				return TRUE;
			}

		}
	}

}