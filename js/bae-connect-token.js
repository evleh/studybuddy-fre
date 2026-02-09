import {request_initializer_noToken} from "./bae-connect-helpers.js";
import constants from "./constants.js";


export function acquire_token(options={username:'admin', password:'admin'}) {
    let body = {username:options.username, password:options.password};
    return fetch(constants.AUTH_TOKEN_URL, request_initializer_noToken({method:'POST', body:body}))
        .then(response => response.json())
        .then(json => {
            sessionStorage.setItem('accessToken', json.accessToken);
            sessionStorage.setItem('userId', json.userId);
            return json;
        })
}