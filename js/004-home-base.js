import {get_me_ownboxes} from "./bae-connect-me.js";


$(document).ready(async function () {
    let own_boxes = await get_me_ownboxes();


    $.each(own_boxes, function (index, item) {

        let urlEdit = "011-edit-box.html?id="+item.id;
        let urlQuestions = "007-view-cards.html?id="+item.id;

        let listItem = $(
            '<li class="list-group-item">' +
            "<p><b>Titel:</b> <b>" + item.title + "</b></p>" +
            "<p><b>Beschreibung:</b> " + item.description + "</p>" +
            //TODO: Wrap boolean isPublic in a nicer way (e.g. colour coded icon)
            "<p><b>Sichtbarkeit:</b> " + item.public + "</p>" +
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