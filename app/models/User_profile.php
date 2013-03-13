<?php

class User_Profile extends Eloquent {
	protected $table = 'user_profiles';

	public function user()
	{
		return $this->belongsTo('User');
	}
}