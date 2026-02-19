import {read_all_boxes} from "./bae-connect-boxes.js";
import {read_user} from "./bae-connect-users.js";
import {read_card} from "./bae-connect-cards.js";

$(document).ready(function() {
    setupInitialUI();
    registerEventHandlers();
    loadBoxes();
});

/* Functions to load data from backend */
async function loadBoxes(){
    try {
        const boxes = await read_all_boxes();
        await renderBoxes(boxes);
    } catch (error) {
        $("#admin-boxes-content").append("<div> Fehler beim Laden der Lernkarteien. </div>");
    }
}

async function loadCards(cardIds) {
    try {
        const questions = await Promise.all(cardIds.map(cardId => read_card(cardId)));

        if (questions.length === 0) {
            $("#questionsTitle").append("<div>Keine Fragen gefunden.</div>");
        } else {
            renderCards(questions);
        }

    } catch (error) {
        $("#questionsTitle").append("<div>Fehler beim Laden der Fragen.</div>");
        console.error(error);
    }
}

/* Functions to render data */
function renderCards(cards){
    cards.forEach(card => {
            $("#list-of-questions").append(
                '<li class="list-group-item">'
                + "<p><b>Frage: </b>" + card.question + "</p>"
                + "<p><b>Antwort: </b>" + card.answer + "</p>"
                + "</li>"
            );
    });
}

async function renderBoxes(boxes) {
    boxes = boxes.sort((a, b) => a.title.localeCompare(b.title));

    // load authors outside the rendering loop. order of authors array corresponds to boxes
    const authors = await Promise.all(
        boxes.map(box => read_user(box.ownerId))
    );

    $.each(boxes, function (index, item) {
        let author = authors[index];
        let statusPublic;
        if (item.public === true) {
            statusPublic = "&#x1F7E2; öffentlich";
        } else {
            statusPublic = "&#128993; privat";
        }

        let buttonHtml = `<button class='btn-showQuestions' data-item="${encodeURIComponent(JSON.stringify(item))}" data-title='${item.title.replace(/'/g, "&apos;")}'>Fragen anzeigen</button>`;

        $("#list-of-all-boxes").append('<li class="list-group-item">'
            + "<p>" + "<b>Titel:</b> " + "<b>" + item.title + "</b>" + "</p>"
            + "<p>" + "<b>erstellt von:</b> " + author.username + "</p>"
            + "<p>" + "<b>Beschreibung:</b> " + item.description + "</p>"
            + "<p>" + "<b>erstellt am:</b> " + new Date(item.createdAt).toLocaleDateString() + "</p>"
            + "<p>" + "<b>Sichtbarkeit: </b>" + statusPublic + "</p>"
            + buttonHtml
            + "</li>");

    });
}


/* Event handling */
function registerEventHandlers() {
    $(document).on("click", ".btn-showQuestions", handleShowQuestions);
    $(document).on("click", "#backToBoxes", handleBackToBoxes);
}

async function handleShowQuestions() {
    const selectedBoxTitle = $(this).data("title");
    const rawItem = $(this).attr("data-item");
    const selectedItem = JSON.parse(decodeURIComponent(rawItem));

    showQuestionsView(selectedBoxTitle);

    if (!selectedItem.cardIds || selectedItem.cardIds.length === 0) {
        $("#questionsTitle").append("<div>Keine Fragen gefunden.</div>");
        return;
    }

    await loadCards(selectedItem.cardIds);
}

function handleBackToBoxes() {
    $("#questionsTitle").hide().empty();
    $("#list-of-questions").hide().empty();
    $("#list-of-all-boxes").show();
    $("#backToBoxes").hide();
}

/* UI helpers */
function showQuestionsView(title) {
    $("#list-of-all-boxes").hide();
    $("#backToBoxes").show();
    $("#questionsTitle").text(title).show();
    $("#list-of-questions").empty().show();
}

function setupInitialUI() {
    $("#list-of-questions").hide();
    $("#questionsTitle").hide();
    $("#backToBoxes").hide();
}

