<?php

class PhotosTableSeeder extends Seeder {

	public function run()
	{
		$photos = array(

		);

		DB::table('photos')->insert($photos);
	}

}
