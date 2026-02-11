import constants from "./constants.js";
import {read_box} from "./bae-connect-boxes.js";
import {read_card} from "./bae-connect-cards.js";

let boxTitle = "Bezirke Wien"

async function readBoxAndQuestionData() {
    // get query-parameters from url
    const params = new URLSearchParams(window.location.search);
    const boxId = params.get("id")
    console.log(boxId)

    let box = await read_box(boxId)
        .then((box) => {
            boxTitle = box.title
            renderFormNewCard(box)
            return Promise.resolve(box); // to be able to wait at the read_box level.
        })
        .catch(() => {
            // Todo: ordentlich machen wenn request nicht durchgeht
            console.log("error")
            return Promise.resolve("aaaaaaaaaaaa"); // to be able to wait at the read_box level.
        })

    // does this work?
    console.log(box);
    console.log(box.cardIds)
    let cards = box.cardIds.map(async (cardId) => {
        let cardRead = await read_card(cardId)
        return cardRead;
    });

    renderCards(cards);
}

$(document).ready(async function() {

    await readBoxAndQuestionData();
    // todo: register handler on button "neue frage erstellen" und make that work

});

function renderFormNewCard(data){
    $('#box-title').append(data.title);
}

function renderCards(cards){
    $.each(cards, function(i, card){
        // todo fragen per box filter testen bei erfolgreicher abfrage der aktuellen kartei aus dem backend
        // todo fragen element fertig machen
        //if(card.box === boxTitle){
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
        //}


    })

}