import {read_box} from "./bae-connect-boxes.js";
import {read_user} from "./bae-connect-users.js";
import {create_comment, read_comment} from "./bae-connect-comments.js"
import {get_me_userinfo} from "./bae-connect-me.js"


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
async function createComment(boxId, userId) {
    const form = document.getElementById('new-comment');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(form));


        let post_data = {
            text: data.comment,
            authorId: userId,
            boxId: boxId,
        }

        create_comment(post_data)
            .then(newComment => {
                renderComment(newComment);
                form.reset();
            })
            .catch(err => console.error("Fehler:", err));
    });

}

async function renderComment(comment) {
    //TODO: See comment on line 15 about read_user being limited to admins
    let author = await read_user(comment.authorId)
    const html = `
        <div class="card mb-2">
            <div class="card-body">
                <strong>${author.username}</strong><br>
                ${comment.text} 
            </div>
        </div>`;
    document.getElementById('comment-list').insertAdjacentHTML('afterbegin', html);
}

async function renderComments (boxId) {
    let box = await read_box(boxId);
    let comments = box.commentIds.map(async (commentId) => {
        let commentRead = await read_comment(commentId)
        return commentRead;
    });

    $("#comment-list").empty();
    $.each(comments, async function (i, commentPromise) {
        let comment = await commentPromise;
        renderComment(comment);
    });
}


$(document).ready(() => {
   let boxId = boxIdFromParams();
   let userId = get_me_userinfo().id;
   showBox(boxId);
   renderComments(boxId);
   createComment(boxId, userId);

});