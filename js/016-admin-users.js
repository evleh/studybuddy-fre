import {searchTable} from "./util.js";
import {read_all_users} from "./bae-connect-users.js";


$(document).ready(function() {
    getUsers();
    searchTable("user-search", "user-table");

});

function getUsers(){
    let readUsersResponse = read_all_users();
    readUsersResponse.then(users => {
        renderUsers(users)
    })
}

function renderUsers(data){
    const tbl = $("#user-table")
    tbl.append(`<thead><tr> <th> Name </th> <th>Registriert am </th> <th> zuletzt aktiv am </th> </tr></thead>`);
    tbl.append("<tbody>")
    $.each(data, function(i, user) {
        // convert iso string to date for formating-options
        const createdDate = new Date(user.createdAt)
        const createdDateFormated = createdDate.toLocaleDateString()
        const lastLoginDateFormated = user.lastLogin?(new Date(user.lastLogin)).toDateString():'never/unknown'
        const $row = $(`<tr> <td>${user.username}</td> <td>${createdDateFormated}</td> <td>${lastLoginDateFormated}</td> </tr>`);
        $row.on("click", function () {
            window.location.href = `019-user-detail.html?id=${user.id}`;
        });
        tbl.append($row);
    })
    tbl.append("</tbody>")
}


