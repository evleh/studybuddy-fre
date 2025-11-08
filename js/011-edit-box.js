import constants from "./constants.js";

$(document).ready(function() {

    // get query-parameters from url
    const params = new URLSearchParams(window.location.search);
    const boxId = params.get("id")
    console.log(boxId)

    $.ajax({
        method: "GET",
        url: constants.BOXES_URL + "/" + boxId,
        dataType: "json",
        headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
        success:function (data){
            console.log(data);
            renderBox(data);
        },
        error: function (){ // Todo: ordentlich machen wenn request nicht durchgeht
            console.log("error")
        }
    })

});


function renderBox(){}