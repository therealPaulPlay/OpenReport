import { tableData, hasNextPage, currentPage, itemsPerPage } from "$lib/stores/tableStore";
import { get } from "svelte/store";
import { toast } from "svelte-sonner";
import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";

let lastAppId;
let lastTable;

export async function fetchTableData(appId, table, refresh) {
    if (lastAppId != appId || lastTable != table || refresh) {
        tableData.set([]);
        hasNextPage.set(false);
        currentPage.set(1);
    }

    lastAppId = appId;
    lastTable = table;

    try {
        const response = await fetchWithErrorHandling("https://api.openreport.dev/report/get-table", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("bearer")}`,
            },
            body: JSON.stringify({
                id: Number(localStorage.getItem("id")),
                appId: Number(appId),
                table: table,
                page: get(currentPage),
            }),
        });

        const parsedResponse = await response.json();
        const newData = parsedResponse.data;
        tableData.set([...get(tableData), ...newData]); // Append new data to existing data

        // Check if there are more pages
        hasNextPage.set(newData.length === get(itemsPerPage));
    } catch (error) {
        toast.error(error.message);
    }
}