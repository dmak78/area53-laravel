<?php

class Event extends Eloquent {
	protected $table = 'events';

	public function owner()
	{
		return $this->morphTo();
	}

	public function photos()
	{
		return $this->morphMany('Photo', 'owner');
	}

	public function attendees()
	{
		return $this->belongsToMany('User');
	}
}