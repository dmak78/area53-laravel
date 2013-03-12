<?php

class Comment extends Eloquent {
	protected $table = 'comments';

	public function post()
	{
		return $this->belongs_to('Post');
	}

	public function author()
	{
		return $this->belongs_to('User');
	}

}