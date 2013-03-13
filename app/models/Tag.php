<?php

class Tag extends Eloquent {
	protected $table = 'tags';

	public function photos()
	{
		return $this->belongsToMany('Photo');
	}

	public function posts()
	{
		return $this->belongsToMany('Post');
	}
}