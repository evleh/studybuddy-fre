import {delete_user, read_user} from "./bae-connect-users.js";
import {read_all_boxes, read_box} from "./bae-connect-boxes.js";
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
        $(document).on("click", ".delete-btn", function () {
            const userId = $(this).data("id");
            deleteUser(userId);
        });

        const boxes = await getBoxes(user.id);
        renderUserBoxes(boxes);

        const comments = await getUserComments(user.id);
        await renderUserComments(comments);
        $(document).on("click", ".delete-btn", function () {
            const commentId = $(this).data("id");
            deleteComment(commentId);
        });

    } catch (err){
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
        .append($(`<button class="delete-btn btn btn btn-outline-danger m-2" data-id="${user.id}">User Löschen</button>`))
}

function renderUserBoxes(boxes){
    const $tbl = $("#box-table");
    const $header = $(`<thead><tr> <td>Titel</td> <td>Erstellt am</td><td>Zuletzt geändert</td></tr></thead>`)
    $tbl.append($header);
    $tbl.append( $("<tbody>"))

    $.each(boxes, function (i, box){
        const createdAt = new Date(box.createdAt);
        const updatedAt = new Date(box.updatedAt);
        const $row = $(`<tr> <td>${box.title}</td> <td>${createdAt.toUTCString()}</td><td>${updatedAt.toUTCString()}</td></tr>`);
        $row.on("click", function () {
            window.location.href = `019-user-detail.html?id=${user.id}`; // todo wo führt das hin???
        });

        $tbl.append($row);
    })

    $tbl.append( $("</tbody>"))

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
                        <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${comment.id}">
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
            }
        ).catch( () => { alert("Fehler beim Löschen."); } );
    }
}
