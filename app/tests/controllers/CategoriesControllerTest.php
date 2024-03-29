<?php

class CategoriesControllerTest extends TestCase {
	public function testIndex()
	{
		$response = $this->call('GET', 'categories');
		$this->assertTrue($response->isOk());
	}

	public function testShow()
	{
		$response = $this->call('GET', 'categories/1');
		$this->assertTrue($response->isOk());
	}

	public function testCreate()
	{
		$response = $this->call('GET', 'categories/create');
		$this->assertTrue($response->isOk());
	}

	public function testEdit()
	{
		$response = $this->call('GET', 'categories/1/edit');
		$this->assertTrue($response->isOk());
	}
}
