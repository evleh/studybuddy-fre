import {read_public_boxes} from "./bae-connect-public.js";

let allPublicBoxes = [];
const isLoggedIn = sessionStorage.getItem('accessToken') !== null;

$(document).ready(async function () {
    allPublicBoxes = await read_public_boxes();
    allPublicBoxes.sort((a, b) => a.title.localeCompare(b.title));

    renderBoxList(allPublicBoxes, "#list-of-shared-boxes");
    $("#btn-alle-anzeigen").hide();

    $("#btn-suchen").click(handleSearch);
    $("#btn-alle-anzeigen").click(resetSearch);
});


function createBoxItemHtml(item) {
    const boxUrl = `006-view-box.html?id=${item.id}`;
    const boxLinkButton = `
        <a href="${boxUrl}" class="btn btn-sm btn-outline-primary logged-in-only">
            Ansehen
        </a>`;

    return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="fw-bold">${item.title}</span>
            <div>
                ${isLoggedIn ? boxLinkButton : ''}
            </div>
        </li>`;
}


function renderBoxList(boxes, containerId) {
    const $container = $(containerId);
    $container.empty();

    if (boxes.length === 0) {
        $container.append('<li class="list-group-item text-muted">Zu diesen Suchbegriffen konnten leider keine Lernkarteien gefunden werden.</li>');
    } else {
        $.each(boxes, (index, item) => {
            $container.append(createBoxItemHtml(item));
        });
    }
}


function handleSearch() {
    const searchValue = $('#site-search').val().toLowerCase();

    $("#btn-suchen").hide();
    $("#btn-alle-anzeigen").show();
    $("#list-of-shared-boxes").hide();
    $("#list-of-search-results").show();

    const searchResults = allPublicBoxes
        .filter(item => item.title.toLowerCase().includes(searchValue))
        .sort((a, b) => a.title.localeCompare(b.title));

    renderBoxList(searchResults, "#list-of-search-results");
}


function resetSearch() {
    $("#btn-alle-anzeigen").hide();
    $("#btn-suchen").show();

    $("#list-of-search-results").hide().empty();
    $("#list-of-shared-boxes").show();
    $('#site-search').val('');
}