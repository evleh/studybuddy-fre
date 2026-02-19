import {isLoggedIn} from "./auth.js";

export function processElementsTaggedByCSSClasses() {
    if (isLoggedIn()) {
        $('.remove-when-logged-in').remove();
    } else {
        $('.remove-when-logged-out').remove();
    }
}

if (!window.sb) window.sb = {}
window.sb.processElementsTaggedByCSSClasses = processElementsTaggedByCSSClasses;

export function searchTable(searchId, searchTable){
    $(`#${searchId}`).on("keyup", function(){
        const searchInput = $(this).val().toLowerCase();
        $(`#${searchTable} tr`).each(function(){
            const row = $(this).text().toLowerCase();
            $(this).toggle(row.includes(searchInput));
        })
    })
}

export function searchCards(searchTerm) {
    const term = searchTerm.toLowerCase();

    $(".card").each(function () {
        const card = $(this);

        const cardText = card.text().toLowerCase();

        if (cardText.includes(term)) {
            card.show();
        } else {
            card.hide();
        }
    });
}