import {read_box} from "./bae-connect-boxes.js";
import {change_card, create_card, delete_card, read_card} from "./bae-connect-cards.js";
import {delete_uploaded_file, make_link_from_fileName, upload_file} from "./bae-connect-files.js";
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
    let cards = box.cardIds.map(async (cardId) => {
        let cardRead = await read_card(cardId)
        return cardRead;
    });

    renderCards(cards);
}

function clearSecretStash() {
    delete window[secretStashName];
}

/**
 * entry point after document.ready
 */
$(document).ready(async function() {

    await readBoxAndQuestionData();

    const newCardForm = document.getElementById(domIdOfCardDataForm);
    newCardForm.addEventListener('submit', async event => {
        // event handler function for pressing new card button
        event.preventDefault()
        event.stopPropagation();
        // general handler nice for pressing enter. but this one button should not trigger change
        if (event.submitter?.id === 'cancel-edit-button') {
            return;
        }

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
            let mediaNameToDeleteOrUndefined;

            // if media to clear keep the name in a local var for after-change-deletion
            if ($('#clear-image-checkbox').is(":checked")) {
                mediaNameToDeleteOrUndefined = (await read_card(assumedCardId)).media
                cardToCreate.media = ''; // null does not work for the backend, so complete clear not possible it seems.
            } else {
                // check if there is previous media that needs deletion
                if (cardToCreate.media) { // this being set means: code above uploaded new media and set the property
                    // in that case get the current/previous value - we have not changed the card yet at this point
                    mediaNameToDeleteOrUndefined = (await read_card(assumedCardId)).media
                }
            }

            await change_card(assumedCardId, cardToCreate);

            // only delete old media after change successful.
            if (mediaNameToDeleteOrUndefined) {
                // falsy includes undefined, null, other things, and also the empty string so the if can look like this
                // https://developer.mozilla.org/en-US/docs/Glossary/Falsy
                // empty string important because (reasons) that might be the value indicating "none".
                await delete_uploaded_file(mediaNameToDeleteOrUndefined)
            }

            clearSecretStash();
            setUIToCreate();
        } else {
            await create_card(cardToCreate);
        }
        resetForm()
        await readBoxAndQuestionData();

    });

    cancelEditButton = $(`<button id="cancel-edit-button" class="btn btn-primary">Bearbeiten abbrechen</button>`)
    cancelEditButton.hide()
    $(newCardForm).append(cancelEditButton);
    cancelEditButton.click(event => {
        cancelEditButton.hide();
        setUIToCreate();
        clearSecretStash();
    })
});
let cancelEditButton;

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

function setUIToEdit() {
    setTitleOfMainButton('Frage ändern')
    setTitleOfSubForm("Frage bearbeiten");
    cancelEditButton.show();
}
function setUIToCreate() {
    resetForm()
    setTitleOfMainButton('Frage erstellen')
    setTitleOfSubForm("Neue Frage:");
    clearCardImagePreview();
    cancelEditButton.hide()
}

function clearCardImagePreview() {
    $('#currentImagePreview').empty();
}

function setCardPreviewImage(card) {
    clearCardImagePreview()
    if (card.media) {
        $('#currentImagePreview')
            .append(
                $(`<img src="${make_link_from_fileName(card.media)}" style="max-width: 3em; max-height: 3em;" class="mb-2">`)
            )
            .append(
                $(`<input type="checkbox" name="clear-image-checkbox" id="clear-image-checkbox" class="m-2">Bild entfernen</input>`)
            )
    }
    ;
}


function renderCards(cards){
    $("#cards").empty();
    $.each(cards, async function (i, cardPromise) {
        let card = await cardPromise;
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
            setCardPreviewImage(card);
        })

        $cardElement.append($buttonGroup);
        $("#cards").append($cardElement);

    })

}