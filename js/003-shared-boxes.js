$(document).ready(function (){
    $.ajax({
        method: "GET",
        url: "../DummyData/boxes.json",
        dataType: "json"
    }).done(function (data){
        $.each(data, function (i, boxData){
            if(boxData.public === "1"){
                // $ in variable name is convention to indicate, that variable contains jQuery Object
                const $title = $("<a>")
                    .attr({ href: `005-view-box.html?id=${boxData.id}`, id: `box-${i}`,})
                    .addClass("list-group-item list-group-item-action")
                    .text(boxData.title);

                $("#shared-boxes").append($title).append("<br>");
            }
        })

    })

    $("#site-search").on("keyup", function (){
        const searchInput = $(this).val().toLowerCase(); // Eingabe in Kleinbuchstaben
        $('#shared-boxes a').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchInput)); // Ein-/ausblenden
        });
    })
})