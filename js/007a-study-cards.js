import {read_box} from "./bae-connect-boxes.js";
import {read_card} from "./bae-connect-cards.js";
import {make_link_from_fileName} from "./bae-connect-files.js";

function boxIdFromParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id")
}


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
        `       <button id="btn-answer" class="btn btn-sm btn-outline-secondary" type="button" `,
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

function show_single_question_and_wait(cardid, cardIds) {
    return new Promise(async (resolve) => {
        let card = await read_card(cardid);
        let cardHtml = htmlForBasicQuestionDisplayCard(card);

        $("#div-for-questions").html(cardHtml);

        $("#btn-answer").on("click", function() {
            $("#btn-true, #btn-false").show();
        });

        $("#btn-next").off("click").on("click", () => {
            $("#btn-next").hide();
            resolve();
        });

        $("#btn-true").off("click").on("click", () => {
            const index = cardIds.indexOf(cardid);
            if (index !== -1) {
                cardIds.splice(index, 1);
            }
            if(cardIds.length===0) {$("#btn-next").text("Fertig! Weiter zum Kätzchen!")}
            $("#btn-next").show();
            $("#btn-true").hide();
            $("#btn-false").hide();
        });
        $("#btn-false").off("click").on("click", () => {
            $("#btn-next").show();
            $("#btn-true").hide();
            $("#btn-false").hide();
        });
    });
}

async function show_questions(boxId) {
    let box = await read_box(boxId);
    let cardIds = box.cardIds;
    setMainHeading(`Kartei: '${box.title}'`);

    while (cardIds.length > 0) {
        let currentRound = [...cardIds];
        for (let id of currentRound) {
            await show_single_question_and_wait(id, cardIds);
        }
    }
    $("#div-for-questions").html(`
    <div class="card p-4 shadow-sm">
        <h5 class="mb-4 text-success text-center">
            🎉 Glückwunsch! Du hast alle Fragen richtig beantwortet. Hier ist dein Kätzchen:
        </h5>
        
        <div class="row align-items-center">
            <div class="col-md-6 text-center mb-3 mb-md-0">
                <img class="img-fluid rounded shadow" 
                     style="max-height: 250px; width: 100%; object-fit: cover;" 
                     src="https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg">
            </div>
            
            <div class="col-md-6 d-grid gap-2">
                <button class="btn btn-outline-primary" onclick="location.reload();">
                    🔄 Kartei neu starten
                </button>
                <button class="btn btn-outline-primary" onclick="window.location.href='004-home-base.html'">
                    🏠 Zu meinen Karteien
                </button>
                <button class="btn btn-outline-primary" onclick="window.location.href='003-shared-boxes.html'">
                    🌍 Zu den öffentlichen Karteien
                </button>
            </div>
        </div>
    </div>
`);

}

$(document).ready(() => {
    let boxId = boxIdFromParams();
    show_questions(boxId)
});