import constants from "./constants.js";

$(document).ready(function (){
    $.ajax({
        method: "GET",
        url: "../DummyData/boxes.json",
        dataType: "json"
    }).done(function (data){
        renderMyBoxes(data);

    })

})

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