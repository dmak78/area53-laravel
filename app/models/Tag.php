<?php

class Tag extends Eloquent {
	protected $table = 'tags';

	public function posts()
	{
		return $this->belongs_to('Post');
	}
}