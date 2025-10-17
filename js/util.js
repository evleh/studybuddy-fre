import {isLoggedIn} from "./auth.js";

export function processElementsTaggedByCSSClasses() {
    if (isLoggedIn()) {
        $('.remove-when-logged-in').remove();
    } else {
        $('.remove-when-logged-out').remove();
    }
}

if (!window.sb) window.sb = {}
window.sb.processElementsTaggedByCSSClasses = processElementsTaggedByCSSClasses;