<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { Code } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";
	import { BASE_API_URL } from "$lib/stores/configStore";

	const { appId, table } = $props();

	let key = $state("");
	let showKey = $state(false);
	let keyInputValue = $derived(showKey ? key : "********************************");

	async function loadSecretKey() {
		if (!showKey) {
			try {
				const response = await fetchWithErrorHandling(`${$BASE_API_URL}/app/secret-key`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("bearer")}`,
					},
					body: JSON.stringify({
						id: Number(localStorage.getItem("id")),
						appId: appId,
					}),
				});

				const data = await response.json();
				key = data?.secret;
				showKey = true;
			} catch (error) {
				toast.error(error.message);
			}
		} else {
			showKey = false;
		}
	}

	let exampleResponse = $state("No response.");
	let exampleType = $state("user");
	let exampleReferenceId = $state("user-1");

	let code = $derived(`const axios = require('axios');

async function getEntry(referenceId, type) {
    try {
        const response = await axios.put("${$BASE_API_URL}/report/get-entry", {
            appId: ${appId},
            table: "${table}",
            type: type,
            secret: "${showKey ? key || "your-app-secret" : "********************************"}",
            referenceId: referenceId
        });
        console.log('Entry Data:', response.entry);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getEntry("${exampleReferenceId}", "${exampleType}");`);

	async function getTestEntry(referenceId, type) {
		if (!key || !showKey) return toast.error("Please reveal the key for testing.");

		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/report/get-entry`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					appId: appId,
					table: table,
					type,
					secret: key,
					referenceId,
				}),
			});

			const data = await response.json();
			exampleResponse = JSON.stringify(data, null, 2);
		} catch (error) {
			toast.error(error.message);
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Code /><span class="max-md:hidden">Check via API</span>
	</Dialog.Trigger>
	<Dialog.Content class="overflow-auto max-h-[75vh]">
		<Dialog.Header>
			<Dialog.Title>Get entry via the API</Dialog.Title>
			<Dialog.Description>
				Here's how you can access the API on your server to check for a {table} entry.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-6">
			<div>
				<Label for="key">Your secret key</Label>
				<div class="flex w-full max-w-sm items-center gap-2 mt-">
					<Input id="key" readonly={true} value={keyInputValue}></Input>
					<Button onclick={loadSecretKey}>{showKey ? "Hide" : "Reveal"}</Button>
				</div>
			</div>
			<div>
				<Label for="referenceId">Example Reference ID</Label>
				<Input id="referenceId" bind:value={exampleReferenceId} placeholder="Enter reference ID" />
			</div>
			<div>
				<Label for="type">Example Type</Label>
				<Input id="type" bind:value={exampleType} placeholder="Enter type" />
			</div>
			<div>
				<Button onclick={() => getTestEntry(exampleReferenceId, exampleType)}>Test Request</Button>
			</div>
			<div>
				<Label for="codeField">Example Node.js integration</Label>
				<div class="mt-1">
					<pre
						class="text-xs overflow-auto p-4 bg-neutral-800 text-white rounded-lg whitespace-pre-wrap">{@html code}</pre>
				</div>
			</div>
			<div>
				<Label for="responseField">API Response</Label>
				<div class="mt-1">
					<pre
						class="text-xs overflow-auto p-4 bg-neutral-800 text-white rounded-lg whitespace-pre-wrap">{exampleResponse}</pre>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
