<?php

class GroupsControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'groups');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'groups/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'groups/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'groups/1/edit');
		$this->assertTrue($response->isOk());
	}
}
