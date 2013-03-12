<?php

class PhotosControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'photos');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'photos/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'photos/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'photos/1/edit');
		$this->assertTrue($response->isOk());
	}
}
