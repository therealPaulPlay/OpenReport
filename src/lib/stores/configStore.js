import { writable } from "svelte/store";

export const dbConfig = writable({
    host: "",
    port: null,
    user: "",
    password: "",
    database: "",
});