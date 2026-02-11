import {request_initializer} from "./bae-connect-helpers.js";
import constants from "./constants.js";

export function create_card(data) {
    let reqInit = request_initializer({
        body: data,
        method: "POST",
    })
    return fetch(constants.CARD_URL, reqInit)
        .then(response => response.json())
}

export function change_card(id, data) {
    let reqInit = request_initializer({
        body: data,
        method: "PUT",
    })
    return fetch(constants.CARD_URL+`/${id}`, reqInit)
        .then(response => response.json())
}

export function read_card(id) {
    return fetch(constants.CARD_URL+`/${id}`, request_initializer())
        .then(response => response.json())
}

export function read_all_cards() {
    return fetch(constants.CARD_URL, request_initializer())
        .then(response => response.json())
}


export function delete_card(id) {
    return fetch(constants.CARD_URL+`/${id}`, request_initializer({method: 'DELETE'}))
        .then(response => response.json())
}