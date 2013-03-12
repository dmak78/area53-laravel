<?php

class NewsfeedController extends BaseController { 
	
	public function getIndex()
	{	$posts = Post::find(1);
		return $posts;
	}

	public function getGroup($group_id)
	{
		return 'get group activity feeed for group: ' . $group_id;
	}


}