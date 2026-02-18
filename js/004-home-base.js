import constants from "./constants.js";
import {get_me_ownboxes} from "./bae-connect-me.js";


$(document).ready(async function () {
    let own_boxes = await get_me_ownboxes()

    //let boxtitles = own_boxes.map((box) => box.title);
    //boxtitles.sort()


    $.each(own_boxes, function (index, item) {

        $(document.getElementById("list-of-own-boxes")).append('<li class="list-group-item">'
            + "<p>" + "<b>Titel:</b> " + "<b>" + item.title + "</b>" + "</p>"
            + "<p>" + "<b>Beschreibung:</b> " + item.description + "</p>"
            + "<p>" + "<b>Sichtbarkeit:</b> " + item.public + "</p>"
            + '<button>Fragen ansehen</button>'
            + '<button>Bearbeiten</button>'
            +
        "</li>");
    });
});

function renderMyBoxes(data) {
    $.each(data, function (i, boxData) {
        if (boxData.isPublic !== 1) {
            const $boxItem = $("<div>").addClass("list-group-item d-flex justify-content-between align-items-center");

            const $title = $("<span>").text(boxData.title);

            const $editBtn = $("<button>")
                .addClass("btn btn-sm btn-outline-primary")
                .attr("id", `box-${i}`)
                .text("Bearbeiten")
                .on("click", function() {
                    window.location.href = `011-edit-box.html?id=${boxData.id}`;
                });

            const $viewBtn = $("<button>")
                .addClass("btn btn-sm btn-outline-primary")
                .attr("id", `box-${i}`)
                .text("Ansehen")
                // .on("click", function() {
                //     window.location.href = `011-edit-box.html?id=${boxData.id}`;
                // });
            const $buttonGroup = $("<div>").addClass("d-flex gap-2").append($editBtn).append($viewBtn);
            $boxItem.append($title).append($buttonGroup);
            $("#my-boxes").append($boxItem);
        }
    });
}