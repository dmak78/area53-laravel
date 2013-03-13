<?php

class Comment extends Eloquent {
	protected $table = 'comments';

	public function owner()
	{
		return $this->morphTo();
	}

	public function author()
	{
		return $this->belongsTo('User', 'author_id');
	}

}