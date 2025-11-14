import constants from './constants.js';

// todo: when token+userID exist in sessionStorage:
//  make a request to the backend, GET /user/<ouruserid> basically.
//  with the token in the request header
//  to see if the backend kinda works correctly

// todo: how would one organize this with ECMAScript classes?

/** new code for a promise-approach after doing the dummy boxes; seemed to work well there */
let {promise:selfUserData, resolve:resolveSelfUserData, reject:rejectSelfUserData} = Promise.withResolvers()
export {selfUserData}
if (!window.sb) window.sb = {}
window.sb.selfUserData = selfUserData;

export class SBUser  {
    constructor(id = null) {
        if (id === null) {
            // here self-get by using localstorage?
            this.id = sessionStorage.getItem('userId')
        } else {
            this.id = id
        }
    }


    async fetchUserData() {
        return fetch(constants.URL_USER+"/"+this.id, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify({username, password}),
        })
            .then(res => res.json())
            .then((json) => {
                this._serverResponse = json;
                resolveSelfUserData(json);
                return json;
            })
            .catch((err) => { console.log(err) ; rejectSelfUserData("err"); return err })
    }

    get username() { return this._serverResponse?.username }
    get isAdmin() { return this._serverResponse?.admin }
    get firstname() { return this._serverResponse?.firstname }
    get lastname() { return this._serverResponse?.lastname }

}

export function doDOMInjectsForUserData() {
    let injects = {
        username: window.sb.currentUser?.username || "Anonymous User",
        firstname: window.sb.currentUser?.firstname || "",
        lastname: window.sb.currentUser?.lastname || "",
    }
    $('.insert-username-here').text(injects.username);
    $('.insert-user-first-name-here').text(injects.firstname);
    $('.insert-user-last-name-here').text(injects.lastname);
}