<script>
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Trash } from "lucide-svelte";
	let { data, onDelete, currentPage, itemsPerPage } = $props();
</script>

<Table.Root>
	<Table.Caption>Entries show up here.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>ID</Table.Head>
			<Table.Head>Type</Table.Head>
			<Table.Head>Reason</Table.Head>
			<Table.Head>Timestamp</Table.Head>
			<Table.Head>Reporter IP</Table.Head>
			<Table.Head>Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) as item}
			<Table.Row>
				<Table.Cell>{item.id}</Table.Cell>
				<Table.Cell>{item.type}</Table.Cell>
				<Table.Cell>{item.reason}</Table.Cell>
				<Table.Cell>{new Date(item.timestamp).toLocaleString()}</Table.Cell>
				<Table.Cell>{item.reporterIp}</Table.Cell>
				<Table.Cell>
					<Button variant="destructive" size="sm" onclick={() => onDelete(item.id)}>
						<Trash size={16} />
					</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>