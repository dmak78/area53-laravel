<?php

class Link extends Eloquent {
	protected $table = 'links';

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
}