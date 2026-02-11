function setMainHeading(text) {
    $('#main-h1-element').text(text)
}

function htmlForLinkButtonToBox(box) {
    return `<a href="?id=${box.id}" class="btn btn-primary m-1">${box.title}</a>`
}

function htmlForBasicBoxDisplayCard(box, options = {}) {
    let result = [
        `<div class="card mb-2">`,
        `   <div class="card-header">${box.title}</div>`,
        `   <div class="card-body">`,
        `       <div>Eine öffentliche Lernkartei von ${box.author}</div>`,
        `       <p class="card-text"><small class="text-body-secondary">Last updated ${box.date}</small></p>`,
        (options.withLink) ? htmlForLinkButtonToBox(box) : "",
        `   </div>`,
        `</div>`
    ].join('')
    return result;
}

function show_box_or_boxes() {
    let id_as_requested_by_queryParams = null
    let params = new URLSearchParams(window.location.search)
    id_as_requested_by_queryParams = params.get('id');

    // check if box with id is ... gettable. do list otherwise
    window.sb.boxes.getById(id_as_requested_by_queryParams)
        .then((box) => {
            $('#div-for-box-contents').html(htmlForBasicBoxDisplayCard(box));
            setMainHeading("")
        })
        .catch((errormessage) => {
            console.log(errormessage); // writing the error to console might be unnecessary because
            // let us do a box list instead
            setMainHeading('Öffentliche Lernkarteien')


            window.sb.boxes.publicBoxes()
                .then((boxes) => {
                    for (let key of boxes.keys()) {
                        let box = boxes[key]
                        $("#div-for-box-links").append(htmlForBasicBoxDisplayCard(box, {withLink: true}))
                    }
                })
        })
}

$(document).ready(() => {
    show_box_or_boxes()
});