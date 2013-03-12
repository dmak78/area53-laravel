<?php

class LinksTableSeeder extends Seeder {

	public function run()
	{
		$links = array(

		);

		DB::table('links')->insert($links);
	}

}
