import {delete_box, read_all_boxes} from "./bae-connect-boxes.js";
import {read_user} from "./bae-connect-users.js";
import {delete_card, read_card} from "./bae-connect-cards.js";
import {searchCards} from "./util.js";

$(document).ready(function() {
    setupInitialUI();
    registerEventHandlers();
    loadBoxes();

    $(document).on("click", ".delete-box-btn", function () {
        const boxId = $(this).data("id");
        deleteBox(boxId);
    });

    $(document).on("click", ".delete-card-btn", function () {
        const cardId = $(this).data("id");
        deleteCard(cardId);
    });



});

/* Functions to load data from backend */
async function loadBoxes(){
    try {
        const boxes = await read_all_boxes();
        await renderBoxes(boxes);

        $("#content-search").on("input", function () {
            const value = $(this).val();
            searchCards(value);
        });
    } catch (error) {
        console.log(error)
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
        const cardHtml = `
        <div class="col-md-6 mb-2">
            <div class="card shadow-sm h-100">
                <div class="pt-3 px-3 rounded flex-grow-1">
                    <div class="fw-semibold">Frage: ${card.question}</div>
                </div>

                <!-- Body -->
                <div class="card-body d-flex flex-column ">
                    
                    <!-- Meta Infos -->
                    <div class="mb-1 small text-muted gap-3 ">
                        <div>Antwort: ${card.answer} </div>
                    </div>
        
                    <!-- Delete Button -->
                    <div class="mt-1">
                        <button onclick="window.location.href='../htmls/012-new-card.html?id=${card.boxId}&cardId=${card.id}'" class="btn btn-outline-primary btn-sm edit-btn mt-2" data-id="${card.id}">
                            bearbeiten
                        </button>
                    
                        <button class="btn btn-outline-danger btn-sm delete-card-btn mt-2" data-id="${card.id}">
                            löschen
                        </button>
                    </div>
        
                </div>
            </div>
        </div>`;


        $("#list-of-questions").append(cardHtml);
    });
}

async function renderBoxes(boxes) {
    boxes = boxes.sort((a, b) => a.title.localeCompare(b.title));

    const uniqueAuthorIds = [...new Set(boxes.map(box => box.ownerId))];
    const authors = await Promise.all(
        uniqueAuthorIds.map(id => read_user(id))
    );
    //console.log(boxes)
    boxes.forEach(item => {
    //$.each(boxes, function (index, item) {
        console.log(item)
        let author = authors.find(author => author.id === item.ownerId);
        let statusPublic;
        if (item.public === true) {
            statusPublic = "&#x1F7E2; öffentlich";
        } else {
            statusPublic = "&#128993; privat";
        }



        const cardHtml = `
        <div class="col-md-6 mb-2">
            <div class="card shadow-sm h-100">
                <div class="pt-3 px-3 rounded flex-grow-1">
                    <div class="fw-semibold mb-1 d-flex justify-content-between align-items-center">
                        <span>${item.title}</span>
                        <span class="small text-muted">${statusPublic}</span>
                    </div>
                    <div class="small text-muted">
                        Beschreibung: ${item.description}
                    </div>
                </div>

                <!-- Body -->
                <div class="card-body d-flex flex-column ">
                    
                    <!-- Meta Infos -->
                    <div class="mb-3 small text-muted pt-2 gap-3 ">
                        <div>👤 Autor*in: ${author.username}</div>
                        <div>📅 Erstellt: ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'unknown'}</div>
                        <div>✏️ Aktualisiert:  ${item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'unknown'}</div>
                    </div>
                    
                    <div class="d-flex gap-3 small text-muted border-top pt-2">
                                <div><strong class="text-dark">${item.cardIds.length}</strong> Fragen</div>
                                <div><strong class="text-dark">${item.commentIds.length}</strong> Kommentare</div>
                                
                    </div>
        
                    <!-- Delete Button -->
                    <div class="mt-3">
                        <button class='btn-showQuestions btn btn-outline-primary btn-sm edit-btn' data-item="${encodeURIComponent(JSON.stringify(item))}" data-title='${item.title.replace(/'/g, "&apos;")}'>Fragen anzeigen</button>

    
                        <button onclick="window.location.href='../htmls/011-edit-box.html?id=${item.id}'" class="btn btn-outline-primary btn-sm edit-btn" data-id="${item.id}">
                            bearbeiten
                        </button>
                    
                        <button class="btn btn-outline-danger btn-sm delete-box-btn" data-id="${item.id}">
                            löschen
                        </button>
                       
                    </div>
        
                </div>
            </div>
        </div>`;

        $("#list-of-all-boxes").append(cardHtml);


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
    $("#generalTitle").show();
    $("#list-of-all-boxes").show();
    $("#backToBoxes").hide();
}

/* UI helpers */
function showQuestionsView(title) {
    $("#list-of-all-boxes").hide();
    $("#generalTitle").hide();
    $("#backToBoxes").show();
    $("#questionsTitle").append(title).show();
    $("#list-of-questions").empty().show();
}

function setupInitialUI() {
    $("#list-of-questions").hide();
    $("#questionsTitle").hide();
    $("#backToBoxes").hide();
}

function deleteBox(boxId){
    if (confirm("Willst du diese Kartei wirklich löschen?")) {
        delete_box(boxId).then(
            async box => {
                alert("Kartei " + box.title + "wurde gelöscht!");
                window.location.href = window.location.href; // force a re-load
            }
        ).catch( () => { alert("Fehler beim Löschen der Kartei."); } );
    }
}

function deleteCard(cardId){
    if (confirm("Willst du diese Frage wirklich löschen?")) {
        delete_card(cardId).then(
            async card => {
                alert("Frage " + card.question + "wurde gelöscht!");
                // todo currently reload, reloads the box view
                window.location.href = window.location.href; // force a re-load
            }
        ).catch( () => { alert("Fehler beim Löschen."); } );
    }
}
