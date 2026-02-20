import {read_box} from "./bae-connect-boxes.js";
import {change_card, create_card, delete_card, read_card} from "./bae-connect-cards.js";
import {make_link_from_fileName, upload_file} from "./bae-connect-files.js";
import {alertTypes, appendNotification} from "./error-ui.js";

const domIdOfCardDataForm = 'new-card-form';
const domIdOfMainButton = 'new-card-button';
const secretStashName = 'stateStashCardEditId'

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

    const newCardForm = document.getElementById(domIdOfCardDataForm);
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
        let imageField = formData.get('imageInput');
        if (imageField.name !== '') {
            cardToCreate.media = await upload_file({
                filename: imageField.name,
                fileOrBlob: imageField
            }).catch(() => appendNotification({
                message:'Upload fehlgeschlagen',
                type: alertTypes.ERROR
            }));
            // clear after upload
            const fileInput = document.getElementById("imageInput");
            fileInput.value = '';
        }

        // if secret-stash exists do an update clear stash and UI state
        if (window[secretStashName]) {
            // secret stash should contain the card-id
            let assumedCardId = window[secretStashName]
            console.log(`secretStash found: ${assumedCardId}`)
            await change_card(assumedCardId, cardToCreate);
            delete window[secretStashName];
            setUIToCreate();
        } else {
            await create_card(cardToCreate)
        }
        resetForm()
        await readBoxAndQuestionData();

    });

});

function renderFormNewCard(data){
    $('#box-title').empty().append(data.title);
}


function resetForm() {
    document.getElementById(domIdOfCardDataForm).reset();
}
function setTitleOfSubForm(title) {
    document.getElementById('card-data-form-h3-tag').innerText = title;
}
function setTitleOfMainButton(title) {
    document.getElementById(domIdOfMainButton).innerText = title;
}
function setTitleToEdit() {
    setTitleOfSubForm("Frage bearbeiten");
}
function setTitleToCreate() {
    setTitleOfSubForm("Neue Frage:");
}
function setButtonToEdit() {
    setTitleOfMainButton('Frage ändern')
}
function setButtonToCreate() {
    setTitleOfMainButton('Frage erstellen')
}
function setUIToEdit() {
    setButtonToEdit();
    setTitleToEdit();
}
function setUIToCreate() {
    setButtonToCreate();
    setTitleToCreate();
}

function renderCards(cards){
    $("#cards").empty();
    $.each(cards, async function (i, cardPromise) {
        let card = await cardPromise;
        console.log(card);
        // todo fragen per box filter testen bei erfolgreicher abfrage der aktuellen kartei aus dem backend
        // todo fragen element fertig machen
        const $cardElement = $("<div>").addClass("list-group-item list-group-item-action d-flex justify-content-between align-items-center");

        const $title = $(`<span title="${card.answer}">`).text("Frage: " + card.question);
        $cardElement.append($title);

        if (card.media) {
            const $image = $(`<img src="${make_link_from_fileName(card.media)}" style="max-width: 3em; max-height: 3em;" class="mb-2">`);
            $cardElement.append($image);
        }


        const $editBtn = $("<button>").text("Bearbeiten").addClass("btn btn-sm btn-outline-primary")
        const $deleteBtn = $("<button>").text("Löschen").addClass("btn btn-sm btn-outline-primary")
        const $buttonGroup = $("<div>")
            .addClass("d-flex gap-2")
            .append($editBtn)
            .append($deleteBtn);

        $deleteBtn.click(async event => {
            await delete_card(card.id)
            await readBoxAndQuestionData();
        });
        $editBtn.click(async event => {
            window[secretStashName] = card.id;
            resetForm(); // clear the image if set
            setUIToEdit();
            document.getElementById('question').value = card.question;
            document.getElementById('answer').value = card.answer;
            $('#currentImagePreview').empty();
            if (card.media) {
                $('#currentImagePreview')
                    .append(
                        $(`<img src="${make_link_from_fileName(card.media)}" style="max-width: 3em; max-height: 3em;" class="mb-2">`)
                    )
            };
        })

        $cardElement.append($buttonGroup);
        $("#cards").append($cardElement);

    })

}