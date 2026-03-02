import {read_public_boxes} from "./bae-connect-public.js";



$(document).ready(async function () {
    //potential changes to be made once data is imported from database (e.g. problems might occur if boxtitles contain html-tags)
    let public_boxes = await read_public_boxes()
    public_boxes.sort((a, b) => a.title.localeCompare(b.title));

    const isLoggedIn = sessionStorage.getItem('accessToken') !== null;


    $.each(public_boxes, function (index, item) {
        console.log(item);
        let boxtitle = item.title;
        let boxUrl = "006-view-box.html?id="+item.id;
        let boxLinkButton = `<a href="${boxUrl}" class="btn btn-sm btn-outline-primary logged-in-only">
            Ansehen
        </a>`;

        $(document.getElementById("list-of-shared-boxes")).append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="fw-bold">${boxtitle}</span>
                <div>
                    ${isLoggedIn ? boxLinkButton : ''}
                </div>
            </li>
        `);
});

    //search function
    $("#btn-alle-anzeigen").hide();

    $("#btn-suchen").click(function () {
        $("#btn-alle-anzeigen").show();
        $("#btn-suchen").hide();
        $("#list-of-shared-boxes").hide();

        let searchValue = $('#site-search').val();
        let searchresults = public_boxes.map(function (item) {
            if (item.title.toLowerCase().includes(searchValue.toLowerCase())) {
                return item;
            }
        });
        searchresults = searchresults.filter(element => element !== undefined);
        searchresults.sort((a, b) => a.title.localeCompare(b.title));
        console.log(searchresults.length);

        if (searchresults.length === 0) {
            $(document.getElementById("list-of-search-results")).append('<li class="list-group-item">' + "Zu diesen Suchbegriffen konnten leider keine Lernkarteien gefunden werden." + '</li>');
        } else {
            $.each(searchresults, function (index, item) {
                let boxtitle = item.title;
                let boxUrl = "006-view-box.html?id="+item.id;
                let boxLinkButton = `<a href="${boxUrl}" class="btn btn-sm btn-outline-primary logged-in-only">
                    Ansehen
                    </a>`;

                $(document.getElementById("list-of-search-results")).append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="fw-bold">${boxtitle}</span>
                        <div>
                            ${isLoggedIn ? boxLinkButton : ''}
                        </div>
                    </li>
                `);
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