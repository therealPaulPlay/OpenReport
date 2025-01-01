<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Settings2, Trash, AlertCircle, Eraser, Plus, Minus } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";

	let { appId, table } = $props();

	let days = $state(7);

	let confirmOpen = $state(false);

	function incrementDays() {
		if (days < 365) {
			days = Math.min(365, days + 1);
		}
	}

	function decrementDays() {
		if (days > 1) {
			days = Math.max(1, days - 1);
		}
	}

	function handleDaysInput(event) {
		let value = parseInt(event.target.value);
		if (isNaN(value)) {
			days = 7;
		} else {
			days = Math.max(1, Math.min(365, Math.floor(value)));
		}
	}

	async function deleteOldEntries() {
		try {
			const response = await fetchWithErrorHandling("https://api.openreport.dev/report/clean", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					appId: appId,
					days: days,
					table: table,
				}),
			});

			toast.success(`Successfully deleted entries older than ${days} days.`);
			confirmOpen = false;
		} catch (error) {
			toast.error(error.message);
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Eraser class="mr-2" /> Clean
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Clean up old entries</Dialog.Title>
			<Dialog.Description>Remove old entries from the {table} table.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<div class="flex flex-col space-y-2">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="text-sm font-medium">Delete entries older than:</label>
				<div class="flex items-center space-x-2">
					<Button variant="outline" size="icon" class="h-8 w-8" onclick={decrementDays} disabled={days <= 1}>
						<Minus class="h-4 w-4" />
					</Button>
					<div class="relative w-32">
						<Input
							type="number"
							min="1"
							max="365"
							class="text-center pr-12"
							value={days}
							oninput={handleDaysInput}
							style="appearance: textfield"
						/>
						<span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
							days
						</span>
					</div>
					<Button variant="outline" size="icon" class="h-8 w-8" onclick={incrementDays} disabled={days >= 365}>
						<Plus class="h-4 w-4" />
					</Button>
				</div>
			</div>

			<AlertDialog.Root bind:open={confirmOpen}>
				<AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
						<Trash size={16} class="mr-2" />Delete entries
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you sure?</AlertDialog.Title>
						<AlertDialog.Description>
							Entries older than {days}
							{days === 1 ? "day" : "days"} will be deleted.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action onclick={deleteOldEntries}>Delete</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
