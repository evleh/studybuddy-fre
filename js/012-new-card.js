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
    $.each(data, function(i, question){
        // todo fragen per box filter testen bei erfolgreicher abfrage der aktuellen kartei aus dem backend
        // todo fragen element fertig machen
        if(question.box === boxTitle){
            const $questionElement = $("<div>").text("Frage: " + question.question).addClass("list-group-item list-group-item-action");
            $("#cards").append($questionElement);
        }


    })

}