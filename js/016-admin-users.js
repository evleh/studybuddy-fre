import {searchTable, searchCards} from "./util.js";
import {read_all_users} from "./bae-connect-users.js";


$(document).ready(function() {
    getUsers();

    $("#user-search").on("input", function () {
        const value = $(this).val();
        searchCards(value);
    });


});

function getUsers(){
    let readUsersResponse = read_all_users();
    readUsersResponse
        .then(users => { renderUsers(users) })
        .catch(() => {
            const $element = $("#users");
            $element.append("<div>Fehler beim Laden der Userdaten.</div>")
        })
}

function renderUsers(data){

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
}



