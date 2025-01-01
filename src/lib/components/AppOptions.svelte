<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Settings2, Trash, Plus, X } from "lucide-svelte";
	import { reportLimit } from "$lib/stores/accountStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";

	let { app, fetchApps } = $props();

	let warnThreshold = $state(app.warnlist_threshold);
	let blacklistThreshold = $state(app.blacklist_threshold);
	let isValid = $derived(warnThreshold < blacklistThreshold && warnThreshold >= 1 && blacklistThreshold <= 100);
	let moderators = $state([]);
	let newModeratorEmail = $state("");

	async function loadModerators() {
		try {
			const response = await fetchWithErrorHandling(`https://api.openreport.dev/moderator/moderators`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appName: app.app_name,
				}),
			});
			const data = await response.json();
			moderators = data;
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function addModerator() {
		if (!newModeratorEmail.trim()) return;

		try {
			await fetchWithErrorHandling(`https://api.openreport.dev/moderator/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appName: app.app_name,
					email: newModeratorEmail.trim(),
				}),
			});
			toast.success("Moderator added successfully");
			newModeratorEmail = "";
			await loadModerators();
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function removeModerator(email) {
		try {
			await fetchWithErrorHandling(`https://api.openreport.dev/moderator/remove`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appName: app.app_name,
					email,
				}),
			});
			toast.success("Moderator removed successfully");
			await loadModerators();
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function deleteApp() {
		try {
			await fetchWithErrorHandling(`https://api.openreport.dev/app/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appName: app.app_name,
				}),
			});
			toast.success("App deleted successfully");
			fetchApps();
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function updateThresholds() {
		if (!isValid) return;

		try {
			await fetchWithErrorHandling(`https://api.openreport.dev/app/update-thresholds`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appName: app.app_name,
					warnlistThreshold: warnThreshold,
					blacklistThreshold: blacklistThreshold,
				}),
			});
			toast.success("Thresholds updated successfully");
			fetchApps?.();
		} catch (error) {
			toast.error(error.message);
		}
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

	$effect(() => {
		loadModerators();
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		onclick={(e) => {
			e.stopPropagation();
		}}
	>
		<Settings2 size={18} class="hover:scale-110 transition" />
	</Dialog.Trigger>
	<Dialog.Content class="overflow-auto max-h-[75vh]">
		<Dialog.Header>
			<Dialog.Title>Configure "{app.app_name || "Default name (Error)"}"</Dialog.Title>
			<Dialog.Description>Configure app settings or delete the app.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-5">
			<div>
				<label for="monthlyReports" class="text-sm font-medium">Monthly report limit</label>
				<p class="text-sm text-muted-foreground mt-1" id="monthlyReports">
					You have currently used {app.monthly_report_count?.toLocaleString()} of your {$reportLimit.toLocaleString()} monthly
					reports for this app.
				</p>
				<Progress value={Number(app.monthly_report_count)} max={$reportLimit} class="w-[60%] mt-2" />
			</div>

			<div class="space-y-4">
				<div>
					<label for="moderatorInput" class="text-sm font-medium">Moderators</label>
					<p class="text-sm text-muted-foreground mt-1">Add moderators by their OpenReport email.</p>
				</div>
				<div class="flex gap-2">
					<Input
						type="email"
						id="moderatorInput"
						placeholder="Email"
						bind:value={newModeratorEmail}
						onkeydown={(e) => e.key === "Enter" && addModerator()}
					/>
					<Button onclick={addModerator} variant="outline"><Plus size={16} /></Button>
				</div>
				<ScrollArea class="h-32 w-full rounded-md border">
					<div class="p-4 h-full">
						{#if moderators.length > 0}
							{#each moderators as moderator}
								<div class="flex items-center justify-between py-2">
									<span class="text-sm">{moderator}</span>
									<Button variant="ghost" size="icon" onclick={() => removeModerator(moderator)}>
										<X size={16} class="text-red-500" />
									</Button>
								</div>
							{/each}
						{:else}
							<div class="flex w-full h-full items-center justify-center">
								<p class="text-sm text-muted-foreground">No moderators yet.</p>
							</div>
						{/if}
					</div>
				</ScrollArea>
			</div>

			<div class="space-y-4">
				<div>
					<label for="currentText" class="text-sm font-medium">Default Report Thresholds</label>
					<p class="text-sm text-muted-foreground mt-1">
						Current: Warnlist after {app.warnlist_threshold || "UNSET"} reports, Blacklist after {app.blacklist_threshold ||
							"UNSET"} reports
					</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label for="warnlistInput" class="text-sm text-muted-foreground">Warnlist Threshold</label>
						<Input
							type="number"
							id="warnlistInput"
							placeholder={app.warnlist_threshold}
							min="1"
							max="99"
							value={warnThreshold}
							oninput={handleWarnThresholdInput}
							class={!isValid && warnThreshold >= blacklistThreshold ? "border-red-500" : ""}
						/>
					</div>

					<div class="space-y-2">
						<label for="blacklistInput" class="text-sm text-muted-foreground">Blacklist Threshold</label>
						<Input
							type="number"
							id="blacklistInput"
							placeholder={app.blacklist_threshold}
							min="2"
							max="100"
							value={blacklistThreshold}
							oninput={handleBlacklistThresholdInput}
							class={!isValid && warnThreshold >= blacklistThreshold ? "border-red-500" : ""}
						/>
					</div>
				</div>

				{#if !isValid}
					<p class="text-sm text-muted-foreground">Warnlist threshold must be lower than blacklist threshold.</p>
				{/if}

				<Button variant="outline" onclick={updateThresholds} disabled={!isValid}>Save thresholds</Button>
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
							<AlertDialog.Title>Delete {app.app_name || "Default name (Error)"}?</AlertDialog.Title>
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
