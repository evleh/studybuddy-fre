import {request_initializer} from "./bae-connect-helpers.js";
import constants from "./constants.js";

export function create_box(boxdata) {
    let reqInit = request_initializer({
        body: boxdata,
        method: "POST",
    })
    return fetch(constants.BOXES_URL, reqInit)
        .then(response => response.json())
}

export function change_box(boxid, boxdata) {
    let reqInit = request_initializer({
        body: boxdata,
        method: "PUT",
    })
    return fetch(constants.BOXES_URL+`/${boxid}`, reqInit)
        .then(response => response.json())
}

export function read_box(boxid, boxdata) {
    let reqInit = request_initializer({
        method: "GET",
    })
    return fetch(constants.BOXES_URL+`/${boxid}`, reqInit)
        .then(response => response.json())
}