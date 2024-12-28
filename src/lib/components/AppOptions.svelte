<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Settings2, Trash, AlertCircle } from "lucide-svelte";
	let { app } = $props();

	async function deleteApp() {
		console.log("Deleting app...");
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		onclick={(e) => {
			e.stopPropagation();
		}}
	>
		<Settings2 size={18} class="hover:scale-110 transition" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Configure "{app.name || "Default name (Error)"}"</Dialog.Title>
			<Dialog.Description>Configure app settings or delete the app.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<p class="text-sm text-gray-500">
				Default thresholds: Warnlist after {app.defaultWarnThreshold} reports, Blacklist after {app.defaultBlacklistThreshold}
				reports.
			</p>
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button variant="destructive"><Trash size={16} class="mr-2" />Delete App</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Delete {app.name || "Default name (Error)"}?</AlertDialog.Title>
						<AlertDialog.Description>
							This action cannot be undone. This will permanently remove all related tables from the database.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action onclick={deleteApp}>Delete</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
