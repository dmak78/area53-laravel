<?php

class EventsControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'events');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'events/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'events/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'events/1/edit');
		$this->assertTrue($response->isOk());
	}
}
