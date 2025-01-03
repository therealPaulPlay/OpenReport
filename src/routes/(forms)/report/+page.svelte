<script>
	import ReportForm from "$lib/components/ReportForm.svelte";
	import { page } from "$app/stores";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { onMount } from "svelte";

	let showError = $state(false);
	let missingParams = $state([]);

	onMount(() => {
		const params = $page.url.searchParams;
		const required = ["type", "reference-id", "key"];
		missingParams = required.filter((param) => !params.get(param));
		showError = missingParams.length > 0;
	});

	// Get spread props from URL Search params
	const getReportParams = () => {
		const params = $page.url.searchParams;
		return {
			type: params.get("type"),
			referenceId: params.get("reference-id"),
			apiKey: params.get("key"),
			link: params.get("link"),
			allowNotes: params.get("allow-notes") === "false" ? false : true,
			requireNotes: params.get("require-notes") === "true",
			reportReasons: params.get("reasons")?.split(","),
		};
	};
</script>

<svelte:head>
	<title>Submit Report</title>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
</svelte:head>

<main class="w-full h-screen flex justify-center items-center p-4">
	<div class="flex justify-center items-center flex-col w-full">
		<ReportForm {...getReportParams()} />
		<p class="opacity-35 mt-3">
			powered by <a href="https://openreport.dev" target="_blank" class="underline">OpenReport</a>
		</p>
	</div>
</main>

<Dialog.Root open={showError}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Missing required parameters</Dialog.Title>
			<Dialog.Description>
				The following parameters are required: {missingParams.join(", ")}. If this is not your website, please inform
				the owner about this.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Cancel>Ok</Dialog.Cancel>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
