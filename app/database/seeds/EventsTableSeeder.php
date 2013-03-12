<?php

class EventsTableSeeder extends Seeder {

	public function run()
	{
		$events = array(

		);

		DB::table('events')->insert($events);
	}

}
