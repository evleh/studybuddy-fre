
// create a div for user directed error messages in the dom

let errorNotificationContainer

/**
 * inspired by / for documentation see: https://getbootstrap.com/docs/5.3/components/alerts/
 */
export function appendNotification({message, type, title}) {
    if (!type) type = alertTypes.INFO;
    let optionalTitleHTML = ''
    if (title || title==='') {
        optionalTitleHTML = `<h4 class="alert-heading">${title}</h4>`

    }
    let alertItemHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   ${optionalTitleHTML}`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    $(errorNotificationContainer).append(alertItemHTML)
}

export const alertTypes = {
    DANGER: 'danger',
    INFO: 'info',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    ERROR: 'danger',
    WARNING: 'warning',
    LIGHT: 'light',
    DARK: 'dark'
}

$(document).ready(function(){
    errorNotificationContainer = document.createElement("div");
    $(errorNotificationContainer).addClass(['container','mt-3']);
    $(errorNotificationContainer).insertAfter('#insert-navbar-here')

    //appendNotification({message:'hello', title: 'title', type: alertTypes.SUCCESS})
})
