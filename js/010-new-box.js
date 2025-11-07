import constants from "./constants.js";

// insert dynamic variables to HTML
// Warten, bis die Seite vollständig geladen ist und die Daten verfügbar sind
function setUsernameWhenAvailable() {
    const checkInterval = setInterval(() => {
        if (window.sb && window.sb.currentUser && window.sb.currentUser.username) {
            document.querySelector(".username").textContent =
                "erstellt von " + window.sb.currentUser.username;
            clearInterval(checkInterval);
        }
        // else {
        //     document.querySelector(".username").textContent =
        //         "erstellt von cant' acess username";
        // }
    }, 200);
}
setUsernameWhenAvailable();

$(document).ready(function (){
        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (() => {
            'use strict'

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll('.needs-validation')

            // Loop over them and prevent submission
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }


                    form.classList.add('was-validated')
                }, false)
            })
        })()

        // <!-- todo: kartei anlegen und auf "012-new-card.html" weiterleiten -->
        $("#create-box").submit(function (e){
            e.preventDefault();

            var title = $("#box-title").val();
            var description = $("#box-description").val();
            var is_public = $("#is-public-box").val();
            var url = $(this).attr("action");

            $.ajax(constants.BOXES_URL, {
                type: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_to_send_to_register_endpoint),

                //title: title, description: description, public: public}).done(function (data){

            }).done(function(data){
                console.log("post saved");
                console.log(data);
                window.location.href = "012-new-card.html";  // URL der Zielseite
            }).fail(function (jqXHR, textStatus, errorThrown) {
                // Fehlerbehandlung, falls die Anfrage fehlschlägt
                console.log("Fehler beim Speichern der Daten: ", textStatus, errorThrown);
            });
        })

    }

)

