import constants from './constants.js';
import getTokenFromBackendEndpoint from './auth.js'

export default function registerForm2registrationJSONSend() {
    /***
        Inspired by: https://codetv.dev/blog/get-form-values-as-json
        Documentation for FormData-Api at: https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
     ***/

    let registerform = document.getElementById("registerform")
    // trying formdata api https://developer.mozilla.org/en-US/docs/Web/API/FormData
    let data = new FormData(registerform)
    console.log(data)
    let data_as_object = Object.fromEntries(data.entries());
    console.log(data_as_object)
    let data_as_json = JSON.stringify(data_as_object);
    console.log(data_as_json)
    console.log("sending the data is TODO still.")
    console.log(constants.URL_USER)

    let data_to_send_to_register_endpoint;

    /***
        goal of the next part: take some but not all field from the formdata (into the json-to-send object.
        possibly also 'rename' fields. this is my try for least-code-duplication / annoyity.

        as docs for this syntax are tricky to find, here a link to mdn, keyword = 'destructuring'
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring

        Note: this works by creating local scope variables named like the fields noted int the "let" statement.
     ***/
    let {name, password, email, gender, firstname, lastname, country} = data_as_object;
    data_to_send_to_register_endpoint = {username:name, password, email, gender, firstname, lastname, country};

    fetch(constants.URL_USER, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_to_send_to_register_endpoint),
    })
        .then(res => res.json())
        .then((json) => {
            console.log(json)
            window.sb.registration_result = json
            // if registering worked -> try logging in = getting a token
            getTokenFromBackendEndpoint(name,password)
        })
    .catch((err) => { console.log(err) })
}

if (!window.sb) window.sb = {}
window.sb.register = registerForm2registrationJSONSend