import constants from './constants.js';
import {getTokenFromBackendEndpoint} from './auth.js'

export default function registerForm2registrationJSONSend() {
    /***
        Inspired by: https://codetv.dev/blog/get-form-values-as-json
        Documentation for FormData-Api at: https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
     ***/

    let registerform = document.getElementById("registerform")
    let data = new FormData(registerform)
    let data_as_object = Object.fromEntries(data.entries());

    /***
        goal of the next part: take some but not all field from the formdata (into the json-to-send object.
        possibly also 'rename' fields. this is my try for least-code-duplication / annoyity.

        as docs for this syntax are tricky to find, here a link to mdn, keyword = 'destructuring'
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring

        Note: this works by creating local scope variables named like the fields noted int the "let" statement.
     ***/
    let {name, password, email, gender, firstname, lastname, country} = data_as_object;
    let data_to_send_to_register_endpoint = {username:name, password, email, gender, firstname, lastname, country};

    return fetch(constants.URL_USER, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_to_send_to_register_endpoint),
    })
        .catch((error) => {
            /* tested with: switching off backend; should trigger this message */
            return Promise.reject( { message: "Registrierung gescheitert (no response / fetch failed).", error: error})
        })
        .then(
            (res) => {
                if (res.status === 201) {
                   return res.json()
                } else {
                    /**
                     * note: at the moment we don't get information from the backend, only a 403 without explicit reason
                     * test e.g. with: using an existing username.
                     */
                    return Promise.reject({ message: "Registrierung gescheitert (status).", error: "no 201 from backend", response: res });
                }
            })
        .catch(
            (error) => {
                /* not tested yet */
                return Promise.reject({ message: error.message || "Registrierung gescheitert (201 and no json -> backend confusion?).", error: error})
            }
        )
        .then(
            (json) => {

                // if registering worked => try getting a token & save it in localstorage => pass the promise on
                return getTokenFromBackendEndpoint(name,password)

            })
        .catch(
            (error) => {
                /* not sure how this would be triggered atm. backend error perhaps. */
                return Promise.reject({ message: error.message || "Registrierung gescheitert (AuthToken fetch fail).", error: error})
            })
    ;
}

if (!window.sb) window.sb = {}
window.sb.register = registerForm2registrationJSONSend