<?php

class Post_typesControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'post_types');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'post_types/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'post_types/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'post_types/1/edit');
		$this->assertTrue($response->isOk());
	}
}
