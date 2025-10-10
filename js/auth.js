import constants from './constants.js';

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
        })
        .catch((err) => { console.log(err) })
}

if (!window.sb) window.sb = {}
window.sb.getToken = getTokenFromBackendEndpoint;