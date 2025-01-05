<script>
	import { Button } from "$lib/components/ui/button/index.js";
	import ReportForm from "$lib/components/ReportForm.svelte";
	import {
		ArrowRight,
		Database,
		Shield,
		BarChart3,
		Code2,
		Settings2,
		Blocks,
		FolderMinusIcon,
		LayoutDashboard,
	} from "lucide-svelte";
	import GithubReposView from "$lib/components/GithubReposView.svelte";
	import { isAuthenticated } from "$lib/stores/accountStore";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import Footer from "$lib/components/Footer.svelte";

	let showSuccessDialog = $state(false);

	onMount(() => {
		if ($page.url.searchParams.get("success") === "true") {
			showSuccessDialog = true;
		}
	});
</script>

<svelte:head>
	<title>OpenReport - Free user report forms</title>
</svelte:head>

<!-- Keywords -->
<h1 style:display={"none"}>
	Submit user reports with report forms. Integrate into game websites for free to enable users or players the reporting
	of others for cheating, spamming, bots or harassment. Handle account bans easily with this open source moderation tool
	that works with a self hosted database.
</h1>

<div class="min-h-screen">
	<!-- Hero Section -->
	<div class="max-w-screen-xl mx-auto p-4">
		<section class="w-full flex flex-col lg:flex-row gap-8 items-center justify-center min-h-[60vh]">
			<!-- Text Container -->
			<div class="w-full lg:w-1/2 flex items-center justify-center p-4">
				<div class="flex flex-col max-w-xl">
					<p class="uppercase ml-1 text-md font-bold tracking-wide">Free & Selfhost-ready</p>
					<h1 class="text-4xl md:text-6xl font-bold mt-2">
						Stop bad actors with <span class="text-violet-800 dark:text-violet-500">report forms</span>.
					</h1>
					<p class="mt-6 text-lg text-muted-foreground">
						Open-code reporting system for web games, chat applications, and online communities. Self-host, customize,
						and maintain control of your data.
					</p>
					<div class="mt-10 ml-1 flex gap-4">
						{#if !$isAuthenticated}
							<Button href="/login?signup=true">
								Get started <ArrowRight class="w-4 h-4" />
							</Button>
						{:else}
							<Button href="/dashboard">
								Open Dashboard <ArrowRight class="w-4 h-4" />
							</Button>
						{/if}
						<GithubReposView />
					</div>
				</div>
			</div>

			<!-- Form Container with 3D Effect -->
			<div class="w-full lg:w-1/2 flex items-center justify-center lg:justify-end p-4">
				<div
					class="w-full max-w-md transform perspective-1000"
					style="transform: perspective(1000px) rotateX(2deg) rotateY(-5deg);"
				>
					<div class="relative">
						<!-- Shadow overlay -->
						<div class="absolute -bottom-4 left-2 right-2 h-full bg-black/1 dark:bg-black blur-xl rounded-2xl -z-10"></div>
						<!-- Form -->
						<div class="relative bg-background rounded-xl shadow-2xl">
							<ReportForm allowNotes={true} demo={true} />
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section class="py-20">
			<div class="text-center mb-16">
				<h2 class="text-3xl font-bold mb-4">Everything you need to manage reports</h2>
				<p class="text-muted-foreground max-w-2xl mx-auto">
					Simple integration, powerful features, complete control over your data.
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each [{ icon: Database, title: "Your Database", description: "Bring your own database and keep full control over your data." }, { icon: Shield, title: "Secure By Design", description: "Built with security best practices. Your data stays on your db." }, { icon: LayoutDashboard, title: "Advanced Dashboard", description: "Manage reports with a beautiful dashboard. Invite mods for collaboration." }, { icon: Code2, title: "Easy Integration", description: "Simple API and form site. Integrate in minutes, not days." }, { icon: Settings2, title: "Customizable", description: "Custom fields, automated warnings and bans, and more." }, { icon: Blocks, title: "Multiple Apps", description: "Manage reports from multiple applications in one central dashboard." }] as feature}
					<div class="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
						<feature.icon class="w-12 h-12 mb-4 text-primary" />
						<h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
						<p class="text-muted-foreground">{feature.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- CTA Section -->
		<section class="py-10">
			<div class="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-8 md:p-12 text-center">
				<h2 class="text-3xl font-bold mb-4">Ready to get started?</h2>
				<p class="text-muted-foreground max-w-2xl mx-auto mb-8">
					Experience how effortless integrating a report sytem can be.
				</p>
				<div class="flex flex-wrap gap-4 justify-center">
					<Button href="/login?signup=true">Get Started for Free</Button>
					<GithubReposView />
				</div>
			</div>
		</section>
	</div>

	<!-- Footer -->
	<Footer />
</div>

<!-- Purchase success popup -->
<Dialog.Root bind:open={showSuccessDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Thank You for Subscribing!</Dialog.Title>
			<Dialog.Description>
				Your subscription has been successfully activated. You can now access all the features of your new plan.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				onclick={() => {
					showSuccessDialog = false;
					goto("/dashboard");
				}}>Open Dashboard</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
