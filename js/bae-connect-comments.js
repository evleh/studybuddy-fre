import {request_initializer} from "./bae-connect-helpers.js";
import constants from "./constants.js";

export function create_comment(data) {
    let reqInit = request_initializer({
        body: data,
        method: "POST",
    })
    return fetch(constants.COMMENT_URL, reqInit)
        .then(response => response.json())
}

export function change_comment(id, data) {
    let reqInit = request_initializer({
        body: data,
        method: "PUT",
    })
    return fetch(constants.COMMENT_URL+`/${id}`, reqInit)
        .then(response => response.json())
}

export function read_comment(id) {
    return fetch(constants.COMMENT_URL+`/${id}`, request_initializer())
        .then(response => response.json())
}

export function read_all_comments() {
    return fetch(constants.COMMENT_URL, request_initializer())
        .then(response => response.json())
}


export function delete_comment(id) {
    return fetch(constants.COMMENT_URL+`/${id}`, request_initializer({method: 'DELETE'}))
        .then(response => response.json())
}