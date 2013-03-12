<?php

class TagsControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'tags');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'tags/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'tags/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'tags/1/edit');
		$this->assertTrue($response->isOk());
	}
}
