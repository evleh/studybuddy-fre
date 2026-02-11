import {read_public_boxes} from "./bae-connect-public.js";
import {read_box} from "./bae-connect-boxes.js";

function setMainHeading(text) {
    $('#main-h1-element').text(text)
}

function htmlForBasicQuestionDisplayCard(question) {
    let result = [
        `<div class="card mb-2">`,
        `   <div class="card-header">${question.question}</div>`,
        `   <div class="card-body">`,
        `       <div>${question.answer}</div>`,
        `   </div>`,
        `</div>`
    ].join('')
    return result;
}

async function show_questions(boxId) {

    let box = await read_box(boxId);
    let questionIds = box.questionIds;
    console.log(questionIds)

    setMainHeading(`Fragen für Kartei '${box.title}'`)

    // was:
    // $("#div-for-box-links").append(htmlForBasicBoxDisplayCard(box, {withLink: true}))
}

$(document).ready(() => {
    show_questions(6)
});