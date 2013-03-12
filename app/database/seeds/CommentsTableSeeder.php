<?php

class CommentsTableSeeder extends Seeder {

	public function run()
	{
		$comments = array(

		);

		DB::table('comments')->insert($comments);
	}

}
