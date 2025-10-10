import constants from './constants.js';
import {SBUser} from "./user.js";

export function getTokenFromBackendEndpoint(username, password) {

    return fetch(constants.AUTH_TOKEN_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password}),
    })
        .then(res => res.json())
        .then((json) => {
            sessionStorage.setItem("accessToken", json?.accessToken)
            sessionStorage.setItem("userId", json?.userId)
            window.sb.currentUser = new SBUser(json?.userId)
            return window.sb.currentUser.fetchUserData()

        })
        .catch((err) => { console.log(err) })
}

export function loginAndRedirectOnSuccessAssumeLoginFormInDom() {
    let loginForm = document.getElementById("login-form");
    let loginFormData = new FormData(loginForm);

    getTokenFromBackendEndpoint(loginFormData.get("username"), loginFormData.get('password'))
        .then(() => { history.pushState(null, "", "004-home-base.html") });
}

/***
    Side effect code: This section is executed (once) if the file is imported by someone, somewhere

    Current Tasks:
    1) Put the exports in the global scope for convenience
    2) If an accessToken is in sessionStorage, create a currentUser object, and await the result.
       This is suboptimal, but possibly a possible solution to the
       - "other code might want to use (e.g.) the current username"-problem, or the
       - "other code might want to check if the currently logged-in user has admin rights, for UI purposes"-problem.

    Note: I feel both
      - standalone "frameworks" for Single-Page-Applications **and**
      - serving the html by server, changing it slightly/situationally (examples: djangoNotRest, PHP, any kind of Node.js thing?)
        are perfect able deal with this differently, and less complicated, in different ways.

    Alas. Our backend[1] **MUST**[2] not serve any HTML, whatsoever.

    [1] Behaviour defined by lecturer, requirement tested IRL by colleagues (= sibling project-group) at first milestone.
    [2] "Must" defined by RFC 2119 https://datatracker.ietf.org/doc/html/rfc2119

 ***/

if (!window.sb) window.sb = {}
window.sb.getToken = getTokenFromBackendEndpoint;
window.sb.loginAndRedirectOnSuccessAssumeLoginFormInDom = loginAndRedirectOnSuccessAssumeLoginFormInDom;

if (sessionStorage.getItem('accessToken')) {
    // assume accessToken means a user registered and/or logged in.
    console.log('import side-effect code found accessToken, acting on it')
    window.sb.currentUser = new SBUser();
    await window.sb.currentUser.fetchUserData()
}