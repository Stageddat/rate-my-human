<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>terms of service - rate my human</title>
</svelte:head>

<div class="min-h-screen bg-[#f0ebe0] px-4 py-12">
	<div class="max-w-2xl mx-auto text-[#1f1b16]">
		<h1 class="text-2xl font-bold mb-6">terms of service</h1>

		<p class="mb-4">
			this is a prototype/mvp created for the <strong>#HACKTHEKITTY hackathon</strong>. it is
			provided as-is, with no warranties or guarantees of any kind. it is not intended for
			production use.
		</p>

		<h2 class="text-lg font-semibold mt-6 mb-2">what this app does</h2>
		<p class="mb-4">
			you upload a photo, it gets sent to the google ai (gemini) api for a fun cat-themed analysis,
			and you get a result. that's it.
		</p>

		<h2 class="text-lg font-semibold mt-6 mb-2">your images</h2>
		<p class="mb-4">
			images are not saved or stored after analysis. they are only sent to the google ai api for
			processing. by using this app, you also agree to
			<a
				href="https://ai.google.dev/terms"
				target="_blank"
				rel="noopener noreferrer"
				class="underline text-[#6b4c2a] hover:text-[#3a2a14]">google's ai terms of service</a
			>.
		</p>

		<h2 class="text-lg font-semibold mt-6 mb-2">usage</h2>
		<p class="mb-4">
			don't upload anything illegal or harmful. requests are rate-limited to 5 per minute per ip.
		</p>

		<p class="mt-8 text-sm text-[#6b5d4d]">last updated: july 2026</p>

		<a
			href={resolve('/')}
			class="inline-block mt-6 text-sm underline text-[#6b4c2a] hover:text-[#1f1b16]"
			>&larr; back to home</a
		>
	</div>
</div>
