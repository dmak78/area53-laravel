<?php

use Illuminate\Database\Migrations\Migration;

class CreatePhotoTagTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('photo_tag', function($table) {
			$table->increments('id');
			$table->integer('photo_id');
			$table->integer('tag_id');
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
		Schema::drop('photo_tag');
	}

}