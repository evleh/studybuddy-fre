import constants from "./constants.js";
import { initFormValidation } from "./formValidation.js";

$(document).ready(function() {
    initFormValidation();

    // get query-parameters from url
    const params = new URLSearchParams(window.location.search);
    //const boxId = params.get("id");
    const boxId = 1;
    loadBox(boxId);

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
        url: "http://localhost:3000/boxes" + "/" + boxId,
        //url: constants.BOXES_URL + "/" + boxId,
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
    $('#is-public-box').val(data.isPublic);
}

function updateBox(e, boxId){
    e.preventDefault()
    console.log("Update box")

    var title = $("#box-title").val();
    var description = $("#box-description").val();
    var isPublic = $("#is-public-box").is(":checked");

    const post_data = { title: title, description: description, isPublic: isPublic};

    $.ajax({
        //url: constants.BOXES_URL,
        url: "http://localhost:3000/boxes" + "/" + boxId,
        type: "PUT",
        data: JSON.stringify(post_data),
        timeout: 3000,
        headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
        success: function (data){
            console.log("Update erfolgreich: ", data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
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
        }

    })
}

function deleteBox(e, boxId){
    e.preventDefault();

    $.ajax({
        url: "http://localhost:3000/boxes" + "/" + boxId,
        method: 'DELETE',
        timeout: 3000,
        headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
        success: function (data){
            console.log("Löschen erfolgreich: ", data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Löschen nicht erfolgreich");
        }

    })
}
