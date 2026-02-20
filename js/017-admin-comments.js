import {searchCards} from "./util.js";
import {read_all_comments} from "./bae-connect-comments.js";
import {read_user} from "./bae-connect-users.js";
import {read_box} from "./bae-connect-boxes.js";


$(document).ready(function() {
    getComments();

    $("#user-search").on("input", function () {
        const value = $(this).val();
        searchCards(value);
    });

});

function getComments(){
    let readCommentsResponse = read_all_comments();
    readCommentsResponse
        .then(comments => { renderComments(comments) })
        .catch(() => {
            const $element = $("#comments");
            $element.append("<div>Fehler beim Laden der Kommentare.</div>")
        })
}

async function renderComments(data) {
    const uniqueAuthorIds = [...new Set(data.map(comment => comment.authorId))];
    const authors = await Promise.all(uniqueAuthorIds.map(userId => read_user(userId)));

    const uniqueBoxIds = [...new Set(data.map(comment => comment.boxId))];
    const boxes = await Promise.all(uniqueBoxIds.map(boxId => read_box(boxId)))
    console.log(boxes)
    const $element = $("#comments");
    data.forEach(comment => {
        const author = authors.find(user => user.id === comment.authorId);
        const box = boxes.find(box => box.id === comment.boxId);

        console.log(comment)
        const cardHtml = `
        <div class="col-md-6">
    <div class="card shadow-sm h-100">
        
        <!-- Header -->
<!--        <div class="card-header bg-light d-flex justify-content-between align-items-center">-->
<!--            <div class="small text-muted">-->
<!--                Kommentar-ID: <strong>#3</strong>-->
<!--            </div>-->
<!--            <span class="badge bg-secondary">Box #4</span>-->
<!--        </div>-->
        <!-- Kommentartext -->
            <div class="p-3 bg-light rounded flex-grow-1">
                <div class="fw-semibold">${comment.text}</div>
<!--                <div>-->
<!--                    Erstellt von schwupsdiwups-->
<!--                </div>-->
            </div>

        <!-- Body -->
        <div class="card-body d-flex flex-column">
            <!-- Meta Infos -->
            <div class="mb-3 small text-muted">
                <div>Author*in: ${author.username}</div>
                <div>zu Kartei: ${box.title}</div>
            </div>
            
            <!-- Meta Infos -->
            <div class="mb-3 small text-muted">
                <div>📅 Erstellt: ${comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'unknown'}</div>
                <div>✏️ Aktualisiert:  ${comment.updatedAt ? new Date(comment.updatedAt).toLocaleDateString() : 'unknown'}</div>
            </div>

            

            <!-- Delete Button -->
            <div class="mt-auto">
                <button class="btn btn-outline-primary btn-sm ">
                    bearbeiten
                </button>
                <button class="btn btn-outline-danger btn-sm">
                    löschen
                </button>
            </div>

        </div>
    </div>
</div>
             `;

        $element.append(cardHtml);
    })
}



