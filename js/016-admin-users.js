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
    // const tbl = $("#user-table")
    // tbl.append(`<thead><tr> <th> Name </th> <th>Registriert am </th> <th> Letzte Änderung am </th> </tr></thead>`);
    // tbl.append("<tbody>")
    // $.each(data, function(i, user) {
    //     // convert iso string to date for formating-options
    //     const createdDateFormated = user.createdAt?(new Date(user.createdAt)).toLocaleDateString():'unknown'
    //     const lastLoginDateFormated = user.updatedAt?(new Date(user.updatedAt)).toLocaleDateString():'unknown'
    //     const $row = $(`<tr> <td>${user.username}</td> <td>${createdDateFormated}</td> <td>${lastLoginDateFormated}</td> </tr>`);
    //     $row.on("click", function () {
    //         window.location.href = `019-user-detail.html?id=${user.id}`;
    //     });
    //     tbl.append($row);
    // })
    // tbl.append("</tbody>")

    const $element = $("#users");
    data.forEach(user => {
        const cardHtml =
            `<div class="card mb-3" style="width: 100% !important;">
            <div class="card-body">
            <h5 class="card-title">${user.username}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Name: ${user.firstname} ${user.lastname}</h6>
            <div class="card-text">Registriert seit: ${user.createdAt?(new Date(user.createdAt)).toLocaleDateString():'unknown'}</div>
            <div class="card-text">Letzter Login: ${user.lastLogin?(new Date(user.lastLogin)).toLocaleDateString():'unknown'}</div>
            
            <a href="019-user-detail.html?id=${user.id}" class="card-link">Details ansehen</a>
            </div>
            </div>`;

        $element.append(cardHtml);
    })
    tbl.append("</tbody>")
}


