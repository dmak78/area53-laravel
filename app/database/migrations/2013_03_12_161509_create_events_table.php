<?php

use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('events', function($table) {
			$table->increments('id');
			$table->text('title');
			$table->text('description');
			$table->string('image_url');
			$table->text('location');
			$table->date('event_start_date');
			$table->date('event_end_date');
			$table->time('event_start_time');
			$table->time('event_end_time');
			$table->integer('owner_id');
			$table->string('owner_type');
			$table->string('url');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('events');
	}

}