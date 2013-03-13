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
}