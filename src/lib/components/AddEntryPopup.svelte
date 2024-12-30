<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Settings2, AlertCircle, Plus, Minus } from "lucide-svelte";
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="secondary">
			<Plus class="mr-2" /> Add
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add entry</Dialog.Title>
			<Dialog.Description>Manually add a whitelist or banlist entry.</Dialog.Description>
		</Dialog.Header>
		<!-- TODO -->

		<Button class="w-full">
			<Plus size={16} class="mr-2" />Create entry
		</Button>
	</Dialog.Content>
</Dialog.Root>
