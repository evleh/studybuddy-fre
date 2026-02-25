import {get_me_ownboxes, get_me_userinfo} from "./bae-connect-me.js";
import {make_link_from_fileName} from "./bae-connect-files.js";
import constants from "./constants.js";


$(document).ready(async function () {
    let userinfo = await get_me_userinfo();
    let profilepictureUrl = constants.DEFAULT_PROFILE_PIC;
    if (userinfo.foto) {
        profilepictureUrl = make_link_from_fileName(userinfo.foto);
    }
    const profilepicture = document.getElementById("profilepicture");
    profilepicture.setAttribute('src', profilepictureUrl);

    if (userinfo.admin) {
        const adminButton = document.getElementById("adminButton");
        adminButton.style.display = "inline-block";
    }

    let own_boxes = await get_me_ownboxes();

    if (own_boxes.length === 0) {
        let noBoxes =  `<p>Du hast noch keine eigenen Karteien.
            Gehe auf <strong>"+ Neue Kartei"</strong>, um deine erste persönliche Kartei anzulegen 
            - oder schmökere in den öffentlichen Karteien!</p>`
        $("#my-boxes").append(noBoxes);
    }

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
            '<div class="mb-2">' +
            '<button class="btn btn-outline-primary btn-questions mx-2">Fragen ansehen</button>' +
            '<button class="btn btn-outline-primary btn-edit">Bearbeiten</button>' +
            '</div>' +
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