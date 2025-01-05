<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Plus, Info } from "lucide-svelte";
	import { userDatabase } from "$lib/stores/accountStore";
	import { toast } from "svelte-sonner";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import DatabaseConfig from "./DatabaseConfig.svelte";
	import { BASE_API_URL } from "$lib/stores/configStore";

	let { fetchApps } = $props();

	let appName = $state("");
	let domains = $state("");
	let dialogOpen = $state(false);

	let loading = $state(false);

	async function handleCreate() {
		loading = true;

		if (!appName.trim()) {
			toast.error("App name is required");
			loading = false;
			return;
		}

		const domainList = domains
			.split(",")
			.map((domain) => domain.trim())
			.filter((domain) => domain.length > 0);

		if (domainList.length === 0) {
			toast.error("At least one domain is required");
			loading = false;
			return;
		}

		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/app/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appName: appName.trim(),
					domains: domainList,
				}),
			});
			toast.success("Application created successfully.");
			loading = false;
			appName = "";
			domains = "";
			dialogOpen = false;
			fetchApps?.();
		} catch (error) {
			toast.error(error.message);
			loading = false;
			fetchApps?.();
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants()}>
		<Plus size={16} class="mr-2" />Create App
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create an Application</Dialog.Title>
			<Dialog.Description>Fill in the details below to create your application.</Dialog.Description>
		</Dialog.Header>
		{#if $userDatabase}
			<div class="space-y-4">
				<!-- Info Note -->
				<div class="flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md text-sm text-neutral-700 dark:text-neutral-200">
					<Info size={50} class="mr-4" />
					<p>
						Your app name must be in lowercase and without spaces. This is required because the app name will be used as
						part of the table's names in your database.
					</p>
				</div>

				<div>
					<Label for="appName">App Name</Label>
					<Input id="appName" bind:value={appName} placeholder="your_app_name" />
				</div>
				<div>
					<Label for="domains">Domains (allowed referrers, comma-separated)</Label>
					<Input id="domains" bind:value={domains} placeholder="your-website.com, localhost:3000" />
				</div>
			</div>
			<Dialog.Footer>
				<Button onclick={handleCreate} disabled={loading}>Create App</Button>
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
