import constants from './constants.js';

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

    // let data_to_send_to_register_endpoint = data_as_json; // later the default
    let data_to_send_to_register_endpoint = { // backend dev currently only accepts if only username and password
        name: data_as_object.name,
        password: data_as_object.password,
    }

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
            console.log(res)
            window.sb.registration_result = json
        })
    .catch((err) => { console.log(err) })
}

if (!window.sb) window.sb = {}
window.sb.register = registerForm2registrationJSONSend