<?php

class MentionsControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'mentions');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'mentions/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'mentions/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'mentions/1/edit');
		$this->assertTrue($response->isOk());
	}
}
