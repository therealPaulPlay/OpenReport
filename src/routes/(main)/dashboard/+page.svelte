<script>
	import DataTable from "$lib/components/DataTable.svelte";
	import AppOptions from "$lib/components/AppOptions.svelte";
	import SettingsPopup from "$lib/components/SettingsPopup.svelte";
	import AppCreationPopup from "$lib/components/AppCreationPopup.svelte";

	import { Sheet, SheetTrigger, SheetContent } from "$lib/components/ui/sheet";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Ban, Flag, Menu, SidebarClose, TriangleAlert } from "lucide-svelte";
	import CleanPopup from "$lib/components/CleanPopup.svelte";

	// Dashboard state
	let apps = $state([
		{ name: "TestApp", id: 0 },
		{ name: "TestApp2", id: 1 },
	]);
	let activeApp = $state();
	let activeTab = $state("reports");

	// Loaded Data
	let reports = $state([]);
	let warnlist = $state([]);
	let blacklist = $state([]);

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

{#snippet sidebarContent()}
	<div class="w-full flex justify-start">
		<AppCreationPopup />
	</div>
	<p class="text-base font-bold text-gray-500 mt-5">Your Apps</p>
	<div class="space-y-2 mt-2 bg-gray-200 p-2 rounded-lg overflow-hidden overflow-y-auto h-[calc(100%-13.5rem)]">
		{#each apps as app}
			<button
				class="flex justify-between gap-5 overflow-hidden rounded-md bg-gray-100 p-2 max-w-full w-full transition hover:opacity-75"
				style:background-color={app.id == activeApp ? "white" : ""}
				onclick={() => {
					activeApp = app.id;
				}}
			>
				<AppOptions {app} />
				<span class="truncate w-full text-center">{app?.name || "Unnamed App"}</span>
			</button>
		{/each}
	</div>
	<div class="mt-5">
		<SettingsPopup />
	</div>
{/snippet}

<div class="flex h-screen w-screen fixed">
	<!-- Sidebar (Desktop) -->
	<div class="hidden lg:block bg-gray-100 w-64 p-4 border-r border-gray-200">
		{@render sidebarContent()}
	</div>

	<!-- Mobile Sidebar (Sheet) -->
	<Sheet>
		<SheetTrigger asChild>
			<Button class="lg:hidden fixed top-20 left-4 z-10">
				<Menu size={24} />
			</Button>
		</SheetTrigger>
		<SheetContent side="left" class="lg:hidden w-64 p-4">
			<div class="max-h-full overflow-auto">
				{@render sidebarContent()}
			</div>
		</SheetContent>
	</Sheet>

	<!-- Main Content -->
	<div class="flex-1 p-6 flex flex-col relative overflow-hidden">
		<!-- App selection notice -->
		{#if activeApp == null}
			<div class="flex items-center justify-center flex-grow text-center text-gray-500 mb-6">
				<h2 class="text-xl">Please select or create an app first.</h2>
			</div>
		{:else}
			<!-- Table view and settings -->
			<div class="mt-8">
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
						<CleanPopup />
					</div>
					<Tabs.Content value="reports">
						<DataTable data={reports} />
					</Tabs.Content>
					<Tabs.Content value="warnlist">
						<DataTable data={warnlist} />
					</Tabs.Content>
					<Tabs.Content value="blacklist">
						<DataTable data={blacklist} />
					</Tabs.Content>
				</Tabs.Root>
			</div>
		{/if}
	</div>
</div>
