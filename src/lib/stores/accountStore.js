import { writable } from "svelte/store";

export const isAuthenticated = writable(false);
export const username = writable("Guest");
export const reportLimit = writable(10000);