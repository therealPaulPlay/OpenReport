<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Github } from "lucide-svelte";
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<Github />View on Github
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>OpenReport Repositories</Dialog.Title>
			<Dialog.Description>OpenReport has two core parts: The website and the API.</Dialog.Description>
		</Dialog.Header>
		<Button variant="outline" href="https://github.com/therealPaulPlay/OpenReport" target="_blank"
			>View OpenReport</Button
		>
		<Button variant="outline" href="https://github.com/therealPaulPlay/OpenReportBackend" target="_blank"
			>View OpenReportBackend</Button
		>
	</Dialog.Content>
</Dialog.Root>
