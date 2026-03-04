

$(document).ready(function() {
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
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    // stop event or be submitted/posted to the frontend (directly) without delay.
                    event.preventDefault()
                    event.stopPropagation()

                    console.log(`[dev] if you a reading this, then register-form validation must have passed. commence the registering!`)
                    window.sb.register()
                        .then(
                            (success) => {
                                // your redirect code here.
                                console.log(`[dev] registration & authToken fetch allegedly successful. so ..`)
                                console.log(`[dev] .. redirecting. To see this message, toggle "Preserve logs" in the console.`)
                                window.sb.queueNotificationForNextLoad({
                                    type: window.sb.alertTypes.SUCCESS,
                                    title: 'Registrierung erfolgreich abgeschlossen',
                                    message: 'Herzlich willkommen, und viel Spaß in StudyBuddy!'
                                })
                                history.pushState(null, "", "004-home-base.html") // TODO: do a post-register welcome screen?
                                history.forward(); history.go()
                            })
                        .catch((error) => {
                            window.sb.appendNotification({
                                title: 'Registrierung nicht erfolgreich',
                                type: window.sb.alertTypes.ERROR,
                                message: error.message,
                                scrollIntoView: true
                            })
                        })
                }

                form.classList.add('was-validated')
            }, false)
        })
    })()

});

