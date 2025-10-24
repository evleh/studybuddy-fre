import constants from './constants.js';
import {SBUser} from "./user.js";
import {appendNotification, alertTypes} from "./error-ui.js";

export function getTokenFromBackendEndpoint(username, password) {

    return fetch(constants.AUTH_TOKEN_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password}),
    })
        .catch((error) => {
            /*  */
            return Promise.reject( { message: "Verbindung zu Backend fehlgeschlagen.", error: error})
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                return Promise.reject({message: 'Bitte überprüfen Sie ob Sie den richtigen Username und das richtige Passwort eingegeben haben.'})
            }
        })
        .then((json) => {
            sessionStorage.setItem("accessToken", json?.accessToken)
            sessionStorage.setItem("userId", json?.userId)
            window.sb.currentUser = new SBUser(json?.userId)
            return window.sb.currentUser.fetchUserData()
        })

}

export function loginAndRedirectOnSuccess() {
    /**
     * This function tries to get username and password from a login-form in the dom.
     * With this data it requests a token from the backend.
     * That request, on success, redirects to the (currently hardcoded) login page.
     *
     * Note/Warning: No error handling yet.
     */
    let loginForm = document.getElementById("login-form");
    let loginFormData = new FormData(loginForm);

    getTokenFromBackendEndpoint(loginFormData.get("username"), loginFormData.get('password'))
        .then(() => {
            history.pushState(null, "", "004-home-base.html");
            history.forward(); history.go()
        })
    .catch((err) => {
        appendNotification({
            message: err.message,
            title: 'Anmeldung fehlgeschlagen.',
            type: alertTypes.WARNING
        })
    });
}

export function logout() {
    // current function: clear session token and id, then redirect to most login-ish page
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userId");
    history.pushState(null, "", "001-start.html");
    history.forward(); history.go()
}

export function isLoggedIn() {
    return !!sessionStorage.getItem("accessToken");
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
      - serving the html by server, changing it slightly/situationally
        (examples: djangoNotRest, PHP, any kind of Node.js thing?)
        are perfect able deal with this differently, and less complicated, in different ways.

    Alas. Our backend[1] **MUST**[2] not serve any HTML, whatsoever.

    [1] Behaviour defined by lecturer, requirement tested IRL by colleagues (= sibling project-group) at first milestone.
    [2] "Must" defined by RFC 2119 https://datatracker.ietf.org/doc/html/rfc2119

 ***/

console.log(`[dev] executing side effect code in auth.js`)

if (!window.sb) window.sb = {}
window.sb.getToken = getTokenFromBackendEndpoint;
window.sb.loginAndRedirectOnSuccess = loginAndRedirectOnSuccess;
window.sb.logout = logout;
window.sb.isLoggedIn = isLoggedIn;

if (sessionStorage.getItem('accessToken')) {
    // assume accessToken means a user registered and/or logged in.
    console.log(`[dev] import side-effect code found accessToken, acting on it`)

    window.sb.currentUser = new SBUser();
    await window.sb.currentUser.fetchUserData()

    console.log(`[dev] user name according to backend: '${window.sb.currentUser.username}'`)

    if (window.sb.currentUser.isAdmin) console.log(`[dev] user tagged as ADMIN according to backend response`)
    else console.log(`[dev] user NOT tagged as admin according to backend response`)

} else {
    console.log(`[dev] import side-effect code found "no-ish" accessToken. TODO: what now?`)
}