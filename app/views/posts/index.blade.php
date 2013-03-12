@extends('layouts.master')

@section('content')
<h1>Posts</h1>
<ul>
	@foreach($posts as $post)
	<li>{{$post->title}} : '{{$post->body}}' </li>
	@endforeach	
</ul>
@stop