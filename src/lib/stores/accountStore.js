import { writable } from "svelte/store";

export const isAuthenticated = writable(false);
export const userDatabase = writable(null);
export const username = writable("Guest");
export const reportLimit = writable(1);
export const moderatorLimit = writable(1);
export const subscriptionTier = writable(0);