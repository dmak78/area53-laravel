<?php

class MentionsTableSeeder extends Seeder {

	public function run()
	{
		$mentions = array(

		);

		DB::table('mentions')->insert($mentions);
	}

}
