<?php

class Group extends Eloquent {
	protected $table = 'groups';

	public function members()
	{
		return $this->belongsToMany('User');
	}

	public function creator()
	{
		return $this->belongsTo('User', 'creator_id');
	}

	public function events()
	{
		return $this->morphMany('Event', 'owner');
	}

	public function profile()
	{
		return $this->hasOne('Group_Profile');
	}
}