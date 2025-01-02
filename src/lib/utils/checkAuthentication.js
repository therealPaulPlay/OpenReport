import { isAuthenticated, moderatorLimit, reportLimit, userDatabase, username } from "$lib/stores/accountStore";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { BASE_API_URL } from "$lib/stores/configStore";
import { get } from "svelte/store";

export async function getUser() {
    try {
        const userId = localStorage.getItem("id") || "-1";
        const response = await fetchWithErrorHandling(`${get(BASE_API_URL)}/account/user/` + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("bearer")}`,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error occurred while fetching the user: ", error);
        error = error;
    }
};

// Global function that changes everything to logged in or signed out (all other sign-in functions are related to this)
export async function checkAuthenticationStatus() {
    let bearerToken = localStorage.getItem("bearer");

    if (bearerToken && localStorage.getItem("id") && !isTokenExpired(bearerToken)) {
        // Set store data
        isAuthenticated.set(true);

        // Load basic details
        const data = await getUser();
        if (data) {
            username.set(data.user?.user_name);
            reportLimit.set(data.user?.report_limit);
            moderatorLimit.set(data.user?.moderator_limit);
            userDatabase.set(data.userDatabase);
        }
    } else {
        isAuthenticated.set(false);
    }
}

export function signOut() {
    localStorage.removeItem("id");
    localStorage.removeItem("bearer");
    username.set("Guest");
    isAuthenticated.set(false);
}

function isTokenExpired(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
    );


    // If the token cannot be parsed, it is invalid and will be counted as expired
    try {
        const { exp } = JSON.parse(jsonPayload);
        const expired = Date.now() >= exp * 1000;
        return expired;
    } catch {
        expired = false;
        return expired;
    }
}