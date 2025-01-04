<script>
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDownIcon, Trash } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";
	import { currentPage, hasNextPage, tableData } from "$lib/stores/tableStore";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { fetchTableData } from "$lib/utils/fetchTableData";
	import { BASE_API_URL } from "$lib/stores/configStore";

	// Props
	let { table, appId } = $props();

	$effect(() => {
		fetchTableData(appId, table);
	});

	async function deleteEntry(entryId) {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/report/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: appId,
					table: table,
					entryId: entryId,
				}),
			});

			toast.success("Entry deleted successfully.");
			$tableData = $tableData.filter((item) => item.id !== entryId);
		} catch (error) {
			toast.error(error.message || "An error occurred while deleting the entry.");
		}
	}

	let expandNotes = $state(false);
	let expandNotesContent = $state();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Ref. ID</Table.Head>
			<Table.Head>Type</Table.Head>
			<Table.Head>Reason</Table.Head>
			<Table.Head>Notes</Table.Head>
			<Table.Head>Link</Table.Head>
			<Table.Head>Timestamp</Table.Head>
			<Table.Head>Reporter IP</Table.Head>
			<Table.Head>Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if $tableData.length > 0}
			{#each $tableData as item}
				<Table.Row>
					<Table.Cell>{item.reference_id}</Table.Cell>
					<Table.Cell>{item.type}</Table.Cell>
					<Table.Cell>{item.reason}</Table.Cell>
					<Table.Cell
						class="text-ellipsis overflow-hidden max-w-52 text-nowrap cursor-pointer"
						onclick={() => {
							expandNotes = true;
							expandNotesContent = item.notes;
						}}>{item.notes}</Table.Cell
					>
					<Table.Cell><a href={item.link} target="_blank" class="hover:underline">{item.link}</a></Table.Cell>
					<Table.Cell>{new Date(item.timestamp).toLocaleString()}</Table.Cell>
					<Table.Cell>{item.reporter_ip}</Table.Cell>
					<Table.Cell>
						<Button variant="outline" size="sm" onclick={() => deleteEntry(item.id)}>
							<Trash size={16} />
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan="7">No entries available.</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>

	<Table.Caption>
		<!-- Load More Button -->
		{#if $hasNextPage}
			<Button
				onclick={() => {
					$currentPage += 1;
					fetchTableData(appId, table);
				}}
				variant="outline"
				class="mt-2"
			>
				Load More
				<ArrowDownIcon />
			</Button>
		{/if}
	</Table.Caption>
</Table.Root>

<Dialog.Root bind:open={expandNotes}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Notes</Dialog.Title>
			<Dialog.Description>
				{expandNotesContent || "No content."}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Cancel>Ok</Dialog.Cancel>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
