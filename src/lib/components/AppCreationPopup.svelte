<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Plus } from "lucide-svelte";
	import { dbConfig } from "$lib/stores/configStore";
	import DatabaseConfig from "./DatabaseConfig.svelte";

	let appName = $state("");
	let domains = $state("");
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button><Plus size={16} class="mr-2" />Create App</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create an Application</Dialog.Title>
			<Dialog.Description>Fill in the details below to create your application.</Dialog.Description>
		</Dialog.Header>
		{#if $dbConfig?.host}
			<div class="space-y-4">
				<div>
					<Label for="appName">App Name</Label>
					<Input id="appName" bind:value={appName} />
				</div>
				<div>
					<Label for="domains">Domain(s) (comma-separated)</Label>
					<Input id="domains" bind:value={domains} />
				</div>
			</div>
			<Dialog.Footer>
				<Button>Create App</Button>
			</Dialog.Footer>
		{:else}
		<div class="flex flex-wrap space-y-4 justify-start items-center">
			<p class="text-muted-200 text-sm">
				Before creating an app, you need to connect a MySQL database which will be used to store reports for all apps.
			</p>
			<DatabaseConfig />
		</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
