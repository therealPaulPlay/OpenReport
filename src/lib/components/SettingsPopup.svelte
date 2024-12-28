<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Database, Lock, Settings, Trash } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import DatabaseConfig from "$lib/components/DatabaseConfig.svelte";

	let confirmPassword = $state("");

	async function testConnection() {
		if (success) {
			// Add feedback logic for a successful test
		}
	}

	async function deleteAccount() {
		console.log("Account deleted...");
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		<Button variant="outline" class="w-full bg-gray-200 rounded-md">
			<span class="icon-wrapper flex items-center gap-3 w-full"><Settings size={20} /> Settings</span>
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
			<Dialog.Description>Update your global configuration.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<p class="text-sm text-muted-foreground">Database</p>
			<div class="!mt-1">
				<DatabaseConfig />
			</div>
			<p class="text-sm text-muted-foreground">Account</p>
			<div class="flex flex-wrap gap-3 !mt-1">
				<Button variant="outline" onclick={() => goto("/login?reset=true")}
					><Lock size={16} class="mr-2" />Change Password</Button
				>
				<Dialog.Root>
					<Dialog.Trigger>
						<Button variant="destructive"><Trash size={16} class="mr-2" />Delete Account</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Confirm Account Deletion</Dialog.Title>
							<Dialog.Description>Enter your password to confirm account deletion.</Dialog.Description>
						</Dialog.Header>
						<Input type="password" placeholder="Password" bind:value={confirmPassword} />
						<Dialog.Footer>
							<Button
								variant="destructive"
								onclick={() => {
									if (confirmPassword) deleteAccount();
								}}
								disabled={!confirmPassword}>Delete Account</Button
							>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
