import {acquire_token} from "./bae-connect-token.js";
import {get_me_ownboxes, get_me_userinfo} from "./bae-connect-me.js";
import {create_box, change_box} from "./bae-connect-boxes.js";

let tokenRes = await acquire_token({username:'admin', password:'admin'});
console.log(tokenRes);
let meOwnBoxes = await get_me_ownboxes()
console.log(meOwnBoxes);
let meUserInfo = await get_me_userinfo()
console.log(meUserInfo);

let boxToUpdate;
if (meOwnBoxes.length === 0) {
    console.log('creating box')
    boxToUpdate = await create_box(
        {
            "title": "string",
            "description": "string",
            "ownerId": meUserInfo.id,
            "public": true
        }
    )
    meOwnBoxes = await get_me_ownboxes()
    console.log(meOwnBoxes);
} else {
    boxToUpdate = meOwnBoxes[0];
}

let change_response = await change_box(boxToUpdate.id, {
    "title": `changed_string`,
    "description": `changed description with random number: ${Math.round(Math.random()*100)}`,
})

console.log(change_response);

