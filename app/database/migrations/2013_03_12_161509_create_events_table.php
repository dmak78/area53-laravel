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
			$table->integer('address_id');
			$table->date('event_start_date');
			$table->date('event_end_date');
			$table->time('event_start_time');
			$table->time('event_end_time');
			$table->integer('user_id');
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