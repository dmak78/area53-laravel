<?php

class User_profile extends Eloquent {
	protected $table = 'user_profiles';

	public function user()
	{
		return $this->belongs_to('User');
	}
}