<script>
	import ReportForm from "$lib/components/ReportForm.svelte";
</script>

<main class="w-full h-screen flex justify-center items-center p-4">
	<div class="flex justify-center items-center flex-col w-full">
		<ReportForm reportReasons={["Spam", "Cheating", "Scam", "Harassment"]} />
		<p class="opacity-35 mt-3">powered by <a href="https://openreport.dev" target="_blank" class="underline">OpenReport</a></p>
	</div>
</main>
