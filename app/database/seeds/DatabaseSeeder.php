<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		// $this->call('UserTableSeeder');
		//$this->call('TasksTableSeeder');
		$this->call('PostsTableSeeder');
		$this->call('GroupsTableSeeder');
		$this->call('CommentsTableSeeder');
		$this->call('PhotosTableSeeder');
		$this->call('LinksTableSeeder');
		$this->call('EventsTableSeeder');
		$this->call('TagsTableSeeder');
		$this->call('CategoriesTableSeeder');
		$this->call('Post_typesTableSeeder');
		$this->call('MentionsTableSeeder');
		$this->call('DogsTableSeeder');
	}

}