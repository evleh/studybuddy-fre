import constants from "./constants.js";



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
                    } else {
                        createBox(event)
                    }

                    form.classList.add('was-validated')
                }, false)
            })
        })()

        // POST Request
        function createBox(e){
            e.preventDefault();

            var title = $("#box-title").val();
            var description = $("#box-description").val();
            var isPublic = $("#is-public-box").is(":checked");
            var urlRedirect = "../htmls/012-new-card.html";

            const post_data = {title: title, description: description, isPublic:isPublic}
            console.log(post_data)
            $.ajax({
                url: constants.BOXES_URL,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(post_data),
                timeout: 3000, // nach 3 Sekunden abbrechen
                headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
                success: function (data){
                    console.log("Post gespeichert: ", data);
                    window.location.href = urlRedirect + `?id=${data.id}`;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Fehler beim Speichern:", textStatus, errorThrown);

                    const msg = jqXHR.responseJSON?.message || errorThrown || "Unbekannter Fehler";

                    if (window.sb?.appendNotification) {
                        window.sb.appendNotification({
                            title: 'Fehler beim Speichern',
                            type: window.sb.alertTypes.ERROR,
                            message: msg,
                            scrollIntoView: true
                        });
                    } else {
                        alert("Fehler: " + msg); // Fallback
                    }
                }
            })
        }

    }

)

