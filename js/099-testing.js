import {acquire_token} from "./bae-connect-token.js";
import {get_me_ownboxes, get_me_userinfo} from "./bae-connect-me.js";
import {create_box, change_box, read_box, delete_box, read_all_boxes} from "./bae-connect-boxes.js";
import {change_card, create_card, delete_card, read_all_cards, read_card} from "./bae-connect-cards.js";

function string2cssClassAndRole(str) {
    let kind = str?.toUpperCase?.() ?? (str?'OK':'ERROR');
    if (str === undefined) kind = 'OK';
    switch(kind) {
        case "OK": return 'class="alert alert-success" role="alert"';
        case "ERROR": return 'class="alert alert-danger" role="alert"';
        case "INFO": return 'class="alert alert-info" role="alert"';
        default: return 'class="alert alert-primary" role="alert"';
    }
}
function appendAlertDiv(msg, kind) {
    $('#test-results-output-col').append(`<div ${string2cssClassAndRole(kind)}>${msg}</div>`);
}

/**
 * Main code path starts here
 */

let tokenRes = await acquire_token({username:'admin', password:'admin'});
//console.log(tokenRes);
appendAlertDiv('token request did not fail throwing.')

let meOwnBoxes = await get_me_ownboxes()
//console.log(meOwnBoxes);
appendAlertDiv(`me/boxes request did not fail throwing (n=${meOwnBoxes.length})`)

let meUserInfo = await get_me_userinfo()
//console.log(meUserInfo);
appendAlertDiv(`me/self did not fail throwing.`)
appendAlertDiv(`admin bit is set and bool`, meUserInfo.admin === true);
if (meUserInfo.admin) {
    let allBoxes = await read_all_boxes();
    appendAlertDiv(`boxes/ (=readAll) request did not fail throwing (n=${allBoxes.length})`)

}

let numberOfOwnBoxesBefore = meOwnBoxes.length;
let boxToUpdate;

boxToUpdate = await create_box(
    {
        "title": "string",
        "description": "string",
        "ownerId": meUserInfo.id,
        "public": true
    }
)
meOwnBoxes = await get_me_ownboxes()
appendAlertDiv(`ownBoxes: number increases by one by creating one.`, (numberOfOwnBoxesBefore+1)===meOwnBoxes.length)

let new_box_title = `changed_string`
let new_box_description = `changed description with random number: ${Math.round(Math.random()*100)}`;
let change_response = await change_box(boxToUpdate.id, {
    "title": new_box_title,
    "description": new_box_description,
})

console.log(change_response);

let read_box_data = await read_box(boxToUpdate.id);
appendAlertDiv('box.title: value read = value changed to ', read_box_data.title===new_box_title)
appendAlertDiv('box.descr: value read = value changed to ', read_box_data.description===new_box_description)
try {
    let delete_box_response = await delete_box(boxToUpdate.id);
    console.log(delete_box_response);
    appendAlertDiv(`Box: delete without throwing worked.`, 'OK')
} catch (error) {
    appendAlertDiv(`Box: Error: first delete did throw. `, 'ERROR')
}
try {
    let read_after_delete_data = await read_box(boxToUpdate.id);
    appendAlertDiv(`Box: Read after delete did not throw.`, 'ERROR')
} catch(err) {
    appendAlertDiv(`Box: Read after delete should fail.`, 'OK')
}

try {
    await delete_box(boxToUpdate.id);
    console.log(`Box: double delete did not throw?`)
} catch(e) {
    console.log(`Box: successful fail on double delete`);
    appendAlertDiv("successful fail on double delete", "ok")
}

/**
 * create a box; add a card; check the connection; check card endpoints; cleanup;
 */

let newBoxForCardTesting = await create_box({
    'title': 'box for card-testing',
    'description': 'description string of box for card testing',
    'public': true,
    'ownerId': meUserInfo.id,
})

let newCardQuestion = `newCardQuestion random number = ${Math.round(Math.random()*100)}`;
let newCardAnswer = `newCardAnswer random number = ${Math.round(Math.random()*100)}`;
let newCard = await create_card({
    'boxId': newBoxForCardTesting.id,
    'question': newCardQuestion,
    'answer': newCardAnswer,
})
console.log(newCard);
appendAlertDiv(`creation of card did not throw`)

let boxAfterCardCreation = await read_box(newBoxForCardTesting.id);
console.log(boxAfterCardCreation)
appendAlertDiv(`number of cards in a box after creating card in new box should be 1`, boxAfterCardCreation.cardIds.length === 1);

try {
    // assuming testing as admin
    let allCardsResponse = await read_all_cards();
    appendAlertDiv(`all cards readable (admin) and number of all cards > 0`, allCardsResponse.length > 0)
} catch(e) {
    appendAlertDiv(`cards: reading all cards failed.`, 'ERROR')
}

// check changing a cord (not: changing the box of a card, btw.; assumed edge case;
let changedCardQuestion = `changedCardQuestion random number = ${Math.round(Math.random()*100)}`;
let changedCardAnswer = `changedCardAnswer random number = ${Math.round(Math.random()*100)}`;

try {
    let changeCardResponse = await change_card(newCard.id, {
        'boxId': newBoxForCardTesting.id, // required? ATM it seems so. TODODODODODO
        'question': changedCardQuestion,
        'answer': changedCardAnswer,
    });
    appendAlertDiv(`card: change request did not throw`);
    let cardReadAfterChange = await read_card(newCard.id);
    appendAlertDiv(`card: question change successful.`, cardReadAfterChange.question === changedCardQuestion);
    appendAlertDiv(`card: answer change successful.`, cardReadAfterChange.answer === changedCardAnswer);
} catch (error) {
    console.log(error)
    appendAlertDiv(`card: error: change card testing threw unexpectedly.`, 'ERROR')
}

// what happens if we try deleting a box that still has cards?
try {
    let suddenBoxDeletionResponse = await delete_box(newBoxForCardTesting.id);
    appendAlertDiv(`Deletion of box was done even though it still has cards?`, 'ERROR')
} catch(e) {
    appendAlertDiv(`Deletion of box fails if it has cards`, 'OK')
}

// delete card
try {
    let deletionResponse = await delete_card(newCard.id)
    appendAlertDiv(`Card: Deletion request did not throw.`)
    let boxAfterCardDeletion = await read_box(newBoxForCardTesting.id);
    appendAlertDiv(`Card: Deletion of only card makes Box have zero cards (and also not throw).`,
        boxAfterCardDeletion.cardIds.length === 0);
} catch {
    appendAlertDiv(`Card: Something threw in the delete card testing.`, 'ERROR')
}

// delete box after deleting all cards = works?
try {
    let responsibleBoxDeletionResponse = await delete_box(newBoxForCardTesting.id);
    appendAlertDiv(`Cards: Deletion of card-testing box successful`, 'OK')
} catch(e) {
    appendAlertDiv(`Deletion of box fails even though cards were deleted `, 'ERROR')
}


appendAlertDiv(`If you see this testing code ran until the end`, 'INFO')