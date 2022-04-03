<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<title>みんなの論証集</title>
		<script src="{{ asset(mix('js/app.js')) }}" defer></script>
        <link href="{{ asset(mix('css/app.css')) }}" rel="stylesheet">
	</head>
	<body class="bg-slate-100">
		<div id="app"></div>
	</body>
</html>