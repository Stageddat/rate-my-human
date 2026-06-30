<script>
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>rate my human 😼</title>
</svelte:head>

<div>
	<div>
		<h1>rate my human!</h1>
		<p>check the quality of your human's HQ!</p>
	</div>
	<div>
		<p>upload HQ pictures (up to 3)</p>
		<p>or browse it!</p>
	</div>
</div>
<footer>
	<p>© 2026 rate my human. all rights reserved.</p>
	<div>
		<p>
			made by <a href="https://github.com/bestg">bestg</a>&
			<a href="https://stageddat.dev">stageddat</a> with ❤️
		</p>
		<p>#HACKTHEKITTY</p>
	</div>
	<div>
		<a href={resolve('/privacy')}>privacy policy</a>
		<a href={resolve('/tos')}>terms of service</a>
	</div>
</footer>
