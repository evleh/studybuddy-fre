import constants from './constants.js';

// todo: when token+userID exist in sessionStorage:
//  make a request to the backend, GET /user/<ouruserid> basically.
//  with the token in the request header
//  to see if the backend kinda works correctly

// todo: how would one organize this with ECMAScript classes?


export class SBUser  {
    constructor(id = null) {
        if (id === null) {
            // here self-get by using localstorage?
            this.id = sessionStorage.getItem('currentUserID')
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
                console.log(json)
            })
            .catch((err) => { console.log(err) })
    }

}