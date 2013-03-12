<?php

class TagsTableSeeder extends Seeder {

	public function run()
	{
		$tags = array(

		);

		DB::table('tags')->insert($tags);
	}

}
