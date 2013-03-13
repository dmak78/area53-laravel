<?php

class Group_Profile extends Eloquent {
	protected $table = 'group_profiles';

	public function group()
	{
		return $this->belongsTo('Group');
	}
}