<?php

class Address extends Eloquent {
	protected $table = 'addresses';

	public function event()
	{
		return $this->belongs_to('Event');
	}

}