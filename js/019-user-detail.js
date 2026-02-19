import {read_user} from "./bae-connect-users.js";
import {read_all_boxes} from "./bae-connect-boxes.js";
import {read_all_comments} from "./bae-connect-comments.js";
import {make_link_from_fileName} from "./bae-connect-files.js";

$(document).ready(async function() {
    const params = new URLSearchParams(window.location.search);
    console.log(params.size)
    const userId = params.size === 0 ? "1657" : params.get("id")

    try {
        const user = await getUser(userId);
        renderUser(user);
        renderUserActions(user);

        const boxes = await getBoxes(user.id);
        renderUserBoxes(boxes);

        const comments = await getUserComments(user.id);
        renderUserComments(comments);

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
    $("#user-actions")
        .append($(`<button>User bearbeiten</button>`))
        .append($(`<button>User sperren</button>`))
        .append($(`<button>User Löschen</button>`))
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

function renderUserComments(comments){
    const $tbl = $("#comments-table");
    const $header = $(`<thead><tr> <td>Zu Kartei:</td> <td>Erstellt am</td> <td>Geändert am</td> <td>Kommentar</td> <td>Löschen</td> </tr></thead>`)
    $tbl.append($header);
    $tbl.append( $("<tbody>"))

    $.each(comments, function (i, comment){
        const createdAt = new Date(comment.createdAt);
        const updatedAt = new Date(comment.updatedAt);
        const $row = $(`<tr> <td>${comment.boxId}</td> <td>${createdAt.toUTCString()}</td> <td>${updatedAt.toUTCString()}</td> <td>${comment.text}</td> </tr>`);

        const $deleteBtn = $("<button>").text("Löschen").addClass("btn btn-sm btn-primary")
        const $td = $('<td></td>');
        $td.append($deleteBtn);
        $row.append($td);

        $tbl.append($row)
    })

    $tbl.append( $("</tbody>"))
}
