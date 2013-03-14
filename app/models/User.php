<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Eloquent implements UserInterface, RemindableInterface {

	

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';



	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password');

	public function profile()
	{
		return $this->hasOne('User_Profile');
	}

	public function posts()
	{
		return $this->hasMany('Post', 'author_id');
	}

	public function groups()
	{
		return $this->belongsToMany('Group');
	}

	public function groups_created()
	{
		return $this->hasMany('Group', 'creator_id');
	}

	public function comments()
	{
		return $this->hasMany('Comment', 'author_id');
	}

	public function photos()
	{
		return $this->morphMany('Photo', 'owner');
	}
	
	public function events()
	{
		return $this->morphMany('Event', 'owner');
	}

	public function attending()
	{
		return $this->belongsToMany('Event');
	}

	public function mentions()
	{
		return $this->belongsToMany('Post');
	}

	public function likes()
	{
		return $this->belongsTo('Like', 'user_id');
	}

	public function links()
	{
		return $this->hasMany('Like', 'author_id');
	}

	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}

	public function getUserName()
	{
		return $this->username;
	}

}