<script>
	import { Database } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";
	import { getUser } from "$lib/utils/checkAuthentication";
	import { userDatabase } from "$lib/stores/accountStore";

	let dialogOpen = $state(false);

	let dbConfig = $state({
		host: "",
		port: null,
		user: "",
		password: "",
		database: "",
	});

	async function handleSubmit() {
		try {
			await fetchWithErrorHandling(`https://api.openreport.dev/user-database/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					db_host: dbConfig.host,
					db_port: Number(dbConfig.port),
					db_user_name: dbConfig.user,
					db_password: dbConfig.password,
					db_database: dbConfig.database,
				}),
			});
			toast.success("Database configuration saved.");
			getUser(); // Get user to update database state
			dialogOpen = false;
		} catch (error) {
			toast.error(error.message);
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<Database size={16} class="mr-2" />Database config
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$userDatabase ? "Change your MySQL database" : "Connect a MySQL database"}</Dialog.Title>
			<Dialog.Description
				>For security and data integrity reasons, it is recommended that you use a new (empty) database just for
				OpenReport. Make sure to allow connections from all IPs.</Dialog.Description
			>
		</Dialog.Header>
		<div>
			<Label for="host">Host</Label>
			<Input placeholder="IP / Domain" id="host" bind:value={dbConfig.host} />
		</div>
		<div>
			<Label for="port">Port</Label>
			<Input type="number" id="port" placeholder="MySQL default is 3306" bind:value={dbConfig.port} />
		</div>
		<div>
			<Label for="user">User</Label>
			<Input id="user" bind:value={dbConfig.user} placeholder="User" />
		</div>
		<div>
			<Label for="password">Password</Label>
			<Input bind:value={dbConfig.password} id="password" placeholder="Password" />
		</div>
		<div>
			<Label for="name">Database</Label>
			<Input placeholder="Name of your database" id="name" bind:value={dbConfig.database} />
		</div>
		<Dialog.Footer>
			<Button onclick={handleSubmit}>Test & Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
