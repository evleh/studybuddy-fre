import {read_box} from "./bae-connect-boxes.js";
import {read_card} from "./bae-connect-cards.js";
import {make_link_from_fileName} from "./bae-connect-files.js";

function boxIdFromParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id")
}
let boxId = boxIdFromParams();

function setMainHeading(text) {
    $('#main-h1-element').text(text)
}


function htmlForBasicQuestionDisplayCard(question) {
    const collapseId = `collapseAnswer${question.id}`;
    const imageUrl = make_link_from_fileName(question.media);
    let mediaHtml = "";

    if (question.media && imageUrl) {
        mediaHtml = `<img src="${imageUrl}" class="img-fluid rounded my-2" 
                      style="max-height: 200px; display: block;">`;
    }

    let result = [
        `<div class="card mb-2">`,
        `   <div class="card-header d-flex justify-content-between align-items-center">`,
        `       <span>${question.question}</span>`,
        `       ${mediaHtml}`,
        `       <button class="btn btn-sm btn-outline-secondary" type="button" `,
        `               data-bs-toggle="collapse" data-bs-target="#${collapseId}">`,
        `           Antwort zeigen`,
        `       </button>`,
        `   </div>`,
        `   <div class="collapse" id="${collapseId}">`,
        `       <div class="card-body">`,
        `           <div>${question.answer}</div>`,
        `       </div>`,
        `   </div>`,
        `</div>`
    ].join('')
    return result;
}

async function show_questions(boxId) {
    let box = await read_box(boxId);
    let cardIds = box.cardIds;

    setMainHeading(`Kartei: '${box.title}'`)

    for (let id of cardIds) {
        let card = await read_card(id);
        let cardHtml = htmlForBasicQuestionDisplayCard(card);

        $("#div-for-box-contents").append(cardHtml);
    }

}

$(document).ready(() => {
    show_questions(boxId)
});