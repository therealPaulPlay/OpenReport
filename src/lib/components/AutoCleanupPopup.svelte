<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Settings2, Power, PowerOff, Plus, Minus } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import Label from "./ui/label/label.svelte";
	import { onMount } from "svelte";

	let { appId, isOwner } = $props();
	let days = $state(90);
	let isEnabled = $state(false);
	let confirmOpen = $state(false);

	async function fetchCurrentConfig() {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/app/get-auto-cleanup`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					appId: appId,
				}),
			});

			const data = await response.json();

			if (data.days !== null) {
				days = data.days;
				isEnabled = true;
			} else {
				isEnabled = false;
			}
		} catch (error) {
			toast.error("Failed to fetch auto-cleanup configuration");
		}
	}

	function incrementDays() {
		if (days < 365) days = Math.min(365, days + 1);
	}

	function decrementDays() {
		if (days > 30) days = Math.max(30, days - 1);
	}

	function handleDaysInput(event) {
		let value = parseInt(event.target.value);
		if (isNaN(value)) {
			days = 30;
		} else {
			days = Math.max(30, Math.min(365, Math.floor(value)));
		}
	}

	async function enableAutoCleanup() {
		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/app/enable-auto-cleanup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					appId: appId,
					days: days,
				}),
			});

			toast.success("Auto-cleanup enabled successfully");
			isEnabled = true;
			confirmOpen = false;
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function disableAutoCleanup() {
		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/app/disable-auto-cleanup`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					appId: appId,
				}),
			});

			toast.success("Auto-cleanup disabled successfully");
			isEnabled = false;
			confirmOpen = false;
		} catch (error) {
			toast.error(error.message);
		}
	}

	// Fetch current config when component mounts
	onMount(() => {
		if (isOwner) fetchCurrentConfig();
	});
</script>

<Dialog.Root>
	<Dialog.Trigger class="{buttonVariants({ variant: 'outline' })} max-w-32">
		{#if isOwner}
			<Settings2 size={16} />Configure
		{:else}
			No permission
		{/if}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Configure Auto-Cleanup</Dialog.Title>
			<Dialog.Description>Set up automatic deletion of old reports.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<div class="flex flex-col space-y-2">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<Label for="autoDeletionInput">Automatically delete reports older than:</Label>
				<div class="flex items-center space-x-2 {isEnabled ? 'pointer-events-none opacity-50' : ''}">
					<Button variant="outline" size="icon" class="h-8 w-8" onclick={decrementDays} disabled={days <= 30}>
						<Minus class="h-4 w-4" />
					</Button>
					<div class="relative w-32">
						<Input
							type="number"
							min="30"
							max="365"
							id="autoDeletionInput"
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
				{#if isEnabled}
					<AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
						<PowerOff size={16} class="mr-2" />Disable Auto-Cleanup
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you sure?</AlertDialog.Title>
							<AlertDialog.Description>This will disable automatic cleanup of old reports.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action onclick={disableAutoCleanup}>Disable</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				{:else}
					<AlertDialog.Trigger class={buttonVariants({ variant: "default" })}>
						<Power size={16} class="mr-2" />Enable Auto-Cleanup
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Enable Auto Cleanup</AlertDialog.Title>
							<AlertDialog.Description>
								Reports older than {days}
								{days === 1 ? "day" : "days"} will be automatically deleted.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action onclick={enableAutoCleanup}>Enable</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				{/if}
			</AlertDialog.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
