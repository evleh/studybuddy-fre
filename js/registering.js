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


    fetch(constants.URL_USER, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data_as_json,
    }).then(() => {})
}

if (!window.sb) window.sb = {}
window.sb.register = registerForm2registrationJSONSend