<?php

class Post extends Eloquent {
	protected $table = 'posts';

	public function comments()
	{
		return $this->morphMany('Comment', 'owner');
	}

	public function author()
	{
		return $this->hasOne('User', 'author_id');
	}

	public function tags(){
		return $this->belongsToMany('Tag');
	}

	public function mentions(){
		return $this->belongsToMany('User');
	}
}