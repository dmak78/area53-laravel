@extends('layouts.master')

@section('content')
	<fieldset>
		{{Form::open(array('method' => 'POST', 'url' => '/api/v1/posts'))}}
			<p>
			{{Form::label('title', 'Title')}}
			{{Form::input('text', 'title')}}
			</p>
			<p>
			{{Form::label('body', 'Message')}}
			{{Form::textarea('body')}}
			</p>
			<p>
			<input type="hidden" name="mentions[]" value="1" />
			<input type="hidden" name="mentions[]" value="2" />
			<input type="hidden" name="mentions[]" value="3" />
			<input type="hidden" name="mentions[]" value="4" />

			<input type="hidden" value="{{ Auth::user()->id }}" />
			{{Form::submit('Post')}}
			</p>
		{{Form::close()}}
	</fieldset>

	<ul>
	@foreach($posts as $post)
		<li>{{$post->author->name}} | {{$post->body}} | {{$post->created_at }}</li>
	@endforeach
	</ul>
@stop