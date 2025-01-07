<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/tabs";
	import { Plus, Minus, Calendar, Save } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { Label } from "./ui/label";
	import { fetchTableData } from "$lib/utils/fetchTableData";

	let { appId, table, entryId } = $props();

	let days = $state(7);
	let activeTab = $state("entry"); // Tracks the active tab
	let confirmOpen = $state(false);

	// Increment/Decrement functionality
	function incrementDays() {
		if (days < 365) {
			days = Math.min(365, days + 1);
		}
	}

	function decrementDays() {
		if (days > 0) {
			days = Math.max(0, days - 1);
		}
	}

	function handleDaysInput(event) {
		let value = parseInt(event.target.value);
		if (isNaN(value)) {
			days = 7;
		} else {
			days = Math.max(0, Math.min(365, Math.floor(value)));
		}
	}

	// Resets state when dialog opens
	function resetState() {
		days = 7;
		activeTab = "entry";
	}

	async function setExpiry() {
		try {
			const endpoint = activeTab === "global" ? "/app/update-expiry" : "/report/edit-expiry";
			const payload =
				activeTab === "global"
					? {
							id: Number(localStorage.getItem("id")),
							appId,
							days: days || null,
						}
					: {
							id: Number(localStorage.getItem("id")),
							appId,
							table,
							entryId,
							newExpiry: days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split(".")[0] : null,
						};

			const response = await fetchWithErrorHandling(`${$BASE_API_URL}${endpoint}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify(payload),
			});

			toast.success(
				activeTab === "global"
					? `Global expiry set to ${days ? `${days} days` : "never"}.`
					: `Expiry date for entry updated successfully${days ? ` to ${days} days from now` : " and reset to never"}.`,
			);
			confirmOpen = false;
			fetchTableData(appId, table, true); // Refresh table
		} catch (error) {
			toast.error(error.message);
		}
	}
</script>

<Dialog.Root onOpenChange={resetState}>
	<Dialog.Trigger asChild>
		<Button variant="outline" size="sm">
			<Calendar size={16} />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Set Expiry</Dialog.Title>
			<Dialog.Description>Choose an expiry duration in days from now or set to never expire.</Dialog.Description>
		</Dialog.Header>

		<!-- Tabs for switching between Entry and Global -->
		<Tabs bind:value={activeTab}>
			<TabsList>
				<TabsTrigger value="entry">Entry Specific</TabsTrigger>
				<TabsTrigger value="global">Global Default</TabsTrigger>
			</TabsList>

			<!-- Entry Specific Tab -->
			<TabsContent value="entry">
				<Label for="expiry-input">Set specific expiry duration:</Label>
				<div class="flex items-center space-x-2 mt-1">
					<Button variant="outline" size="icon" class="h-8 w-8" onclick={decrementDays} disabled={days <= 0}>
						<Minus class="h-4 w-4" />
					</Button>
					<div class="relative w-32">
						<Input
							type="number"
							min="0"
							max="365"
							id="expiry-input"
							class="text-center pr-12"
							value={days}
							oninput={handleDaysInput}
							style="appearance: textfield"
						/>
						<span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
							{days === 0 ? "never" : "days"}
						</span>
					</div>
					<Button variant="outline" size="icon" class="h-8 w-8" onclick={incrementDays} disabled={days >= 365}>
						<Plus class="h-4 w-4" />
					</Button>
				</div>
			</TabsContent>

			<!-- Global Default Tab -->
			<TabsContent value="global">
				<Label for="expiry-input-global">Set default expiry duration:</Label>
				<div class="flex items-center space-x-2 mt-1">
					<Button variant="outline" size="icon" class="h-8 w-8" onclick={decrementDays} disabled={days <= 0}>
						<Minus class="h-4 w-4" />
					</Button>
					<div class="relative w-32">
						<Input
							type="number"
							min="0"
							max="365"
							id="expiry-input-global"
							class="text-center pr-12"
							value={days}
							oninput={handleDaysInput}
							style="appearance: textfield"
						/>
						<span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
							{days === 0 ? "never" : "days"}
						</span>
					</div>
					<Button variant="outline" size="icon" class="h-8 w-8" onclick={incrementDays} disabled={days >= 365}>
						<Plus class="h-4 w-4" />
					</Button>
				</div>
			</TabsContent>
		</Tabs>

		<AlertDialog.Root bind:open={confirmOpen}>
			<AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}><Save />Save Expiry</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you sure?</AlertDialog.Title>
					<AlertDialog.Description>
						{activeTab === "global"
							? `Set the default expiry for the warn- and blocklist to ${days ? `${days} days` : "never"}.`
							: `Set the expiry for the specific entry to ${days ? `${days} days` : "never"}.`}
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action onclick={setExpiry}>Save</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Dialog.Content>
</Dialog.Root>
