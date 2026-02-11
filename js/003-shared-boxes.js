import {read_public_boxes} from "./bae-connect-public.js";

$(document).ready(async function () {
    //potential changes to be made once data is imported from database (e.g. problems might occur if boxtitles contain html-tags)
    let public_boxes = await read_public_boxes()
    let boxtitles = public_boxes.map((box) => box.title);
    boxtitles.sort()

    $.each(boxtitles, function (index, item) {
                 $(document.getElementById("list-of-shared-boxes")).append('<li class="list-group-item">' + item + "</li>");
             });

    //search function
    $("#btn-alle-anzeigen").hide();

    $("#btn-suchen").click(function () {
        $("#btn-alle-anzeigen").show();
        $("#btn-suchen").hide();
        $("#list-of-shared-boxes").hide();

        let searchValue = $('#site-search').val();
        let searchresults = boxtitles.map(function (item) {
            if (item.toLowerCase().includes(searchValue.toLowerCase())) {
                return item;
            }
        });
        searchresults = searchresults.filter(element => element !== undefined);
        searchresults.sort();
        console.log(searchresults.length);

        if (searchresults.length === 0) {
            $(document.getElementById("list-of-search-results")).append('<li class="list-group-item">' + "Zu diesen Suchbegriffen konnten leider keine Lernkarteien gefunden werden." + '</li>');
        } else {
            $.each(searchresults, function (index, item) {
                $(document.getElementById("list-of-search-results")).append('<li class="list-group-item">' + item + "</li>");
            });
        }
        $("#list-of-search-results").show();

    });

    $("#btn-alle-anzeigen").click(function () {
        $("#btn-alle-anzeigen").hide();
        $("#btn-suchen").show();

        $("#list-of-search-results").hide();
        $("#list-of-shared-boxes").show();
        document.getElementById("list-of-search-results").replaceChildren();
        document.getElementById('site-search').value = '';
    });
});