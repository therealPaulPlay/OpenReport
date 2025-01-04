import { readable, writable } from "svelte/store";

export const tableData = writable([]);
export const hasNextPage = writable(false);
export const currentPage = writable(1);
export const itemsPerPage = readable(50);
export const searchQuery = writable("");