import {delete_user, read_user} from "./bae-connect-users.js";
import {delete_box, read_all_boxes, read_box} from "./bae-connect-boxes.js";
import {delete_comment, read_all_comments} from "./bae-connect-comments.js";
import {make_link_from_fileName} from "./bae-connect-files.js";

$(document).ready(async function() {
    const params = new URLSearchParams(window.location.search);
    console.log(params.size)
    const userId = params.size === 0 ? "1657" : params.get("id")

    try {
        const user = await getUser(userId);
        renderUser(user);
        renderUserActions(user);
        $(document).on("click", ".delete-user-btn", function () {
            const userId = $(this).data("id");
            deleteUser(userId);
        });

        const boxes = await getBoxes(user.id);
        renderUserBoxes(boxes);
        $(document).on("click", ".delete-box-btn", function () {
            const boxId = $(this).data("id");
            deleteBox(boxId);
        });

        const comments = await getUserComments(user.id);
        await renderUserComments(comments);
        $(document).on("click", ".delete-comment-btn", function () {
            const commentId = $(this).data("id");
            deleteComment(commentId);
        });

    } catch (err){
        $("#titel").append("<div>Fehler beim Laden.</div>");
        $("#user-boxes").append("<div>Fehler beim Laden.</div>");
        $("#user-comments").append("<div>Fehler beim Laden.</div>");

        console.log(err);
    }

});

async function getUser(id){
    return await read_user(id);
}

async function getBoxes(ownerId){
    try {
        let allBoxes = await read_all_boxes();
        return allBoxes.filter((box) => box.ownerId === ownerId);
    } catch(e) {
        return []; // empty array good fallback if something iterates over the result methinks
    }
}

function renderUser(user){
    console.log(user)
    $("#titel").append(user.name);
    const img = $(`<img src="${make_link_from_fileName(user.foto)}">`)
    $("#profile-pic").append(img);

    $("#profile-info").append($(`<p>Anrede: ${user.gender}</p>`))
        .append($(`<p>Vorname: ${user.firstname}</p>`))
        .append($(`<p>Nachname: ${user.lastname}</p>`))
        .append($(`<p><a>E-mail: ${user.email}</a></p>`))
        .append($(`<p>Land: ${user.country}</p>`))
}


function renderUserActions(user){
    console.log("renderUserActions");
    $("#user-actions")
        .append($(`<button data-id="${user.id}">User bearbeiten</button>`))
        // .append($(`<button data-id="${user.id}>User sperren</button>`))
        .append($(`<button class="delete-user-btn btn btn btn-outline-danger m-2 btn-sm" data-id="${user.id}">User Löschen</button>`))
}

function renderUserBoxes(boxes){
    const $element = $("#user-boxes")
    if(boxes.length === 0){
        $element.append("<div>User hat noch keine Karteien erstellt.</div>");
        return;
    }

    let statusPublic = "unknown";

    boxes.forEach(box => {
        if (box.public === true) {
            statusPublic = "&#x1F7E2; öffentlich";
        } else {
            statusPublic = "&#128993; privat";
        }

        const cardHtml = `
        <div class="col-md-6">
            <div class="card shadow-sm h-100">
                <div class="pt-3 px-3 rounded flex-grow-1">
                    <div class="fw-semibold mb-1 d-flex justify-content-between align-items-center">
                        <span>${box.title}</span>
                        <span class="small text-muted">${statusPublic}</span>
                    </div>
                    <div class="small text-muted">
                        Beschreibung: ${box.description}
                    </div>
                </div>

                <!-- Body -->
                <div class="card-body d-flex flex-column ">
                    
                    <!-- Meta Infos -->
                    <div class="mb-3 small text-muted pt-2 gap-3 ">
                        <div>📅 Erstellt: ${box.createdAt ? new Date(box.createdAt).toLocaleDateString() : 'unknown'}</div>
                        <div>✏️ Aktualisiert:  ${box.updatedAt ? new Date(box.updatedAt).toLocaleDateString() : 'unknown'}</div>
                    </div>
                    
                    <div class="d-flex gap-3 small text-muted border-top pt-2">
                                <div><strong class="text-dark">${box.cardIds.length}</strong> Fragen</div>
                                <div><strong class="text-dark">${box.commentIds.length}</strong> Kommentare</div>
                                
                    </div>
        
                    <!-- Delete Button -->
                    <div class="mt-3">
                    <!-- to do: bearbeiten; dann clas btn-outline-primary --> 
                        <button onclick="window.location.href='../htmls/011-edit-box.html?id=${box.id}'" class="btn btn-outline-primary btn-sm edit-btn" data-id="${box.id}">
                            bearbeiten
                        </button>
                    
                        <button class="btn btn-outline-danger btn-sm delete-box-btn" data-id="${box.id}">
                            löschen
                        </button>
                       
                    </div>
        
                </div>
            </div>
        </div>`;
        $element.append(cardHtml);
    })

}

async function getUserComments(authorId){
    try {
        let allComments = await read_all_comments();
        return allComments.filter((comment) => comment.authorId === authorId);
    } catch(e) {
        return []; // empty array good fallback if something iterates over the result methinks
    }
}

async function renderUserComments(data){
    const $element = $("#user-comments");
    if(data.length === 0){
        $element.append("<div>User hat noch keine Kommentare erstellt.</div>");
        return;
    }

    const uniqueBoxIds = [...new Set(data.map(comment => comment.boxId))];
    const boxes = await Promise.all(uniqueBoxIds.map(boxId => read_box(boxId)))

    data.forEach(comment => {
        const box = boxes.find(box => box.id === comment.boxId);

        const cardHtml = `
        <div class="col-md-6">
            <div class="card shadow-sm h-100">
                <div class="pt-3 px-3 rounded flex-grow-1">
                    <div class="fw-semibold mb-1">${comment.text}</div>
                    <div class="small text-muted">
                        Kartei: ${box.title}
                    </div>
                </div>

                <!-- Body -->
                <div class="card-body d-flex flex-column ">
                    
                    <!-- Meta Infos -->
                    <div class="mb-3 small text-muted border-top pt-2 gap-3 ">
                        
                        <div>📅 Erstellt: ${comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'unknown'}</div>
                        <div>✏️ Aktualisiert:  ${comment.updatedAt ? new Date(comment.updatedAt).toLocaleDateString() : 'unknown'}</div>
                    </div>
        
                    <!-- Delete Button -->
                    <div class="mt-auto">
                        <button class="btn btn-outline-danger btn-sm delete-comment-btn" data-id="${comment.id}">
                            löschen
                        </button>
                    </div>
        
                </div>
            </div>
        </div>`;
        $element.append(cardHtml);
    })
}

function deleteUser(userId){
    console.log(userId)
    if (confirm("Willst du diesen User wirklich löschen?")) {
        delete_user(userId).then(
            user => {
                alert("User " + user.username + "wurde gelöscht!" );
                window.location.href = "014-admin-home-base.html" ;
            }
        ).catch( () => { alert("Fehler beim Löschen."); } );
    }
}

function deleteComment(commentId){
    if (confirm("Willst du diesen Kommentar wirklich löschen?")) {
        delete_comment(commentId).then(
            async comment => {
                alert("Kommentar " + comment.text + "wurde gelöscht!");
                //todo neu laden
                window.location.href = window.location.href; // force a re-load
            }
        ).catch( () => { alert("Fehler beim Löschen."); } );
    }
}

function deleteBox(boxId){
    if (confirm("Willst du diese Kartei wirklich löschen?")) {
        delete_box(boxId).then(
            async box => {
                alert("Kartei " + box.title + "wurde gelöscht!");
                window.location.href = window.location.href; // force a re-load
            }
        ).catch( () => { alert("Fehler beim Löschen der kartei."); } );
    }
}
