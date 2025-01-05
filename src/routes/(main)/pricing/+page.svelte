<script>
	import PurchaseTier from "$lib/components/PurchaseTier.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Mail, UserRoundCog } from "lucide-svelte";
	import { STRIPE_PUBLIC_KEY, BASE_API_URL } from "$lib/stores/configStore";
	import { onMount } from "svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";
	import { subscriptionTier, isAuthenticated } from "$lib/stores/accountStore";
	import { goto } from "$app/navigation";
	import Footer from "$lib/components/Footer.svelte";

	let stripe;
	let loadingTier = null;

	// Lookup keys for each subscription tier
	const TIER_LOOKUP_KEYS = {
		1: "openreport_standard_monthly_plus",
		2: "openreport_standard_monthly_professional",
	};

	function loadStripe() {
		return new Promise((resolve) => {
			if (window.Stripe) {
				resolve(window.Stripe($STRIPE_PUBLIC_KEY));
			} else {
				document.querySelector("#stripe-js").addEventListener("load", () => {
					resolve(window.Stripe($STRIPE_PUBLIC_KEY));
				});
			}
		});
	}

	onMount(async () => {
		stripe = await loadStripe();
	});

	async function handleSubscribe(tier) {
		if (!$isAuthenticated) {
			goto("/login");
			return;
		}

		if (tier === 0) return; // Free tier, no action needed

		try {
			loadingTier = tier;
			const lookupKey = TIER_LOOKUP_KEYS[tier];

			if (!lookupKey) {
				throw new Error("Invalid subscription tier");
			}

			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/subscription/create-checkout-session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
					lookup_key: lookupKey,
				}),
			});

			const data = await response.json();

			if (data?.url) {
				window.location.href = data.url;
			} else {
				throw new Error("Invalid checkout session response");
			}
		} catch (error) {
			toast.error(error.message || "Failed to start checkout process");
		} finally {
			loadingTier = null;
		}
	}

	async function handleManageSubscription() {
		if (!$isAuthenticated) {
			goto("/login");
			return;
		}

		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/subscription/create-portal-session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: Number(localStorage.getItem("id")),
				}),
			});

			const data = await response.json();

			if (data?.url) {
				window.location.href = data.url;
			} else {
				throw new Error("Invalid portal session response");
			}
		} catch (error) {
			toast.error(error.message || "Failed to open subscription management");
		}
	}
</script>

<svelte:head>
	<title>Pricing</title>
	<script id="stripe-js" src="https://js.stripe.com/v3/" async></script>
</svelte:head>

<div class="min-h-screen max-w-screen-xl mx-auto p-4">
	<section class="text-center py-16">
		<h1 class="text-4xl font-bold mb-4">Choose Your Plan</h1>
		<p class="text-muted-foreground mb-8">Pick the plan that suits your needs.</p>
		<div class="grid gap-8 md:grid-cols-3">
			<PurchaseTier
				title="Free"
				tier={0}
				price="$0/month"
				onclick={handleManageSubscription}
				features={["2,500 monthly reports per app", "Max. 10 moderators per app"]}
			/>
			<PurchaseTier
				title="Plus"
				tier={1}
				price="$5/month"
				onclick={() => handleSubscribe(1)}
				features={["25,000 monthly reports per app", "Max. 50 moderators per app"]}
			/>
			<PurchaseTier
				title="Professional"
				tier={2}
				price="$19/month"
				onclick={() => handleSubscribe(2)}
				highlight={true}
				features={["100,000 monthly reports per app", "Max. 200 moderators per app"]}
			/>
		</div>
		<div class="mt-8">
			<Button variant="outline" onclick={handleManageSubscription}>Manage Subscription <UserRoundCog /></Button>
		</div>
	</section>

	<section class="py-8 text-center flex justify-center items-center flex-col bg-neutral-100 dark:bg-neutral-900 rounded-2xl">
		<h2 class="text-2xl font-bold mb-4">Need More?</h2>
		<p class="text-muted-foreground mb-8 max-w-xl">
			We'll figure out the best and cheapest solution for you. Just let us know in case we need to upgrade some servers
			:^)
		</p>
		<Button href="mailto:paulplaystudio@gmail.com">Contact <Mail /></Button>
	</section>
</div>
