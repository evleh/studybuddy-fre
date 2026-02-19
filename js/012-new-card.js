import constants from "./constants.js";
import {read_box} from "./bae-connect-boxes.js";
import {create_card, read_card} from "./bae-connect-cards.js";

let boxTitle = "Bezirke Wien"


function boxIdFromParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id")
}

async function readBoxAndQuestionData() {
    // get query-parameters from url
    const boxId = boxIdFromParams();
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

    const newCardForm = document.getElementById('new-card-form');
    newCardForm.addEventListener('submit', async event => {
        // event handler function for pressing new card button
        event.preventDefault()
        event.stopPropagation()

        const formData = new FormData(newCardForm);

        let boxId = boxIdFromParams()
        let cardToCreate = {
            'boxId': boxId,
            'question': formData.get('question'),
            'answer': formData.get('answer')
        };

        // TODO media upload and clearing of form

        await create_card(cardToCreate)

        await readBoxAndQuestionData();

    });

});

function renderFormNewCard(data){
    $('#box-title').empty().append(data.title);
}

function renderCards(cards){
    $("#cards").empty();
    $.each(cards, async function (i, cardPromise) {
        let card = await cardPromise;
        // todo fragen per box filter testen bei erfolgreicher abfrage der aktuellen kartei aus dem backend
        // todo fragen element fertig machen
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

    })

}