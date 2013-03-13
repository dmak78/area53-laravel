<?php

use Illuminate\Database\Migrations\Migration;

class CreateGroupProfilesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('group_profiles', function($table) {
			$table->increments('id');
			$table->string('nickname');
			$table->text('description');
			$table->integer('group_id');
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
		Schema::drop('group_profiles');
	}

}