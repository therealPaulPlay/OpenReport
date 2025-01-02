import { TURNSTILE_SITE_KEY } from "$lib/stores/configStore";
import { get } from "svelte/store";

export function renderCaptcha(elementId, callback) {
    try {
        turnstile.render(elementId, {
            sitekey: get(TURNSTILE_SITE_KEY),
            callback: callback,
        });
    } catch (error) {
        console.error("Error occured trying to render captcha with Turnstile:", error);
    }
}