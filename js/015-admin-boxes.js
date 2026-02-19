import {read_all_boxes} from "./bae-connect-boxes.js";
import {read_user} from "./bae-connect-users.js";
import {read_card} from "./bae-connect-cards.js";

$(document).ready(function() {
    setupInitialUI();

    loadBoxes();

    $(document).on('click', '.btn-showQuestions', function () {
        const selectedBoxTitle = $(this).data('title');
        const rawItem = $(this).attr("data-item");
        const selectedItem = JSON.parse(decodeURIComponent(rawItem));

        $("#backToBoxes").show();
        $(document).on('click', '#backToBoxes', function () {
            $("#questionsTitle").hide();
            $("#list-of-questions").hide();
            $("#list-of-all-boxes").show();
            $("#backToBoxes").hide();
        });

        $("#list-of-all-boxes").hide();
        $("#questionsTitle").show();
        document.getElementById("questionsTitle").textContent = selectedBoxTitle;
        // cardIds aus item raus holen und jedes einzeln aus dem backend holen + rendern
        // wenn keine karten text anzeigen: diese kartei enthlt noch keine Fragen
        if (!selectedItem.cardIds || selectedItem.cardIds.length === 0) {
            $("#questionsTitle").append(
                "<div>Die Kartei ist leer.</div>"
            );
        } else {
            loadCards(selectedItem.cardIds);
        }
        $("#list-of-questions").show();

        $("#list-of-questions").empty();



    });
});

async function loadBoxes(){
    try {
        const boxes = await read_all_boxes();
        renderBoxes(boxes);
    } catch (error) {
        $("#admin-boxes-content").append("<div> Fehler beim Laden der Lernkarteien. </div>");
    }
}

async function loadCards(cardIds) {
    try {
        const questions = await Promise.all(
            cardIds.map(cardId => read_card(cardId))
        );

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



function renderBoxes(boxes){
    boxes = boxes.sort((a, b) => a.title.localeCompare(b.title));

    $.each(boxes, async function (index, item) {
        let author = await read_user(item.ownerId);
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

function setupInitialUI() {
    $("#list-of-questions").hide();
    $("#questionsTitle").hide();
    $("#backToBoxes").hide();
}

