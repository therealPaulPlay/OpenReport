<script>
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Captions, Copy } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import Checkbox from "./ui/checkbox/checkbox.svelte";
	import * as Accordion from "$lib/components/ui/accordion/index.js";

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
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></iframe>`;
	};
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Captions /><span class="max-md:hidden">Create form</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
		<Dialog.Header>
			<Dialog.Title>Form link creator</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-6">
			<div class="space-y-2 mt-4">
				<Label>Direct link</Label>
				<div class="flex flex-wrap gap-2 items-center">
					<div class="p-3 bg-muted rounded-md flex text-neutral-500 dark:text-neutral-400">
						<p class="font-mono text-xs text-break-chars">{currentUrl}</p>
					</div>
					<Button variant="secondary" onclick={() => copyToClipboard(currentUrl)}>
						<Copy class="w-4 h-4 mr-2" />Copy
					</Button>
				</div>
			</div>

			<div class="space-y-2">
				<Label>Iframe code</Label>
				<div class="p-4 bg-muted rounded-md text-neutral-500 dark:text-neutral-400">
					<pre class="font-mono text-xs text-break-chars">{getFormattedCode(currentUrl)}</pre>
				</div>
			</div>

			<div class="grid gap-4">
				<div class="space-y-2 border-y py-5">
					<Label>Required parameters</Label>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger class="text-left space-y-1">
										<Label for="type">Type</Label>
										<Input id="type" bind:value={type} placeholder="e.g. comment" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="max-w-52">
											The type refers to the reported content - for example, a post, user or comment.
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</div>
						<div>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger class="text-left space-y-1">
										<Label for="reference">Reference ID</Label>
										<Input id="reference" bind:value={referenceId} placeholder="e.g. comment-33295" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="max-w-52">
											The reference ID should correlate to the ID of the reported content in your backend.
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</div>
						<div class="space-y-1">
							<Label for="apiKey">Public API key</Label>
							<Input id="apiKey" value={apiKey} disabled class="bg-muted" />
						</div>
					</div>
				</div>

				<div class="space-y-2 border-b pb-5">
					<Label>Optional parameters</Label>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger class="text-left space-y-1">
										<Label for="link">Link</Label>
										<Input id="link" bind:value={link} placeholder="e.g. https://site.com/?comment=33295" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="max-w-52">
											Adding a link to the reported content makes it easier for moderators to evaluate the report.
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</div>
						<div class="space-y-1">
							<Label for="reasons">Reasons (comma-separated)</Label>
							<Input id="reasons" bind:value={reasons} placeholder="Spam, Cheating, Harassment" />
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox type="checkbox" id="allowNotes" bind:checked={allowNotes} />
							<Label for="allowNotes">Allow notes</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="requireNotes" bind:checked={requireNotes} />
							<Label for="requireNotes">Require notes</Label>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Accordion.Root type="single" class="-mt-2">
			<Accordion.Item value="item-1">
				<Accordion.Trigger>What is a Reference ID?</Accordion.Trigger>
				<Accordion.Content>
					<div class="p-4 bg-muted rounded-lg">
						<p class="text-sm">
							The reference ID can be used to trace back a report to an entry in your own database. It is recommended to
							set this dynamically. For example, if you have a <span class="italic">users</span> table with an
							<span class="italic">id</span> field, you can dynamically construct the reference-id query parameter to include
							that in the URL in your frontend code.
						</p>
					</div></Accordion.Content
				>
			</Accordion.Item>
		</Accordion.Root>
	</Dialog.Content>
</Dialog.Root>

<style>
	.text-break-chars {
		word-break: break-all;
		white-space: normal;
	}
</style>
