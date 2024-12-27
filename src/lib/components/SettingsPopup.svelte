<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Database, Lock, Settings, Trash } from "lucide-svelte";
	let { dbConfig, onTestConnection } = $props();
	let confirmPassword = $state("");

	async function testConnection() {
		const success = await onTestConnection();
		if (success) {
			// Add feedback logic for a successful test
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<span class="icon-wrapper"><Settings size={16} /></span>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
			<Dialog.Description>Update your account and database configurations.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4">
			<Button variant="outline" onclick={() => goto("/reset-password")}
				><Lock size={16} class="mr-2" />Change Password</Button
			>
			<div>
				<Label>Database Configuration</Label>
				<div class="space-y-2">
					<Input bind:value={dbConfig.host} placeholder="Host" />
					<Input type="number" bind:value={dbConfig.port} placeholder="Port" />
					<Input bind:value={dbConfig.user} placeholder="User" />
					<Input type="password" bind:value={dbConfig.password} placeholder="Password" />
					<Input bind:value={dbConfig.database} placeholder="Database" />
				</div>
				<Button onclick={testConnection}>Test & Save</Button>
			</div>
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
								if (confirmPassword) onDelete();
							}}
							disabled={!confirmPassword}>Delete Account</Button
						>
						<Button variant="secondary" onclick={() => Dialog.close()}>Cancel</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>