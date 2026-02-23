import {read_box} from "./bae-connect-boxes.js";
import {read_user} from "./bae-connect-users.js";

function boxIdFromParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id")
}


async function show_box(boxId) {
    let box = await read_box(boxId);
    let author = await read_user(box.ownerId)
    $('#h1').text(box.title);
    $('#author').text("erstellt von: "+author.username);
    $('#description').text(box.description);

}

$(document).ready(() => {
   let boxId = boxIdFromParams();
   show_box(boxId);

});