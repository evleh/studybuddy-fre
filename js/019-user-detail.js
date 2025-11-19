
$(document).ready(async function() {
    const params = new URLSearchParams(window.location.search);
    console.log(params.size)
    const userId = params.size === 0 ? "1657" : params.get("id")

    try {
        const user = await getUser(userId);
        renderUser(user);
        renderUserActions(user);

        const boxes = await getBoxes(user.name);
        renderUserBoxes(boxes);

        const comments = await getUserComments(user.name);
        renderUserComments(comments);

    } catch (err){
        console.log(err);
    }

});

async function getUser(id){
    try {
        const data = await $.ajax({
            method: "GET",
            url: "http://localhost:3000/users" + "/" + id,
            dataType: "json",
            headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` }
        });
        return data;
    } catch (err) {
        console.error("API Fehler:", err);
        throw err;
    }
}

async function getBoxes(author){
    try {
        const data = await $.ajax({
            method: "GET",
            url: "http://localhost:3000/boxes?author=" + author,
            dataType: "json",
            headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` }
        })
        return data;
    } catch (err){
        console.error("API Fehler when loading boxes:", err);
        throw err;
    }
}

function renderUser(user){
    $("#titel").append(user.name);
    const img = $(`<img src="${user.profilePic}">`)
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
    const $header = $(`<thead><tr> <td>Titel</td> <td>Erstellt am</td></tr></thead>`)
    $tbl.append($header);
    $tbl.append( $("<tbody>"))

    $.each(boxes, function (i, box){
        const $row = $(`<tr> <td>${box.title}</td> <td>${box.date}</td></tr>`);
        $row.on("click", function () {
            window.location.href = `019-user-detail.html?id=${user.id}`; // todo wo führt das hin???
        });

        $tbl.append($row);
    })

    $tbl.append( $("</tbody>"))

}

async function getUserComments(author){
    try {
        const data = await $.ajax({
            method: "GET",
            url: "http://localhost:3000/comments?author=" + author,
            dataType: "json",
            headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` }
        })
        return data;
    } catch (err){
        console.error("API Fehler when loading boxes:", err);
        throw err;
    }
}

function renderUserComments(comments){
    const $tbl = $("#comments-table");
    const $header = $(`<thead><tr> <td>Zu Kartei:</td> <td>Erstellt am</td> <td>Kommentar</td> <td>Löschen</td> </tr></thead>`)
    $tbl.append($header);
    $tbl.append( $("<tbody>"))

    $.each(comments, function (i, comment){
        const $row = $(`<tr> <td>${comment.commentBox}</td> <td>${comment.createdAt}</td> <td>${comment.text}</td> </tr>`);

        const $deleteBtn = $("<button>").text("Löschen").addClass("btn btn-sm btn-primary")
        const $td = $('<td></td>');
        $td.append($deleteBtn);
        $row.append($td);

        $tbl.append($row)
    })

    $tbl.append( $("</tbody>"))
}
