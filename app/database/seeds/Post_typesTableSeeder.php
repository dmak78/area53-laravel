<?php

class Post_typesTableSeeder extends Seeder {

	public function run()
	{
		$post_types = array(

		);

		DB::table('post_types')->insert($post_types);
	}

}
