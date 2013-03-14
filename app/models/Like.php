<?php

class Like extends Eloquent {
	protected $table = "likes";

	public function owner()
	{
		return $this->morphTo();
	}

	public function user()
	{
		return $this->hasOne('User', 'user_id');
	}
}