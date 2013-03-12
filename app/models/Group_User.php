<?php

class Group_User extends Eloquent {
	protected $table = 'group_user';

	public function user()
	{
		return $this->has_one('User');
	}
	public function group()
	{
		return $this->has_one('Group');
	}
}