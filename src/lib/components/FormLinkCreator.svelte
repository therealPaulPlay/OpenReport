<script>
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Captions, Copy } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import Checkbox from "./ui/checkbox/checkbox.svelte";

	let { apiKey } = $props();
	let type = $state("");
	let referenceId = $state("");
	let link = $state("");
	let reasons = $state("");
	let allowNotes = $state(true);
	let requireNotes = $state(false);

	$effect(() => {
		const params = new URLSearchParams();
		if (type) params.set("type", type);
		if (referenceId) params.set("reference-id", referenceId);
		params.set("key", apiKey);
		if (link) params.set("link", link);
		if (reasons) params.set("reasons", reasons);
		if (!allowNotes) params.set("allow-notes", "false");
		if (requireNotes) params.set("require-notes", "true");

		currentUrl = `https://${window.location.host}/report?${params.toString()}`;
	});

	let currentUrl = $state("");

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
	}

	const getFormattedCode = (url) => {
		return `<iframe 
	  src="${url}"
	  width="500px"
	  height="600px"
	  style="border: none; border-radius: 8px; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
></iframe>`;
	};
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Captions /> Create Form
	</Dialog.Trigger>
	<Dialog.Content class="max-w-2xl max-h-[80vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Form Link Creator</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-6">
			<div class="space-y-2 mt-4">
				<Label class="font-bold">Direct Link</Label>
				<div class="p-4 bg-muted rounded-lg break-all">
					<p class="font-mono text-sm">{currentUrl}</p>
					<Button variant="outline" size="sm" class="mt-2" onclick={() => copyToClipboard(currentUrl)}>
						<Copy class="w-4 h-4 mr-2" />Copy URL
					</Button>
				</div>
			</div>

			<div class="space-y-2 mt-4">
				<Label class="font-bold">Iframe Code</Label>
				<div class="p-4 bg-muted rounded-lg">
					<pre class="font-mono text-sm whitespace-pre-wrap">{getFormattedCode(currentUrl)}</pre>
					<Button
						variant="outline"
						size="sm"
						class="mt-2"
						onclick={() => copyToClipboard(getFormattedCode(currentUrl))}
					>
						<Copy class="w-4 h-4 mr-2" />Copy Code
					</Button>
				</div>
			</div>

			<div class="grid gap-4">
				<div class="space-y-2">
					<Label class="font-bold">Required Parameters</Label>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<Label for="type">Type *</Label>
							<Input id="type" bind:value={type} placeholder="e.g. comment" />
						</div>
						<div>
							<Label for="reference">Reference ID *</Label>
							<Input id="reference" bind:value={referenceId} placeholder="e.g. comment-33295" />
						</div>
						<div>
							<Label for="apiKey">API Key (public)</Label>
							<Input id="apiKey" value={apiKey} disabled class="bg-muted" />
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<Label class="font-bold">Optional Parameters</Label>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<Label for="link">Link</Label>
							<Input id="link" bind:value={link} placeholder="e.g. https://site.com/?comment=33295" />
						</div>
						<div>
							<Label for="reasons">Reasons (comma-separated)</Label>
							<Input id="reasons" bind:value={reasons} placeholder="Spam,Cheating,Harassment" />
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox type="checkbox" id="allowNotes" bind:checked={allowNotes} />
							<Label for="allowNotes">Allow Notes</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="requireNotes" bind:checked={requireNotes} />
							<Label for="requireNotes">Require Notes</Label>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Dialog.Close asChild>
				<Button variant="outline">Close</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
