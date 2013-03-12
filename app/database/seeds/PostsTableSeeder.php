<?php

class PostsTableSeeder extends Seeder {

	public function run()
	{
		$posts = array(

		);

		DB::table('posts')->insert($posts);
	}

}
