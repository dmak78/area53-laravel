<?php

class NewsfeedController extends BaseController { 
	
	public function getAll()
	{	
		return 'newsfeed';
	}
	public function deleteComments($post_id=null, $id=null)
	{
		return 'delete comment';
	}
}