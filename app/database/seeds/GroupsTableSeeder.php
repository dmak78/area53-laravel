<?php

class GroupsTableSeeder extends Seeder {

	public function run()
	{
		$groups = array(

		);

		DB::table('groups')->insert($groups);
	}

}
