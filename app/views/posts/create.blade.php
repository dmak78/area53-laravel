@extends('layouts.master')

@section('content')
	<fieldset>
		{{Form::open(array('method' => 'POST', 'url' => '/posts'))}}
			<p>
			{{Form::label('title', 'Title')}}
			{{Form::input('text', 'title')}}
			</p>
			<p>
			{{Form::label('body', 'Message')}}
			{{Form::textarea('body', array('size' => 200))}}
			</p>
			<p>
			{{Form::submit('Post')}}
			</p>
		{{Form::close()}}
	</fieldset>
@stop