import constants from "./constants.js";
import { initFormValidation } from "./formValidation.js";
import {change_box, delete_box} from "./bae-connect-boxes.js";

$(document).ready(function() {
    initFormValidation();

    // get query-parameters from url
    const params = new URLSearchParams(window.location.search);
    const boxId = params.get("id");
    loadBox(boxId);
    console.log(boxId)

    $('#edit-box').on("submit", function(e) {
        e.preventDefault();
        const clickedButton = document.activeElement.id;

        if(clickedButton === 'update-box'){ updateBox(e, boxId); }
        if(clickedButton === 'delete-box'){ deleteBox(e, boxId); }
        if(clickedButton === 'view-cards') { window.location.href = `../htmls/012-new-card.html?id=${boxId}`}

    });


});

/**
 * Loads box from backend and calls render function
 * @param boxId
 */
function loadBox(boxId){
    console.log("load box");
    $.ajax({
        method: "GET",
        url: constants.BOXES_URL + "/" + boxId,
        dataType: "json",
        headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
        success:function (data){
            console.log("successfully loaded data on edit site");
            renderBox(data);
        },
        error: function (){
            console.log("error during loading data on edit site")
        }
    })
}

function renderBox(data){
    $('#box-title').val(data.title);
    $('#box-description').val(data.description);
    $('#is-public-box').prop('checked', data.public);
}

function updateBox(e, boxId){
    e.preventDefault()
    console.log("Update box")

    var title = $("#box-title").val();
    var description = $("#box-description").val();
    var isPublic = $("#is-public-box").is(":checked");

    const post_data = { title: title, description: description, public: isPublic};

    change_box(boxId, post_data)
        .then((data) => {
            console.log("Update erfolgreich: ", data);
            if (window.sb?.appendNotification) {
                window.sb.appendNotification({
                    title: 'Update erfolgreich',
                    type: window.sb.alertTypes.SUCCESS,
                    message: `Kartei ${data.title} gespeichert.`,
                    scrollIntoView: true
                });
            }
        })
        .catch((jqXHR, textStatus, errorThrown) => { // todo: these likely query params, not jsonres params?
                    console.error("Fehler beim Update:", textStatus, errorThrown);

                    const msg = jqXHR.responseJSON?.message || errorThrown || "Unbekannter Fehler";

                    if (window.sb?.appendNotification) {
                        window.sb.appendNotification({
                            title: 'Fehler beim Update',
                            type: window.sb.alertTypes.ERROR,
                            message: msg,
                            scrollIntoView: true
                        });
                    } else {
                        alert("Fehler: " + msg); // Fallback
                    }
                })
    ;

}

function deleteBox(e, boxId){
    e.preventDefault();
    delete_box(boxId)
        .then((data) => {
            console.log("Löschen erfolgreich: ", data);
            // TODO: redirect? notification?
            if (window.sb?.appendNotification) {
                window.sb.appendNotification({
                    title: 'Löschen erfolgreich',
                    type: window.sb.alertTypes.WARNING,
                    message: `Kartei ${data.title} wurde gelöscht.`,
                    scrollIntoView: true
                });
            }
        })
        .catch(() => {
            console.log("Löschen nicht erfolgreich");
        })
    ;
}
