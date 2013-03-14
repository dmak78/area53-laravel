<?php

use Illuminate\Database\Migrations\Migration;

class CreateLinkTagTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('link_tag', function($table) {
			$table->increments('id');
			$table->integer('link_id');
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
		Schema::drop('link_tag');
	}

}