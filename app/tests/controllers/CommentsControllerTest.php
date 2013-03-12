<?php

class CommentsControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'comments');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'comments/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'comments/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'comments/1/edit');
		$this->assertTrue($response->isOk());
	}
}
