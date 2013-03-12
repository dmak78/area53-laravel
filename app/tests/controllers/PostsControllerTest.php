<?php

class PostsControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'posts');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'posts/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'posts/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'posts/1/edit');
		$this->assertTrue($response->isOk());
	}
}
