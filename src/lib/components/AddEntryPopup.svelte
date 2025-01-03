<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Plus } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";
	import { tableData } from "$lib/stores/tableStore";
	import { fetchTableData } from "$lib/utils/fetchTableData";
	import { BASE_API_URL } from "$lib/stores/configStore";

	let dialogOpen = $state(false);
	let referenceId = $state("");
	let type = $state("");
	let reason = $state("");
	let link = $state("");

	const { appId, table } = $props();

	async function handleCreate() {
		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/report/add-manually`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: appId,
					table,
					referenceId,
					type,
					reason,
					link,
				}),
			});
			toast.success("Entry created successfully");
			dialogOpen = false;
			resetForm();
			fetchTableData(appId, table, true);
		} catch (error) {
			toast.error(error.message);
		}
	}

	function resetForm() {
		referenceId = "";
		type = "";
		reason = "";
		link = "";
	}

	function isValid() {
		return referenceId && type && reason;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Plus class="mr-2" /> Add
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add entry</Dialog.Title>
			<Dialog.Description>Manually add an entry to the {table}.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<div class="space-y-2">
				<Input placeholder="Reference ID" bind:value={referenceId} />
				<Input placeholder="Type" bind:value={type} />
				<Input placeholder="Reason" bind:value={reason} />
				<Input placeholder="Link (optional)" bind:value={link} />
			</div>

			<Button class="w-full" onclick={handleCreate} disabled={!isValid()}>
				<Plus size={16} class="mr-2" />Create entry
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
