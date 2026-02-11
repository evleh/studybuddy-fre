import {request_initializer} from "./bae-connect-helpers.js";
import constants from "./constants.js";


export function read_public_boxes() {
    return fetch(constants.PUBLIC_BOXES_URL, request_initializer())
        .then(response => response.json())
}

