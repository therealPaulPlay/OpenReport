<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Database, ExternalLink, Lock, LogOut, Settings, Trash } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { toast } from "svelte-sonner";
	import DatabaseConfig from "$lib/components/DatabaseConfig.svelte";
	import { signOut } from "$lib/utils/checkAuthentication";
	import { username } from "$lib/stores/accountStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";

	let confirmPassword = $state("");

	async function deleteAccount() {
		try {
			const userId = localStorage.getItem("id");
			await fetchWithErrorHandling(`${$BASE_API_URL}/account/delete`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: Number(userId),
					password: confirmPassword,
				}),
			});
			toast.success("Account deleted successfully");
			signOut();
			window.location.reload();
		} catch (error) {
			toast.error(error.message);
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class="{buttonVariants({ variant: 'secondary' })} w-full !bg-gray-200 hover:!bg-gray-300">
		<span class="icon-wrapper flex items-center gap-3 w-full"><Settings size={20} /> Settings</span>
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
			<p class="text-sm text-muted-foreground">Account - {$username}</p>
			<div class="flex flex-wrap gap-3 !mt-1">
				<Button variant="outline" onclick={() => goto("/login?reset=true")}
					><Lock size={16} class="mr-2" />Change Password</Button
				>
				<Button
					variant="outline"
					onclick={() => {
						signOut();
						window.location.reload();
					}}><LogOut size={16} class="mr-2" />Log out</Button
				>
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
						<Trash size={16} class="mr-2" />Delete Account
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
				<Button variant="outline" href="/pricing">Subscription <ExternalLink /></Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
