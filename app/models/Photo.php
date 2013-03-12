<?php

class Photo extends Eloquent {
	protected $table = 'photos';

	public function author()
	{
		return $this->belongs_to('User');
	}
}