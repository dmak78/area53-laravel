<?php

class CategoriesTableSeeder extends Seeder {

	public function run()
	{
		$categories = array(

		);

		DB::table('categories')->insert($categories);
	}

}
