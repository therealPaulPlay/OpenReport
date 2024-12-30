<script>
	import { Database } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { dbConfig } from "$lib/stores/configStore";
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="outline"><Database size={16} class="mr-2" />Database config</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Connect a MySQL database</Dialog.Title>
			<Dialog.Description
				>For security and data integrity reasons, it is recommended that you use a new (empty) database just for
				OpenReport. Make sure to allow connections from all IPs.</Dialog.Description
			>
		</Dialog.Header>
		<div>
			<Label for="host">Host</Label>
			<Input placeholder="IP / Domain" id="host" bind:value={$dbConfig.host} />
		</div>
		<div>
			<Label for="port">Port</Label>
			<Input type="number" id="port" placeholder="MySQL default is 3306" bind:value={$dbConfig.port} />
		</div>
		<div>
			<Label for="user">User</Label>
			<Input id="user" bind:value={$dbConfig.user} placeholder="User" />
		</div>
		<div>
			<Label for="password">Password</Label>
			<Input bind:value={$dbConfig.password} id="password" placeholder="Password" />
		</div>
		<div>
			<Label for="name">Database</Label>
			<Input placeholder="Name of your database" id="name" bind:value={$dbConfig.database} />
		</div>
		<Dialog.Footer>
			<Button type="submit">Test & Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
