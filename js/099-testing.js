import {acquire_token} from "./bae-connect-token.js";
import {get_me_ownboxes, get_me_userinfo} from "./bae-connect-me.js";
import {create_box, change_box, read_box, delete_box, read_all_boxes} from "./bae-connect-boxes.js";
import {change_card, create_card, delete_card, read_all_cards, read_card} from "./bae-connect-cards.js";
import {
    change_comment,
    create_comment,
    delete_comment,
    read_all_comments,
    read_comment
} from "./bae-connect-comments.js";
import {appendNotification} from "./error-ui.js";
import {get_public_boxes} from "./bae-connect-public.js";
import {change_user, create_user, delete_user, read_all_users, read_user} from "./bae-connect-users.js";


/**
 * output convenience functions
 */

function string2cssClassAndRole(str) {
    let kind = str?.toUpperCase?.() ?? (str?'OK':'ERROR');
    if (str === undefined) kind = 'OK';
    switch(kind) {
        case "OK": return 'class="alert alert-success" role="alert"';
        case "ERROR": return 'class="alert alert-danger" role="alert"';
        case "INFO": return 'class="alert alert-info" role="alert"';
        case "WARN": return 'class="alert alert-warning" role="alert"';
        default: return 'class="alert alert-primary" role="alert"';
    }
}
function appendAlertDiv(msg, kind) {
    const custom_style = 'padding-top: 0.25em; padding-bottom: 0.25em;'
    $('#test-results-output-col').append(`<div ${string2cssClassAndRole(kind)} style="${custom_style}">${msg}</div>`);
}

/**
 * this ... simplifies ... things.
 */
async function acquire_default_admin_token() {
    return await acquire_token({username: 'admin', password: 'admin'});
}

/**
 * Main code path starts here
 */

let tokenRes = await acquire_default_admin_token()
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

/**
 * Testing comment endpoint
 */

try {
    let newBoxForComments = await create_box({
        'title': 'box for testing comment endpoint', description: 'description of box for comment testing',
        'public': true, 'ownerId': meUserInfo.id
    })

    let textOfComment = `text for comment test with random number ${Math.round(Math.random()*100)}`;
    try {
        let createCommentResponse = await create_comment({
            'boxId': newBoxForComments.id,
            'text': textOfComment,
            'authorId': meUserInfo.id, // TODO: refactor API / BAE changes? perhaps authorId automatic
        })
        appendAlertDiv(`comment: comment creation request did not throw.`)

        try {
            let readBoxDataAgain = await read_box(newBoxForComments.id);
            appendAlertDiv(`comments: adding comment to new box makes box have one comment.`,
                readBoxDataAgain.commentIds.length === 1)
        } catch(e) {
            appendAlertDiv(`comment: check of number of comments in box did not work out/threw.`)
        }

        // first read check
        let readCommentResponse;
        try {
            readCommentResponse = await read_comment(createCommentResponse.id);
            appendAlertDiv(`comment: read after create did not throw.`);
            appendAlertDiv(`comment text read same as intended to be written.`, readCommentResponse.text === textOfComment);
        } catch (e) {
            appendAlertDiv(`comment: some unexpected throw in the read/update/read chain`)
        }

        // update
        let updatedCommentText = `updated comment text with random number ${Math.round(Math.random()*100)}`;
        try {
            let updateResponse = await change_comment(readCommentResponse.id, {
                'text': updatedCommentText
            })
            appendAlertDiv(`comment: update did not throw.`);
            let readCommentAfterUpdate = await read_comment(readCommentResponse.id);
            appendAlertDiv(`comment: text after update changed correctly `,
                readCommentAfterUpdate.text === updatedCommentText)
        } catch(e) {
            appendAlertDiv(`comment: update failed`, 'ERROR')
        }

        try {
            let readAllCommentsResponse = await read_all_comments();
            appendAlertDiv(`comment: read all endpoint query ok.`)
            appendAlertDiv(`comment: read all when >0 comments returns >0 elements`,
                readAllCommentsResponse.length >0)
        } catch(e) {
            appendAlertDiv(`comments: read all failed.`, 'ERROR')
        }

        // now for deletion
        try {
            let deleteCommentResponse = await delete_comment(readCommentResponse.id);
            appendAlertDiv(`comment: deleting comment did not throw.`)
            // try reading now -> should fail
            try {
                let readAfterDeleteResponse = await read_comment(readCommentResponse.id);
                appendAlertDiv(`comment: read after delete was a thing?`, 'ERROR')
            } catch(e) {
                appendAlertDiv(`comment: read after delete failed, as it should`)
            }
        } catch (e) {
            appendAlertDiv(`comment: deletion failed unexpectedly.`, 'ERROR')
        }
        // check double deletion behavior
        try {
            await delete_comment(readCommentResponse.id);
            appendAlertDiv(`comment: double delete did not throw.`, 'ERROR')
        } catch(e) {
            appendAlertDiv(`comment: deletion of deleted comments did fail. seems ok.`)
        }


    } catch(e) {
        appendAlertDiv(`creating a comment failed.`, 'ERROR')
        console.log(e);
    }
    // cleanup
    try {
        await delete_box(newBoxForComments.id);
    } catch {
        appendAlertDiv(`cleanup fail: box for comment testing deletion did throw. `)
    }

} catch(e) {
    appendAlertDiv(`creating box for testing comments failed.`, 'ERROR')
}

/**
 * test public boxes endpoint
 */

try {
    // get current public boxes for comparison and basic check
    let firstPublicBoxesResult = await get_public_boxes();
    appendAlertDiv(`p/b: did not throw;`)
    let box1 = await create_box(
        {
            "title": "box1 - public",
            "description": "box1 - public",
            "ownerId": meUserInfo.id,
            "public": true
        }
    );
    let box2 = await create_box(
        {
            "title": "box2 - not public",
            "description": "box2 - not public",
            "ownerId": meUserInfo.id,
            "public": false
        }
    );
    appendAlertDiv(`p/b: creating a public and a non-public box did not throw.`)

    let secondPublicBoxesResult = await get_public_boxes();
    appendAlertDiv(`p/b: number of public boxes should increase by 1 if 1 public and 1 nonpublic boxes created`,
        secondPublicBoxesResult.length === firstPublicBoxesResult.length+1);

    await delete_box(box1.id);
    await delete_box(box2.id);
    appendAlertDiv(`p/b: cleanup of test-boxes did not throw.`);

} catch(e) {
    appendNotification(`public boxes: unresolved throw in testing routing`)
}

/**
 * testing of user endpoint
 */

try {
    // basic check: assuming we are logged in and admin a read_all_users should have > 0 results
    try {
        let allUsersResult = await read_all_users();
        appendAlertDiv(`user: read_all did not throw`)
        appendAlertDiv(`user: read_all.length > 0`, allUsersResult.length > 0)
    } catch(e) {
        appendAlertDiv(`user: read_all did throw - at least assumption error here.`, 'ERROR');
    }

    let verySimplePassword = `verySimplePassword${Math.round(Math.random()*100)}`;
    let randomUserName = `randomUser${Math.round(Math.random()*100)}`;
    let basic_user_to_create =
    {
        "username": randomUserName,
        "password": verySimplePassword,
        "email": `rfc2606compliant${Math.round(Math.random()*100)}@example.com`,
        "gender": `required${Math.round(Math.random()*100)}`,
        "firstname": `test-firstname${Math.round(Math.random()*100)}`,
        "lastname": `test-lastname${Math.round(Math.random()*100)}`,
        "country": `randomCountry${Math.round(Math.random()*100)}`,
    }
    ;

    let basicUserCreationResponse;
    try{
        basicUserCreationResponse = await create_user(basic_user_to_create)
        appendAlertDiv(`user: creation of basic test user did not throw`)

        // try reading the user data via user EP
        let basicUserRead = await read_user(basicUserCreationResponse.id)
        appendAlertDiv(`user: read after create did not throw (as admin).`)

        let values_to_compare = Object.getOwnPropertyNames(basic_user_to_create) // compare all keys
            .filter((v) => v!=='password');             // expect password plz
        //console.log(values_to_compare)
        for (const value_to_compare of values_to_compare) {
            appendAlertDiv(`user: comparing value after read for: ${value_to_compare}`,
                basicUserRead[value_to_compare] === basic_user_to_create[value_to_compare]);
        }
        //console.log(basic_user_to_create);
        //console.log(basicUserRead);

        // try getting a token for the user now
        try {
            let authResponse = acquire_token({
                username: basic_user_to_create.username,
                password: basic_user_to_create.password
            })
            appendAlertDiv(`user: request for auth token did not throw.`)
            appendAlertDiv(`user: request for auth token returned json with an auth token`,
                authResponse.accessToken)
        } catch(e) {
            appendAlertDiv(`user: trying to get token with userdata after creation did throw`, 'ERROR')
        }
        // reset admin auth
        await acquire_default_admin_token()

        // try updating only one value (lets say firstname)
        try{
            let newFirstName = `newFirstName${Math.round(Math.random()*100)}`
            // note: ATM, for dto/entity/validation/codepath reasons the update must send (some) required values
            // even if they don't change.

            let dataForUserUpdateRequest = {
                "firstname": newFirstName,
                "lastname": basic_user_to_create.lastname,
                "gender": basic_user_to_create.gender,
                "country": basic_user_to_create.country,
                "email": basic_user_to_create.email, // send email or it gets changed to "" (atm)
            };
            let updateResponse = await change_user(basicUserRead.id, dataForUserUpdateRequest)
            appendAlertDiv(`user: request to change user data did not throw`)

            let readAfterUpdate = await read_user(basicUserRead.id);
            appendAlertDiv(`user: read after update did not throw.`)

            appendAlertDiv(`user: update of firstname changed value correctly`,
                readAfterUpdate.firstname === dataForUserUpdateRequest.firstname)
            appendAlertDiv(`user: updating firstname does not change lastname, as requested?`,
                readAfterUpdate.lastname === dataForUserUpdateRequest.lastname)

            // try again getting an auth token; just to be safe ...
            try {
                let authResponse = await acquire_token({
                    username: basic_user_to_create.username,
                    password: basic_user_to_create.password
                })
                appendAlertDiv(`user: (second) request for auth token did not throw.`)
                appendAlertDiv(`user: (second) request for auth token returned json with an auth token`,
                    authResponse?.accessToken !== null)
            } catch(e) {
                appendAlertDiv(`user: (second) trying to get token with userdata after creation did throw`, 'ERROR')
            }
            // reset admin auth
            await acquire_default_admin_token()

            // try with wrong password, should not work now?
            try {
                let authResponse = await acquire_token({
                    username: basic_user_to_create.username,
                    password: "notAPassword"+basic_user_to_create.password+"byAddingData"
                })
                appendAlertDiv(`user: (wrongpw) request for auth token did not throw.`, 'ERROR')
                appendAlertDiv(`user: (wrongpw) request for auth token did not return an auth token????`,
                    authResponse?.accessToken === null)
            } catch(e) {
                appendAlertDiv(`user: (wrongpw) trying to get token with wrong password does throw. yay.`)
            }
            // reset admin auth
            await acquire_default_admin_token()

            /**
             * check admin bit stuff.
             */
            let updateToAdminBody = dataForUserUpdateRequest;
            updateToAdminBody.admin = true;

            let elevateToAdminResponse = await change_user(basicUserRead.id, updateToAdminBody);
            console.log(updateToAdminBody);
            console.log(elevateToAdminResponse)
            appendAlertDiv(`user: request to change admin flag to ture did not throw.`)
            appendAlertDiv(`user: admit bit set in update response - unclear judgement`,
                (elevateToAdminResponse.admin === updateToAdminBody.admin)?
                    'WARN':'WARN'); // todo: what does it mean?




        } catch(e) {
            appendAlertDiv(`user: updating basic test user failed throwing.`, 'ERROR')
        }


        // deletion best done in the try-block of create
        try {
            let deletionResponse = await delete_user(basicUserCreationResponse.id);
            appendAlertDiv(`user: cleanup/deletion of test user did not throw.`)
        } catch(e) {
            appendAlertDiv(`user: cleanup/deletion of test user did throw, assumed failed:(`, false)
        }

    } catch(e) {
        appendAlertDiv(`user: creation of basic user did throw :( `, false)
    }



} catch(e) {
    appendAlertDiv(`user EP: uncaught throw in testing routine`, 'ERROR')
}



appendAlertDiv(`If you see this testing code ran until the end`, 'INFO')