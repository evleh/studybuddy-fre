import {searchCards} from "./util.js";
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
        const cardHtml = `
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body d-flex flex-column">
            
                        <!-- Content -->
                        <div>
                            <h5 class="fw-bold mb-1">${user.username}</h5>
                            <div class="text-muted">${user.firstname} ${user.lastname}</div>
                            <div class="text-muted small mb-2">${user.email}</div>
            
                            <div class="text-muted small mb-3">
                                <div>📅 Registriert: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'unknown'}</div>
                                <div>⏱ Letzter Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'unknown'}</div>
                            </div>
            
                            <div class="d-flex gap-3 small text-muted border-top pt-2">
                                <div><strong class="text-dark">${user.boxIds.length}</strong> Karteien</div>
                                <div><strong class="text-dark">${user.boxCommentIds.length}</strong> Kommentare</div>
                            </div>
                        </div>
            
                        <!-- Button -->
                        <div class="mt-3">
                            <a href="019-user-detail.html?id=${user.id}" 
                               class="btn btn-outline-primary btn-sm w-100">
                               Details ansehen
                            </a>
                        </div>
            
                    </div>
                </div>
            </div>
            `;

        $element.append(cardHtml);
    })
}



