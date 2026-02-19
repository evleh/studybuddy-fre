import constants from "./constants.js";
import {get_me_ownboxes} from "./bae-connect-me.js";


$(document).ready(async function () {
    let own_boxes = await get_me_ownboxes();
    let urlEdit;
    let urlQuestions;



    $.each(own_boxes, function (index, item) {

        urlEdit = "http://localhost:63343/studybuddy-fre/htmls/011-edit-box.html?id="+item.id;
        //TODO: Refers to 012-new-card as a quick fix
        // -> make new site to see questions and flip open answers in 007-view-cards!

        urlQuestions = "http://localhost:63343/studybuddy-fre/htmls/012-new-card.html?id="+item.id;




        $(document.getElementById("list-of-own-boxes")).append('<li class="list-group-item">'
            + "<p>" + "<b>Titel:</b> " + "<b>" + item.title + "</b>" + "</p>"
            + "<p>" + "<b>Beschreibung:</b> " + item.description + "</p>"
            + "<p>" + "<b>Sichtbarkeit:</b> " + item.public + "</p>"
            + '<button class="btn btn-primary" id="ButtonQuestions" style="margin-right: 2%">Fragen ansehen</button>'
            + '<button class="btn btn-primary" id="ButtonEdit">Bearbeiten</button>'
            +
        "</li>");
    });

    document.getElementById('ButtonEdit').addEventListener('click', function() {
        window.location.href = urlEdit;
    });

    document.getElementById('ButtonQuestions').addEventListener('click', function() {
        window.location.href = urlQuestions;

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