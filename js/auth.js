import constants from './constants.js';
import {SBUser} from "./user.js";

export function getTokenFromBackendEndpoint(username, password) {

    fetch(constants.AUTH_TOKEN_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password}),
    })
        .then(res => res.json())
        .then((json) => {
            console.log(json)
            window.sb.tokenresult = json
            sessionStorage.setItem("accessToken", JSON.stringify(json?.accessToken))
            window.sb.currentUser = new SBUser(json?.userId)
            return window.sb.currentUser.fetchUserData()

        })
        .catch((err) => { console.log(err) })
}

export function loginAndRedirectOnSuccessAssumeLoginFormInDom() {
    console.log("hello world")
    let loginForm = document.getElementById("login-form");
    let loginFormData = new FormData(loginForm);
    console.log(loginFormData.get("username"))
    console.log(loginFormData.get("password"))

    getTokenFromBackendEndpoint(loginFormData.get("username"), loginFormData.get('password'));
    // todo: redirect?
}

if (!window.sb) window.sb = {}
window.sb.getToken = getTokenFromBackendEndpoint;
window.sb.loginAndRedirectOnSuccessAssumeLoginFormInDom = loginAndRedirectOnSuccessAssumeLoginFormInDom;

if (sessionStorage.getItem('accessToken')) {
    // assume accessToken means a user registered and/or logged in.
    window.sb.currentUser = new SBUser();
    await window.sb.currentUser.fetchUserData()
}