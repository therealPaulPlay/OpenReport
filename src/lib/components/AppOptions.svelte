<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Settings2, Trash, Plus, X, Save } from "lucide-svelte";
	import { reportLimit } from "$lib/stores/accountStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { Label } from "$lib/components/ui/label";
	import { toast } from "svelte-sonner";
	let { app, fetchApps, disabled } = $props();

	let warnThreshold = $state(app.warnlist_threshold);
	let blacklistThreshold = $state(app.blacklist_threshold);
	let isValid = $derived(warnThreshold < blacklistThreshold && warnThreshold >= 1 && blacklistThreshold <= 100);
	let moderators = $state([]);
	let newModeratorEmail = $state("");
	let domains = $state("");

	async function loadModerators() {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/moderator/moderators`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: app.app_id,
				}),
			});
			const data = await response.json();
			moderators = data.moderators;
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function addModerator() {
		if (!newModeratorEmail.trim()) return;

		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/moderator/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: app.app_id,
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
			await fetchWithErrorHandling(`${$BASE_API_URL}/moderator/remove`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: app.app_id,
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
			await fetchWithErrorHandling(`${$BASE_API_URL}/app/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: app.app_id,
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
			await fetchWithErrorHandling(`${$BASE_API_URL}/app/update-thresholds`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: app.app_id,
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

	async function updateDomains() {
		try {
			const domainArray = domains
				.split(",")
				.map((d) => d.trim())
				.filter((d) => d);

			await fetchWithErrorHandling(`${$BASE_API_URL}/app/update-domains`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: app.app_id,
					domains: domainArray,
				}),
			});
			toast.success("Domains updated successfully");
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

	let dialogOpen = $state(false);
	$effect(() => {
		if (dialogOpen) loadModerators();
	});
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={disabled ? "pointer-events-none opacity-50" : ""}
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
		<div class="space-y-10">
			<div>
				<Label for="monthlyReports">Monthly report limit</Label>
				<p class="text-sm text-muted-foreground mt-1" id="monthlyReports">
					You have currently used {app.monthly_report_count?.toLocaleString()} of your {$reportLimit.toLocaleString()} monthly
					reports for this app.
				</p>
				<Progress value={Number(app.monthly_report_count)} max={$reportLimit} class="w-[60%] mt-2" />
			</div>
			<div class="space-y-2">
				<div>
					<Label for="domains">Update allowed domains (comma-separated)</Label>
					<div class="flex flex-wrap justify-center items-center gap-2">
						<Input
							id="domains"
							bind:value={domains}
							placeholder="new-website.com, localhost:5173"
							class="mt-2 grow grow-[4] w-fit"
						/>
						<Button variant="outline" onclick={updateDomains} class="mt-2 grow">Update</Button>
					</div>
				</div>
			</div>
			<div class="space-y-2">
				<div>
					<Label for="moderatorInput">Moderators</Label>
					<p class="text-sm text-muted-foreground mt-1">Add moderators by their OpenReport email.</p>
				</div>
				<div class="flex gap-2">
					<Input
						type="email"
						id="moderatorInput"
						placeholder="moderator@email.com"
						bind:value={newModeratorEmail}
						onkeydown={(e) => e.key === "Enter" && addModerator()}
					/>
					<Button onclick={addModerator} variant="outline"><Plus size={16} /></Button>
				</div>
				<ScrollArea class="h-32 w-full rounded-md border">
					<div class="p-2 h-full space-y-2">
						{#if moderators.length > 0}
							{#each moderators as moderator}
								<div class="flex items-center justify-between px-2 pr-0 bg-gray-200 rounded-sm">
									<span class="text-sm">{moderator}</span>
									<Button variant="ghost" size="icon" onclick={() => removeModerator(moderator)}>
										<X size={16} />
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

			<div class="space-y-2">
				<div>
					<Label>Default Report Thresholds</Label>
					<p class="text-sm text-muted-foreground mt-1">
						Current: Warnlist after {app.warnlist_threshold || "UNSET"} reports, Blacklist after {app.blacklist_threshold ||
							"UNSET"} reports
					</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="warnlistInput">Warnlist Threshold</Label>
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
						<Label for="blacklistInput">Blacklist Threshold</Label>
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

				<Button variant="outline" onclick={updateThresholds} disabled={!isValid}><Save />Save thresholds</Button>
			</div>

			<div class="pt-2 border-t">
				<AlertDialog.Root>
					<AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
						<Trash size={16} class="mr-2" />Delete App
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
