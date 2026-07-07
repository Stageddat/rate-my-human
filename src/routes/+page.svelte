<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	/** @type {{ form: any }} */
	let { form } = $props();

	let fileInput = $state<HTMLInputElement>();
	let previewUrl = $state<string | null>(null);
	let fileName = $state('');
	let loading = $state(false);

	function handleFileChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) {
			previewUrl = null;
			fileName = '';
			return;
		}
		fileName = file.name;
		previewUrl = URL.createObjectURL(file);
	}

	function openPicker() {
		fileInput?.click();
	}

	function reset() {
		previewUrl = null;
		fileName = '';
		if (fileInput) fileInput.value = '';
		form = null;
	}

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	};

	function verdictLabel(score: number) {
		if (score >= 80) return 'approved';
		if (score >= 60) return 'conditional pass';
		if (score >= 40) return 'needs work';
		return 'rejected';
	}

	function verdictColor(score: number) {
		if (score >= 80) return 'text-[#5c6b47]';
		if (score >= 60) return 'text-[#8a7a3d]';
		return 'text-[#b8442e]';
	}
</script>

<svelte:head>
	<title>rate my human</title>
</svelte:head>

<main class="min-h-screen bg-[#f0ebe0] flex flex-col">
	<!-- main -->
	<section class="flex-1 px-6 sm:px-10 py-12">
		<div class="max-w-5xl mx-auto">
			<div class="mb-10">
				<p class="font-mono text-xs tracking-[0.2em] uppercase text-[#b8442e] mb-2">
					#HACKTHEKITTY
				</p>
				<h2
					class="font-serif text-4xl sm:text-5xl font-black text-[#1f1b16] leading-[1.05] mb-4 w-full"
				>
					is your home fit for a cat?
				</h2>
				<p class="text-[#1f1b16]/70 leading-relaxed">
					submit a photo of any room. our feline inspector will file a full report: your human
					servant score, nap-spot viability, and official recommendations.
				</p>
			</div>

			<form
				method="POST"
				enctype="multipart/form-data"
				use:enhance={handleSubmit}
				class="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-0 border-2 border-[#1f1b16] bg-[#faf7f0]"
			>
				<input
					bind:this={fileInput}
					type="file"
					name="image"
					accept="image/jpeg,image/png,image/webp"
					class="hidden"
					onchange={handleFileChange}
				/>

				<!-- left: evidence / photo -->
				<div
					class="relative p-8 flex flex-col items-center justify-center gap-4 border-b-2 md:border-b-0 md:border-r-2 border-[#1f1b16] bg-[#ece5d4] min-h-85"
				>
					<span
						class="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-[#1f1b16]/40"
					>
						headquarters
					</span>

					{#if previewUrl}
						<img
							src={previewUrl}
							alt="submitted room"
							class="max-w-full max-h-[60vh] object-contain border-2 border-[#1f1b16] shadow-[6px_6px_0_0_rgba(31,27,22,0.15)]"
						/>
						<p class="font-mono text-[11px] text-[#1f1b16]/50 truncate max-w-full">{fileName}</p>
						{#if !form?.success && !loading}
							<button
								type="submit"
								class="px-6 py-2.5 bg-[#1f1b16] hover:bg-[#3a332a] active:scale-95 text-[#faf7f0] font-mono text-sm uppercase tracking-wider transition-all"
							>
								file for inspection
							</button>
						{/if}
					{:else}
						<span class="text-5xl" aria-hidden="true">📷</span>
						<p class="text-[#1f1b16] font-semibold text-center">attach a photo of the room</p>
						<p class="text-[#1f1b16]/50 text-sm text-center max-w-55">
							living room, bedroom, or favorite napping spot
						</p>
						<button
							type="button"
							onclick={openPicker}
							class="px-6 py-2.5 bg-[#1f1b16] hover:bg-[#3a332a] active:scale-95 text-[#faf7f0] font-mono text-sm uppercase tracking-wider transition-all"
						>
							browse files
						</button>
						<p class="font-mono text-[10px] text-[#1f1b16]/40 uppercase tracking-wide">
							jpg · png · webp · max 5mb
						</p>
					{/if}

					{#if form?.error}
						<p class="text-[#b8442e] text-sm text-center font-medium">{form.error}</p>
					{/if}
				</div>

				<!-- right: report -->
				<div class="p-8 flex flex-col gap-5">
					{#if loading}
						<div class="flex-1 flex flex-col items-center justify-center gap-3 py-10">
							<span class="text-4xl animate-bounce" aria-hidden="true">🐈‍⬛</span>
							<p class="font-mono text-sm text-[#1f1b16]/60 uppercase tracking-wide">
								inspector on site, please wait
							</p>
						</div>
					{:else if form?.success}
						<div class="flex flex-col gap-6">
							<!-- score block -->
							<div class="flex items-start justify-between gap-4">
								<div>
									<p class="font-mono text-[10px] uppercase tracking-widest text-[#1f1b16]/40 mb-1">
										human servant score
									</p>
									<p class="font-serif text-6xl font-black text-[#1f1b16] leading-none">
										{form.score}<span class="text-2xl text-[#1f1b16]/30">/100</span>
									</p>
								</div>
								<div
									class="rotate-[-8deg] border-2 {verdictColor(
										form.score
									)} rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap mt-1"
								>
									{verdictLabel(form.score)}
								</div>
							</div>

							<p class="text-[#1f1b16]/80 italic leading-relaxed border-l-2 border-[#b8442e] pl-4">
								"{form.verdict}"
							</p>

							<div>
								<p
									class="font-mono text-[11px] uppercase tracking-widest text-[#1f1b16] mb-2 flex items-center gap-2"
								>
									<span class="text-[#b8442e]">01</span> recommended improvements
								</p>
								<ul class="space-y-1.5">
									{#each form.recommendations as rec (rec)}
										<li class="text-sm text-[#1f1b16]/75 flex gap-2 leading-snug">
											<span class="text-[#1f1b16]/30">—</span>
											<span>{rec}</span>
										</li>
									{/each}
								</ul>
							</div>

							<div>
								<p
									class="font-mono text-[11px] uppercase tracking-widest text-[#1f1b16] mb-2 flex items-center gap-2"
								>
									<span class="text-[#b8442e]">02</span> care guidance
								</p>
								<ul class="space-y-1.5">
									{#each form.careTips as tip (tip)}
										<li class="text-sm text-[#1f1b16]/75 flex gap-2 leading-snug">
											<span class="text-[#1f1b16]/30">—</span>
											<span>{tip}</span>
										</li>
									{/each}
								</ul>
							</div>

							<button
								type="button"
								onclick={() => {
									reset();
								}}
								class="self-start mt-1 px-5 py-2 border-2 border-[#1f1b16] hover:bg-[#1f1b16] hover:text-[#faf7f0] active:scale-95 font-mono text-xs uppercase tracking-wider transition-all"
							>
								open new case
							</button>
						</div>
					{:else}
						<div class="flex-1 flex flex-col items-center justify-center gap-3 py-10 text-center">
							<span class="text-4xl opacity-30" aria-hidden="true">📋</span>
							<p class="font-mono text-sm text-[#1f1b16]/40 uppercase tracking-wide max-w-55">
								report will appear here once evidence is submitted
							</p>
						</div>
					{/if}
				</div>
			</form>
		</div>
	</section>

	<!-- footer -->
	<footer class="px-6 sm:px-10 py-6 border-t-2 border-[#1f1b16]/10">
		<div
			class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-[#1f1b16]/40 uppercase tracking-wide"
		>
			<p>© 2026 rate my human</p>

			<p class="text-center normal-case">
				made with ❤️ by
				<a href="https://github.com/bestg" class="underline hover:text-[#1f1b16] transition-colors"
					>bestg</a
				>
				&amp;
				<a href="https://stageddat.dev" class="underline hover:text-[#1f1b16] transition-colors"
					>stageddat</a
				>
			</p>

			<div class="flex gap-4">
				<a href={resolve('/privacy')} class="underline hover:text-[#1f1b16] transition-colors"
					>privacy</a
				>
				<a href={resolve('/tos')} class="underline hover:text-[#1f1b16] transition-colors">terms</a>
				<a
					href="https://github.com/Stageddat/rate-my-human"
					target="_blank"
					rel="noopener noreferrer"
					class="underline hover:text-[#1f1b16] transition-colors">github</a
				>
			</div>
		</div>
	</footer>
</main>
