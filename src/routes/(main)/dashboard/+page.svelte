<script>
	import DataTable from "$lib/components/DataTable.svelte";
	import AppOptions from "$lib/components/AppOptions.svelte";
	import SettingsPopup from "$lib/components/SettingsPopup.svelte";
	import AppCreationPopup from "$lib/components/AppCreationPopup.svelte";

	import { Sheet, SheetTrigger, SheetContent } from "$lib/components/ui/sheet";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Ban, Flag, Menu, SidebarClose, TriangleAlert } from "lucide-svelte";
	import CleanPopup from "$lib/components/CleanPopup.svelte";
	import AddEntryPopup from "$lib/components/AddEntryPopup.svelte";
	import { isAuthenticated } from "$lib/stores/accountStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { onMount } from "svelte";
	import { blur, fade } from "svelte/transition";

	// Dashboard state
	let apps = $state([]);

	async function fetchApps() {
		try {
			const response = await fetchWithErrorHandling(
				`https://api.openreport.dev/app/apps/` + Number(localStorage.getItem("id")),
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("bearer")}`,
					},
				},
			);

			apps = await response.json();
		} catch (error) {
			toast.error(error.message);
		}
	}

	// Load data on mount
	onMount(() => {
		fetchApps();
	});

	let activeApp = $state();
	let activeTab = $state("reports");

	let selectedType = $state("reports");

	// Handlers for app creation and deletion
	function onCreateApp({ appName, domains }) {
		const apiKey = crypto.randomUUID();
		apps = [
			...apps,
			{
				id: apiKey,
				name: appName,
				domains: domains.split(","),
				warnThresholds: {},
				blacklistThresholds: {},
			},
		];
	}

	function onTestConnection() {
		return new Promise((resolve) => resolve(true)); // Replace with actual logic
	}

	function deleteApp(id) {
		apps = apps.filter((a) => a.id !== id);
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if !$isAuthenticated}
	<div
		class="flex justify-center flex-col items-center fixed top-0 bottom-0 left-0 right-0 z-[999] bg-[rgba(255,255,255,0.5)] backdrop-blur-md"
	>
		<p class="font-bold text-4xl">You are logged out.</p>
		<p class="text-base text-muted-foreground mt-5">
			<a href="/login" class="underline">Log in</a> to use the dashboard.
		</p>
	</div>
{/if}

{#snippet sidebarContent()}
	<div class="w-full flex justify-start">
		<AppCreationPopup {fetchApps} />
	</div>
	<p class="text-base font-bold text-muted-foreground mt-5">Your Apps</p>
	<div class="space-y-2 mt-2 bg-gray-200 p-2 rounded-lg overflow-hidden overflow-y-auto h-[calc(100%-13.5rem)]">
		{#each apps as app}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="flex justify-between gap-5 overflow-hidden rounded-md bg-gray-100 p-2 max-w-full w-full transition hover:opacity-75"
				transition:blur
				style:background-color={app.app_id == activeApp ? "white" : ""}
				role="button"
				tabindex="0"
				onclick={() => {
					activeApp = app.app_id;
				}}
			>
				<AppOptions {app} {fetchApps} />
				<span class="truncate w-full text-center">{app?.app_name || "Unnamed App"}</span>
			</div>
		{/each}
	</div>
	<div class="mt-5">
		<SettingsPopup />
	</div>
{/snippet}

<div class="flex h-screen w-screen fixed max-h-screen">
	<!-- Sidebar (Desktop) -->
	<div class="hidden lg:block bg-gray-100 w-64 p-4 border-r border-gray-200">
		{@render sidebarContent()}
	</div>

	<!-- Mobile Sidebar (Sheet) -->
	<Sheet>
		<SheetTrigger asChild class="{buttonVariants()} lg:hidden fixed top-20 left-4 z-10">
			<Menu size={24} />
		</SheetTrigger>
		<SheetContent side="left" class="lg:hidden w-64 p-4">
			<div class="max-h-full overflow-auto">
				{@render sidebarContent()}
			</div>
		</SheetContent>
	</Sheet>

	<!-- Main Content -->
	<div class="flex-1 p-6 flex flex-col relative overflow-auto mb-14">
		<!-- App selection notice -->
		{#if activeApp == null}
			<div class="flex items-center justify-center flex-grow text-center text-muted-foreground mb-6">
				<h2 class="text-lg">Please select or create an app.</h2>
			</div>
		{:else}
			<!-- Table view and settings -->
			<div class="mt-10">
				<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
					<!-- Tabs and Toolbar -->
					<div class="flex flex-wrap gap-3">
						<Tabs.List class="w-full flex justify-start max-w-80">
							<Tabs.Trigger value="reports" class="w-full text-center"
								>Reports <Flag class="size-4 ml-1 mt-0.5" /></Tabs.Trigger
							>
							<Tabs.Trigger value="warnlist" class="w-full text-center"
								>Warnlist <TriangleAlert class="size-4 ml-1 mt-0.5" /></Tabs.Trigger
							>
							<Tabs.Trigger value="blacklist" class="w-full text-center"
								>Blacklist <Ban class="size-4 ml-1 mt-0.5" /></Tabs.Trigger
							>
						</Tabs.List>
						<CleanPopup table={activeTab} appId={activeApp} />
						{#if activeTab != "reports"}
							<div transition:fade={{ duration: 150 }}>
								<AddEntryPopup appId={activeApp} table={activeTab} />
							</div>
						{/if}
					</div>
					<div class="mt-5">
						<DataTable table={activeTab} appId={activeApp} />
					</div>
				</Tabs.Root>
			</div>
		{/if}
	</div>
</div>
