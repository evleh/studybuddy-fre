/**
 * check if we have already have a default 'admin' user, if not create one
 */

import fs from 'node:fs'

const AUTH_ENDPOINT = 'http://localhost:8080/auth/token'
const REGISTER_ENDPOINT = 'http://localhost:8080/users'
const BOXES_ENDPOINT = 'http://localhost:8080/boxes'
const USERNAME = 'admin'
const PASSWORD = 'admin'

async function registerPseudoAdmin() {
    let registerRequest = new Request(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
            username: USERNAME,
            password: PASSWORD,
            email: 'aadddmmiinn@example.com',
            gender: 'sure',
            firstname: 'yes',
            lastname: 'definitively',
            country: 'hopefully'
        })
    })
    return fetch(registerRequest)
        .then((res) => {
            //console.log(res)
            if (res.status === 201) {
                return Promise.resolve("register => 201 = user created.")
            } else {
                return Promise.resolve(`register => ${ res.status } (probably exists)`) // already exists => 403
            }
        })
        .catch(() => Promise.resolve("register reject at fetch level?"))
}

try {
    const registerResultMessage = await registerPseudoAdmin();
    console.log(`trying to create user so it exists for sure. result: ${registerResultMessage}`) // failing is an option
} catch (error) { console.error(error) }

let { promise:authTokenPromise, resolve:bearerTokenResolve, reject:bearerTokenReject } = Promise.withResolvers()

let authRequest = new Request(AUTH_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
})

let accessTokenAndUserId;
try {
    accessTokenAndUserId = await fetch(authRequest)
        .then(res => {
            if (res.status === 403) {
                // seems user not yet registered
                return Promise.reject(res)
            }
            return res.json()
        })
        .then(data => {
            return data
        })
} catch (error) { console.error(error) }
let { accessToken, userId } = accessTokenAndUserId;
console.log(accessTokenAndUserId)
console.log(`token: ${accessToken}; id: ${userId}`)

let dummyBoxes = [];
let {promise:dummyBoxesPromise, resolve:dummyBoxesResolve, reject:dummyBoxesReject} = Promise.withResolvers()
try {
    const path = '../DummyData/boxes.json';
    dummyBoxes = JSON.parse(fs.readFileSync(path, 'utf8'));
    dummyBoxesResolve(dummyBoxes);
} catch (e) { console.log(e); dummyBoxes = []; dummyBoxesReject(dummyBoxes)}


function makeCreateBoxRequest(box) {
    return new Request(BOXES_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        mode: 'cors',
        body: JSON.stringify(box),
    })
}
function makeAllCreateBoxRequests() {
    return dummyBoxes.map((box) => {
        if (typeof box.public === 'string') box.public = (box.public==="1");
        let boxForBackend = {
            title:box.title,
            "public": box.public,
            description:`Beschreibung der Box mit dem Namen '${box.title}'`};
        return makeCreateBoxRequest(boxForBackend)
    })
}
function *createBoxRequests() {
    for (let box of makeAllCreateBoxRequests()) { yield box}
}

for (const boxRequest of createBoxRequests()) {
    console.log(`doing a backend-request for box-creation`)
    try {
        await fetch(boxRequest)
            .then((res) => {
                if (res.status !== 201) {
                    console.log(`create request response !== 201. meep.`)
                }
                return res;
            })
            .catch((error) => {
                console.error(error)
            })

    } catch (e) { console.log(e)}
}

export {dummyBoxes, dummyBoxesPromise}