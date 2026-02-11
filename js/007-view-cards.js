import {read_public_boxes} from "./bae-connect-public.js";

function setMainHeading(text) {
    $('#main-h1-element').text(text)
}

function htmlForBasicBoxDisplayCard(box, options = {}) {
    let result = [
        `<div class="card mb-2">`,
        `   <div class="card-header">${box.title}</div>`,
        `   <div class="card-body">`,
        `       <div>${box.description}</div>`,
        `   </div>`,
        `</div>`
    ].join('')
    return result;
}

function show_boxes() {

    setMainHeading('Öffentliche Lernkarteien')

    read_public_boxes()
        .then((boxes) => {
            for (let box of boxes) {
                $("#div-for-box-links").append(htmlForBasicBoxDisplayCard(box, {withLink: true}))
            }
        });
}

$(document).ready(() => {
    show_boxes()
});