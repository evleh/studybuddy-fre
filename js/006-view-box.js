import {read_box} from "./bae-connect-boxes.js";
import {read_user} from "./bae-connect-users.js";
import {create_comment} from "./bae-connect-comments.js"
import constants from "./constants.js";

function boxIdFromParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id")
}


async function showBox(boxId) {
    let box = await read_box(boxId);
    //TODO: This only works if the user trying to view the box is admin because read_user is admin only.
    //Is there another way to get the author's name for regular users? Or can we make read_user accessible for registered users as well?
    let author = await read_user(box.ownerId)
    $('#h1').text(box.title);
    $('#author').text("erstellt von: "+author.username);
    $('#description').text(box.description);
    $('#view-cards').on('click', function() {
        window.location.href = `007-view-cards.html?id=${boxId}`;
    });
}

//TODO: I need help making this work :(
async function createComment(boxId) {
    const form = document.getElementById('new-comment');
    const commentContainer = document.getElementById('comment-list');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(form));

        create_comment(data)
            .then(newComment => {
                renderComment(newComment);
                form.reset();
            })
            .catch(err => console.error("Fehler:", err));
    });

    function renderComment(comment) {
        const html = `
        <div class="card mb-2">
            <div class="card-body">
                ${comment.text} 
            </div>
        </div>`;
        commentContainer.insertAdjacentHTML('afterbegin', html);
    }
}

async function renderComments () {

}



$(document).ready(() => {
   let boxId = boxIdFromParams();
   showBox(boxId);
   createComment(boxId);




});