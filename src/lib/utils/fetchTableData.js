import { tableData, hasNextPage, currentPage, itemsPerPage } from "$lib/stores/tableStore";
import { get } from "svelte/store";
import { toast } from "svelte-sonner";
import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
import { BASE_API_URL } from "$lib/stores/configStore";

let lastAppId;
let lastTable;
let lastCurrentPage;

export async function fetchTableData(appId, table, refresh) {
    if (lastAppId != appId || lastTable != table || get(currentPage) == lastCurrentPage || refresh) {
        tableData.set([]);
        hasNextPage.set(false);
        currentPage.set(1);
    }

    lastAppId = appId;
    lastTable = table;
    lastCurrentPage = get(currentPage);

    try {
        const response = await fetchWithErrorHandling(`${get(BASE_API_URL)}/report/get-table`, {
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