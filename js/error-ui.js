
// create a div for user directed error messages in the dom

let errorNotificationContainer

/**
 * inspired by / for documentation see: https://getbootstrap.com/docs/5.3/components/alerts/
 */
export function appendNotification({message, type, title,scrollIntoView}) {
    if (!type) type = alertTypes.INFO;
    let optionalTitleHTML = ''
    if (title || title==='') {
        optionalTitleHTML = `<h4 class="alert-heading">${title}</h4>`

    }
    let alertItemHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   ${optionalTitleHTML}`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    $(errorNotificationContainer).append(alertItemHTML)
    if (scrollIntoView) {
        errorNotificationContainer.scrollIntoView();
    }
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

export function queueNotificationForNextLoad(notification) {
    let notificationQueue = JSON.parse(sessionStorage.getItem('notificationQueue'))
    if (notificationQueue) {
        notificationQueue.push(notification)
    } else {
        notificationQueue = [notification]
    }
    sessionStorage.setItem('notificationQueue', JSON.stringify(notificationQueue))
}

$(document).ready(function(){
    errorNotificationContainer = document.createElement("div");
    $(errorNotificationContainer).addClass(['container','mt-3']);
    $(errorNotificationContainer).insertAfter('#insert-navbar-here')

    //appendNotification({message:'hello', title: 'title', type: alertTypes.SUCCESS})

    // if the notification queue for next-load-notifications exists in session storage, show them

    let notificationQueue = JSON.parse(sessionStorage.getItem('notificationQueue'))
    while( notificationQueue && notificationQueue.length > 0) {
        let notificationQueued = notificationQueue.shift()
        appendNotification(notificationQueued)
        sessionStorage.setItem('notificationQueue', JSON.stringify(notificationQueue)) // remove the notification shown from sessionstorage
    }

})

if (!window.sb) window.sb = {}
window.sb.queueNotificationForNextLoad = queueNotificationForNextLoad;
window.sb.appendNotification = appendNotification;
window.sb.alertTypes = alertTypes;