import {make_link_from_fileName, upload_file} from "./bae-connect-files.js";
import {change_user, read_user} from "./bae-connect-users.js";
import {alertTypes, appendNotification} from "./error-ui.js";

$(document).ready(function () {

    const user = loadUserData()
    // special initialization code here if needed
    user.then((userData) => {
            $('#username').append(userData?.username);
            $('#inputDivers')[0].value = userData?.gender;
            $('#firstname')[0].value = userData?.firstname;
            $('#lastname')[0].value = userData?.lastname;
            $('#email')[0].value = userData?.email;
            $('#landDataList')[0].value = userData?.country;

            const previewImg = document.getElementById("currentFoto");
            previewImg.setAttribute('src', make_link_from_fileName(userData.foto));
        })
        .catch((error) => {
            console.log(error);
        });
});

// copy paste edit from register
$(document).ready(function () {
    // initialization code here
    $('.insert-country-list-options-here-plz').load('elements/countrylist1.html');

    // example code from https://getbootstrap.com/docs/5.3/forms/validation/
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', async event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    // stop event or be submitted/posted to the frontend (directly) without delay.
                    event.preventDefault()
                    event.stopPropagation()

                    // todo: doing stuff

                    let changeUserRequest = {};

                    // if there is a file: upload the file, clear the form field, take note of the return value
                    let formData = new FormData(form)
                    let fotoField = formData.get('foto');

                    // no file chosen manifests as filename === "" afaict.
                    if (fotoField.name !== "") {
                        changeUserRequest.foto = await upload_file({
                            filename: fotoField.name,
                            fileOrBlob: fotoField
                        }).catch(() => appendNotification({
                            message:'Upload fehlgeschlagen',
                            type: alertTypes.ERROR
                        }));
                        // the jquery examples did not work here. code from
                        // https://www.javaspring.net/blog/clearing-an-html-file-upload-field-via-javascript/#solutions-to-clear-a-file-upload-field
                        // did.
                        const fileInput = document.getElementById("foto");
                        fileInput.value = '';

                    }

                    // send an update request with the right values and foto string set to return value of upload
                    for (let i of ['firstname', 'lastname', 'country', 'email']) {
                        changeUserRequest[i] = formData.get(i)
                    }
                    if (formData.get('gender') !== 'inputDivers') {
                        changeUserRequest.gender = formData.get('gender');
                    } else {
                        changeUserRequest.gender = formData.get('inputDivers')
                    }
                    const user = await loadUserData()
                    let userId = user.id
                    await change_user(userId, changeUserRequest)
                        .then((res) => {
                            appendNotification({message:'Änderung erfolgreich'});
                        })
                        .catch(() => appendNotification({
                            message:'Änderung nicht erfolgreich',
                            type: alertTypes.ERROR
                        }));

                    const previewImg = document.getElementById("currentFoto");
                    previewImg.setAttribute('src', make_link_from_fileName(changeUserRequest.foto));

                }

                form.classList.add('was-validated')
            }, false)
        })
    })()

});

async function loadUserData() {
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get("id");

    // Admin viewing / editing user profile
    if (userIdFromUrl) {
        return await read_user(userIdFromUrl)
    }

    // View own profile
    return window.sb.selfUserData;
}