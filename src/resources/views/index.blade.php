<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<title>みんなの論証集</title>
		<meta name="description" content="司法試験論文試験対策のための論証を暗記するためのサイトです。自分オリジナルの論証集を作成することができます。他の人が作った論証を共有する機能もあります。">
		<script src="{{ asset(mix('js/app.js')) }}" defer></script>
        <link href="{{ asset(mix('css/app.css')) }}" rel="stylesheet">
		<link rel="icon" href="{{ asset('icon.png') }}">
	</head>
	<body class="bg-slate-100">
		<div id="app"></div>
	</body>
</html>