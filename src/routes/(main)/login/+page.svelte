<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
	import { toast } from "svelte-sonner";
	import { page } from "$app/stores";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";

	let currentView = $state("login");
	let loading = $state(false);

	// Form data
	let email = $state("");
	let password = $state("");
	let fullName = $state("");

	// Reset any form data when switching views
	function resetForm() {
		email = "";
		password = "";
		fullName = "";
		loading = false;
	}

	// Check if we're on the set new password page via URL token
	$effect(() => {
		if ($page.url.searchParams.get("token")) currentView = "set-new-password";
		if ($page.url.searchParams.get("reset")) currentView = "reset";
		if ($page.url.searchParams.get("signup")) currentView = "signup";
	});

	async function handleSubmit(event) {
		event.preventDefault();
		if (loading) return;
		loading = true;

		try {
			switch (currentView) {
				case "login": {
					await fetchWithErrorHandling("/api/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
					toast.success("Successfully logged in!");
					break;
				}

				case "signup": {
					await fetchWithErrorHandling("/api/signup", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password, fullName }),
					});
					toast.success("Account created successfully!");
					currentView = "login";
					break;
				}

				case "reset": {
					await fetchWithErrorHandling("/api/reset-password", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email }),
					});
					toast.success("Reset instructions sent to your email!");
					currentView = "login";
					break;
				}

				case "set-new-password": {
					const token = $page.url.searchParams.get("token");
					await fetchWithErrorHandling("/api/set-new-password", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ password, token }),
					});
					toast.success("Password updated successfully!");
					currentView = "login";
					break;
				}
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			loading = false;
		}
	}
</script>

<!-- Rest of the template remains unchanged -->
<div class="min-h-screen flex items-center justify-center p-4">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>
				{#if currentView === "login"}
					Log in
				{:else if currentView === "signup"}
					Create an account
				{:else if currentView === "reset"}
					Reset password
				{:else}
					Set new password
				{/if}
			</CardTitle>
		</CardHeader>

		<form onsubmit={handleSubmit}>
			<CardContent class="space-y-4 min-w-80">
				{#if currentView === "signup"}
					<div class="space-y-2">
						<Label for="fullName">Full Name</Label>
						<Input type="text" id="fullName" bind:value={fullName} required disabled={loading} />
					</div>
				{/if}

				{#if currentView !== "set-new-password"}
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input type="email" id="email" bind:value={email} required disabled={loading} />
					</div>
				{/if}

				{#if currentView === "login" || currentView === "signup" || currentView === "set-new-password"}
					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input type="password" id="password" bind:value={password} required disabled={loading} minlength="8" />
					</div>
				{/if}
			</CardContent>

			<CardFooter class="flex flex-col space-y-4">
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						Please wait...
					{:else if currentView === "login"}
						Log in
					{:else if currentView === "signup"}
						Sign up
					{:else if currentView === "reset"}
						Send reset link
					{:else}
						Update password
					{/if}
				</Button>

				{#if currentView === "login"}
					<div class="flex flex-col items-center gap-2 text-sm">
						<button
							type="button"
							class="text-muted-foreground hover:text-primary"
							onclick={() => {
								resetForm();
								currentView = "reset";
							}}
						>
							Forgot password?
						</button>
						<button
							type="button"
							class="text-muted-foreground hover:text-primary"
							onclick={() => {
								resetForm();
								currentView = "signup";
							}}
						>
							Don't have an account?
						</button>
					</div>
				{:else if currentView !== "set-new-password"}
					<button
						type="button"
						class="text-sm text-muted-foreground hover:text-primary"
						onclick={() => {
							resetForm();
							currentView = "login";
						}}
					>
						Back to login
					</button>
				{/if}
			</CardFooter>
		</form>
	</Card>
</div>
