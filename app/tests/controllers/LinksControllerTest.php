<?php

class LinksControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'links');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'links/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'links/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'links/1/edit');
		$this->assertTrue($response->isOk());
	}
}
