import {request_initializer} from "./bae-connect-helpers.js";
import constants from "./constants.js";


export function get_me_ownboxes() {
    return fetch(constants.ME_BOXES_URL, request_initializer())
        .then(response => response.json())
}

export function get_me_userinfo() {
    return fetch(constants.ME_USERINFO_URL, request_initializer())
        .then(response => response.json())
}