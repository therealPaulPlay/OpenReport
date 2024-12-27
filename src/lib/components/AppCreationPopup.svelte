<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Plus } from "lucide-svelte";
	let { onCreateApp } = $props();
	let appName = $state("");
	let domains = $state("");
	let dbConfig = $state({
		host: "",
		port: 3306,
		user: "",
		password: "",
		database: "",
	});

	function createApp() {
		onCreateApp({ appName, domains, dbConfig });
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button><Plus size={16} class="mr-2" />Create New App</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Your First App</Dialog.Title>
			<Dialog.Description>Fill in the details below to create your application.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<div>
				<Label for="appName">App Name</Label>
				<Input id="appName" bind:value={appName} />
			</div>
			<div>
				<Label for="domains">Domains (comma-separated)</Label>
				<Input id="domains" bind:value={domains} />
			</div>
			<div>
				<Label>Database Configuration</Label>
				<div class="space-y-2">
					<Input bind:value={dbConfig.host} placeholder="Host" />
					<Input type="number" bind:value={dbConfig.port} placeholder="Port" />
					<Input bind:value={dbConfig.user} placeholder="User" />
					<Input type="password" bind:value={dbConfig.password} placeholder="Password" />
					<Input bind:value={dbConfig.database} placeholder="Database" />
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={createApp}>Create App</Button>
			<Button onclick={() => Dialog.close()}>Cancel</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>