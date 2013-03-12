<?php

class Event extends Eloquent {
	protected $table = 'events';

	public function author()
	{
		return $this->belongs_to('User');
	}

	public function address()
	{
		return $this->has_one('Address');
	}

}