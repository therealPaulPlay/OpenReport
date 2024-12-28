<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Settings2, Trash, AlertCircle } from "lucide-svelte";

	let { app } = $props();
	let warnThreshold = $state(app.defaultWarnThreshold);
	let blacklistThreshold = $state(app.defaultBlacklistThreshold);
	let isValid = $derived(warnThreshold < blacklistThreshold && warnThreshold >= 1 && blacklistThreshold <= 100);

	async function deleteApp() {
		console.log("Deleting app...");
	}

	function updateThresholds() {
		if (!isValid) return;

		console.log("Updating thresholds:", {
			appId: app.id,
			warnThreshold,
			blacklistThreshold,
		});
	}

	function handleWarnThresholdInput(event) {
		const value = parseInt(event.target.value);
		if (!isNaN(value)) {
			warnThreshold = Math.max(1, Math.min(99, Math.floor(value)));
		}
	}

	function handleBlacklistThresholdInput(event) {
		const value = parseInt(event.target.value);
		if (!isNaN(value)) {
			blacklistThreshold = Math.max(2, Math.min(100, Math.floor(value)));
		}
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
		<div class="space-y-6">
			<div class="space-y-4">
				<div>
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="text-sm font-medium">Default Report Thresholds</label>
					<p class="text-sm text-gray-500 mt-1">
						Current: Warnlist after {app.warnThreshold || "UNSET"} reports, Blacklist after {app.blacklistThreshold || "UNSET"} reports
					</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="text-sm text-gray-500">Warnlist Threshold</label>
						<Input
							type="number"
							min="1"
							max="99"
							value={warnThreshold}
							oninput={handleWarnThresholdInput}
							class={!isValid && warnThreshold >= blacklistThreshold ? "border-red-500" : ""}
						/>
					</div>

					<div class="space-y-2">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="text-sm text-gray-500">Blacklist Threshold</label>
						<Input
							type="number"
							min="2"
							max="100"
							value={blacklistThreshold}
							oninput={handleBlacklistThresholdInput}
							class={!isValid && warnThreshold >= blacklistThreshold ? "border-red-500" : ""}
						/>
					</div>
				</div>

				{#if !isValid}
					<p class="text-sm text-gray-500">Warnlist threshold must be lower than blacklist threshold.</p>
				{/if}

				<Button variant="outline" onclick={updateThresholds} disabled={!isValid}>Save</Button>
			</div>

			<div class="pt-2 border-t">
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button variant="destructive">
							<Trash size={16} class="mr-2" />Delete App
						</Button>
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
		</div>
	</Dialog.Content>
</Dialog.Root>
