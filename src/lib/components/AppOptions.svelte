<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Settings, Trash, AlertCircle } from "lucide-svelte";
	let { app, onDelete } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<span class="icon-wrapper"><Settings size={16} /></span>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>App Settings - {app.name}</Dialog.Title>
			<Dialog.Description>Configure app settings or delete the app.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<p class="text-sm text-gray-500">
				Default thresholds: Warnlist after {app.defaultWarnThreshold} reports, Blacklist after {app.defaultBlacklistThreshold}
				reports.
			</p>
			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="destructive"><Trash size={16} class="mr-2" />Delete App</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title><AlertCircle size={16} class="mr-2" />Confirm App Deletion</Dialog.Title>
						<Dialog.Description>This action is irreversible. Proceed with caution.</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<Button variant="destructive" onclick={onDelete}>Confirm</Button>
						<Button variant="secondary" onclick={() => Dialog.close()}>Cancel</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>