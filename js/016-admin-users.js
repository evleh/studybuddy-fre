import {searchTable} from "./util.js";


$(document).ready(function() {
    getUsers();
    searchTable("user-search", "user-table");

});

function getUsers(){
    console.log("lalala")
    $.ajax({
        url: "http://localhost:3000/users/",
        method: "GET",
        dataType: "json",
        headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
        success: function (data){
            console.log("successfully loaded users");
            console.log(data);
            renderUsers(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Fehler beim Laden der user:", textStatus, errorThrown);
        }
    })
}

function renderUsers(data){
    const tbl = $("#user-table")
    tbl.append(`<thead><tr> <th> Name </th> <th>Registriert am </th> <th> zuletzt aktiv am </th> </tr></thead>`);
    tbl.append("<tbody>")
    $.each(data, function(i, user) {
        const $row = $(`<tr> <td>${user.name}</td> <td>${user.registeredAt}</td> <td>${user.lastActiveAt}</td> </tr>`);
        $row.on("click", function () {
            window.location.href = `019-user-detail.html?id=${user.id}`;
        });
        tbl.append($row);
    })
    tbl.append("</tbody>")
}


