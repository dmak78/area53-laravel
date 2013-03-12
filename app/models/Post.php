<?php

class Post extends Eloquent {
	protected $table = 'posts';

	public function comments()
	{
		return $this->has_many('Comment');
	}

	public function author()
	{
		return $this->belongs_to('User');
	}

	public function tags(){
		return $this->has_many_and_belongs_to('Tag');
	}
}