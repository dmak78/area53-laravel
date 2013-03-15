@extends('layouts.master')

@section('content')
<div class="row">
<div class="span6 offset3">
	<fieldset>
		{{Form::open(array('method' => 'POST', 'url' => '/api/v1/photos'))}}
			<p>
			{{Form::label('title', 'Title')}}
			{{Form::input('text', 'title')}}
			</p>
			<p>
			{{Form::label('url', 'URL')}}
			{{Form::input('text', 'url')}}
			</p>
			<p>
			{{Form::label('description', 'Message')}}
			{{Form::textarea('description')}}
			</p>
			<input type="hidden" value="{{Auth::user()->id }}" />
			<p>
			{{Form::submit('Post Photo')}}
			</p>
		{{Form::close()}}
	</fieldset>

	<ul>
	@foreach($photos as $photo)
		<li>{{$photo->title}} | {{$photo->url}} | {{$photo->author->name}}</li>
	@endforeach
	</ul>
	</div>
	</div>
@stop