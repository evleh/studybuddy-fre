/**
 * Module containing helper Functions
 */


export function initFormValidation(){
    // check input
    (() => {
        'use strict'
        const forms = document.querySelectorAll('.needs-validation');

        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()){
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)

        })
    })()
}