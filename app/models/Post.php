<?php

class Post extends Eloquent {

	/**
	 * Run the migrations.
	 *
	 * @param integer 	id
	 * @param integer 	author_id
	 * @param text 		title
	 * @param text 		body
	 * @param boolean 	admin_post
	 * @param datetime	timestamps
	 */

	protected $table = 'posts';

	protected $fillable = array('author_id', 'title', 'body', 'admin_post');

	public function comments()
	{
		return $this->morphMany('Comment', 'owner');
	}

	public function author()
	{
		return $this->belongsTo('User', 'author_id');
	}

	public function tags(){
		return $this->belongsToMany('Tag');
	}

	public function mentions(){
		return $this->belongsToMany('User', 'post_user');
	}

	public function likes()
	{
		return $this->morphMany('Like', 'owner');
	}
}