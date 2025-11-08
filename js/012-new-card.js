import constants from "./constants.js";

let boxTitle = "Bezirke Wien"
$(document).ready(function() {

    // get query-parameters from url
    const params = new URLSearchParams(window.location.search);
    const boxId = params.get("id")
    console.log(boxId)

    // Get info from current box
    $.ajax({
        method: "GET",
        url: constants.BOXES_URL + "/" + boxId,
        dataType: "json",
        headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
        success:function (data){
            console.log(data);
            boxTitle = data.title;
            renderFormNewCard(data);
        },
        error: function (){ // Todo: ordentlich machen wenn request nicht durchgeht
            console.log("error")
        }
    })

    // Show existing Questions
    $.ajax({
        method: "GET",
        url: "../DummyData/questions.json",
        dataType: "json",
        success: function (data) {
            console.log(data);
            renderCards(data);
        }
    })



});

function renderFormNewCard(data){
    $('#box-title').append(data.title);
}

function renderCards(data){
    $.each(data, function(i, card){
        // todo fragen per box filter testen bei erfolgreicher abfrage der aktuellen kartei aus dem backend
        // todo fragen element fertig machen
        if(card.box === boxTitle){
            const $cardElement = $("<div>").addClass("list-group-item list-group-item-action d-flex justify-content-between align-items-center");

            const $title = $("<span>").text("Frage: " + card.question);

            const $editBtn = $("<button>").text("Bearbeiten").addClass("btn btn-sm btn-outline-primary")
            const $deleteBtn = $("<button>").text("Löschen").addClass("btn btn-sm btn-outline-primary")
            const $buttonGroup = $("<div>")
                .addClass("d-flex gap-2")
                .append($editBtn)
                .append($deleteBtn);

            $cardElement.append($title).append($buttonGroup);
            $("#cards").append($cardElement);
        }


    })

}