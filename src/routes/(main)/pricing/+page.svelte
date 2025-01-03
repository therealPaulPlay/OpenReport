<script>
	import PurchaseTier from "$lib/components/PurchaseTier.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Mail } from "lucide-svelte";
</script>

<div class="min-h-screen max-w-screen-xl mx-auto p-4">
	<section class="text-center py-16">
		<h1 class="text-4xl font-bold mb-4">Choose Your Plan</h1>
		<p class="text-muted-foreground mb-8">Pick the plan that suits your needs.</p>

		<div class="grid gap-8 md:grid-cols-3">
			<PurchaseTier
				title="Free"
				tier={1}
				price="$0/month"
				features={["2,500 monthly reports per app", "Max. 10 moderators per app"]}
				comingSoon={false}
			/>
			<PurchaseTier
				title="Plus"
				tier={2}
				price="$5/month"
				features={["25,000 monthly reports per app", "Max. 50 moderators per app"]}
				comingSoon={true}
			/>
			<PurchaseTier
				title="Professional"
				tier={3}
				price="$19/month"
				highlight={true}
				features={["100,000 monthly reports per app", "Max. 200 moderators per app"]}
				comingSoon={true}
			/>
		</div>
	</section>

	<section class="py-8 text-center flex justify-center items-center flex-col bg-primary/5 rounded-2xl">
		<h2 class="text-2xl font-bold mb-4">Need More?</h2>
		<p class="text-muted-foreground mb-8 max-w-xl">We'll figure out the best and cheapest solution for you. Just let us know in case we need to upgrade some servers :^)</p>
		<Button href="mailto:paulplaystudio@gmail.com">Contact <Mail /></Button>
	</section>
</div>
