import {get_me_ownboxes} from "./bae-connect-me.js";


$(document).ready(async function () {
    let own_boxes = await get_me_ownboxes();


    $.each(own_boxes, function (index, item) {

        let urlEdit = "011-edit-box.html?id="+item.id;
        //TODO: Refers to 012-new-card as a quick fix
        // -> make new site to see questions and flip open answers in 007-view-cards!
        let urlQuestions = "012-new-card.html?id="+item.id;
        let statusPublic;
        if (item.public === true) {
            statusPublic = "&#x1F7E2; öffentlich";
        } else {
            statusPublic = "&#128993; privat";
        }

        let listItem = $(
            '<li class="list-group-item">' +
            "<p><b>Titel:</b> <b>" + item.title + "</b></p>" +
            "<p><b>Beschreibung:</b> " + item.description + "</p>" +
            //TODO: Wrap boolean isPublic in a nicer way (e.g. colour coded icon)
            "<p><b>Sichtbarkeit:</b> " + statusPublic + "</p>" +
            '<button class="btn btn-primary btn-questions" style="margin-right: 2%">Fragen ansehen</button>' +
            '<button class="btn btn-primary btn-edit">Bearbeiten</button>' +
            "</li>"
        );

        listItem.find('.btn-edit').on('click', function() {
            window.location.href = urlEdit;
        });

        listItem.find('.btn-questions').on('click', function() {
            window.location.href = urlQuestions;
        });

        $("#list-of-own-boxes").append(listItem);

    });

});