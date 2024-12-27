<script>
	// Import custom components
	import DataTable from "$lib/components/DataTable.svelte";
	import AppOptions from "$lib/components/AppOptions.svelte";
	import SettingsPopup from "$lib/components/SettingsPopup.svelte";
	import AppCreationPopup from "$lib/components/AppCreationPopup.svelte";

	// Import ShadCN Sheet
	import { Sheet, SheetTrigger, SheetContent } from "$lib/components/ui/sheet";

	// Import library components
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Menu } from "lucide-svelte";

	// Dashboard state
	let activeApp = $state(null);
	let apps = $state([]);
	let reports = $state([]);
	let warnlist = $state([]);
	let blacklist = $state([]);
	let activeTab = $state("reports");
	let selectedType = $state("reports");
	let dbConfig = $state({
		host: "",
		port: 3306,
		user: "",
		password: "",
		database: "",
	});

	// Handlers for app creation and deletion
	function onCreateApp({ appName, domains, dbConfig }) {
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

<div class="flex h-screen w-screen">
	<!-- Sidebar (Desktop) -->
	<div class="hidden lg:flex flex-col bg-gray-100 w-64 p-4 space-y-4 border-r border-gray-200">
		<div class="space-y-4 flex-grow">
			{#each apps as app}
				<AppOptions {app} onDelete={() => deleteApp(app.id)} />
			{/each}
			<AppCreationPopup {onCreateApp} />
		</div>
	</div>

	<!-- Mobile Sidebar (Sheet) -->
	<Sheet>
		<SheetTrigger asChild>
			<Button class="lg:hidden fixed top-20 left-4 z-10">
				<Menu size={24} />
			</Button>
		</SheetTrigger>
		<SheetContent side="left" class="lg:hidden w-64 p-4">
			<div class="space-y-4 mt-16">
				{#each apps as app}
					<AppOptions {app} onDelete={() => deleteApp(app.id)} />
				{/each}
				<AppCreationPopup {onCreateApp} />
			</div>
		</SheetContent>
	</Sheet>

	<!-- Main Content -->
	<div class="flex-1 p-6 flex flex-col relative overflow-hidden">
		<!-- App selection notice -->
		{#if !activeApp}
			<div class="flex items-center justify-center flex-grow text-center text-gray-500 mb-6">
				<h2 class="text-xl">Please select or create an app first.</h2>
			</div>
		{:else}
			<!-- Table view and settings -->
			<div class="flex justify-between items-center mb-4">
				<SettingsPopup {dbConfig} {onTestConnection} />
			</div>

			<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
				<Tabs.List class="w-full flex justify-between">
					<Tabs.Trigger value="reports" class="w-full text-center">Reports</Tabs.Trigger>
					<Tabs.Trigger value="warnlist" class="w-full text-center">Warnlist</Tabs.Trigger>
					<Tabs.Trigger value="blacklist" class="w-full text-center">Blacklist</Tabs.Trigger>
				</Tabs.List>
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
		{/if}
	</div>
</div>