import constants from './constants.js';
import {SBUser} from "./user.js";

export default function getTokenFromBackendEndpoint(username, password) {

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
            window.sbuser = new SBUser()

            console.log(window.sbuser)

        })
        .catch((err) => { console.log(err) })
}

if (!window.sb) window.sb = {}
window.sb.getToken = getTokenFromBackendEndpoint;