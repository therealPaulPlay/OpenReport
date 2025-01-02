<script>
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDownIcon, Trash } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";
	import { currentPage, hasNextPage, tableData } from "$lib/stores/tableStore";
	import { fetchTableData } from "$lib/utils/fetchTableData";

	// Props
	let { table, appId } = $props();

	$effect(() => {
		fetchTableData(appId, table);
	});

	async function deleteEntry(entryId) {
		try {
			const response = await fetchWithErrorHandling("https://api.openreport.dev/report/delete", {
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
					<Table.Cell>{item.referenceId}</Table.Cell>
					<Table.Cell>{item.type}</Table.Cell>
					<Table.Cell>{item.reason}</Table.Cell>
					<Table.Cell>{item.notes}</Table.Cell>
					<Table.Cell>{item.link}</Table.Cell>
					<Table.Cell>{new Date(item.timestamp).toLocaleString()}</Table.Cell>
					<Table.Cell>{item.reporterIp}</Table.Cell>
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
