<?php

class Photo extends Eloquent {
	protected $table = 'photos';

	public function owner()
	{
		return $this->morphTo();
	}

	public function tags()
	{
		return $this->belongsToMany('Tag');
	}

	public function comments()
	{
		return $this->morphMany('Comment', 'owner');
	}
	public function author()
	{
		return $this->belongsTo('User', 'author_id');
	}
}