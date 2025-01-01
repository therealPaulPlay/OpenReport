<script>
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDownIcon, Trash } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";

	// Props
	let { table, appId } = $props();

	// Local state
	let currentPage = $state(1);
	let data = $state([]);
	let itemsPerPage = 50;
	let hasNextPage = $state(false);

	$effect((table, appId) => {
		fetchTableData();
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
			data = data.filter((item) => item.id !== entryId);
		} catch (error) {
			toast.error(error.message || "An error occurred while deleting the entry.");
		}
	}

	let lastAppId;
	let lastTable;

	async function fetchTableData() {
		if (lastAppId != appId || lastTable != table) {
			data = [];
			hasNextPage = false;
			currentPage = 1;
		}

		lastAppId = appId;
		lastTable = table;

		try {
			const response = await fetchWithErrorHandling("https://api.openreport.dev/report/get-table", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: appId,
					table: table,
					page: currentPage,
				}),
			});

			const parsedResponse = await response.json();
			const newData = parsedResponse.data;
			data = [...data, ...newData]; // Append new data to existing data

			// Check if there are more pages
			hasNextPage = newData.length === itemsPerPage;
		} catch (error) {
			toast.error(error.message);
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
		{#if data.length > 0}
			{#each data as item}
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
		{#if hasNextPage}
			<Button
				onclick={() => {
					currentPage += 1;
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
