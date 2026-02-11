import {request_initializer} from "./bae-connect-helpers.js";
import constants from "./constants.js";

export function create_user(data) {
    let reqInit = request_initializer({
        body: data,
        method: "POST",
    })
    return fetch(constants.URL_USER, reqInit)
        .then(response => response.json())
}

export function change_user(id, data) {
    let reqInit = request_initializer({
        body: data,
        method: "PUT",
    })
    return fetch(constants.URL_USER+`/${id}`, reqInit)
        .then(response => response.json())
}

export function read_user(id) {
    return fetch(constants.URL_USER+`/${id}`, request_initializer())
        .then(response => response.json())
}

export function read_all_users() {
    return fetch(constants.URL_USER, request_initializer())
        .then(response => response.json())
}


export function delete_user(id) {
    return fetch(constants.URL_USER+`/${id}`, request_initializer({method: 'DELETE'}))
        .then(response => response.json())
}