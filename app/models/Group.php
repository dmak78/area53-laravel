<?php

class Group extends Eloquent {
	protected $table = 'groups';

	public function users()
	{
		return $this->has_many_and_belongs_to('User');
	}
}