import {acquire_token} from "./bae-connect-token.js";
import {get_all_fileInfo, get_all_filenames, make_link_from_fileName} from "./bae-connect-files.js";

/**
 * output convenience functions
 */

function string2cssClassAndRole(str) {
    let kind = str?.toUpperCase?.() ?? (str?'OK':'ERROR');
    if (str === undefined) kind = 'OK';
    switch(kind) {
        case "OK": return 'class="alert alert-success" role="alert"';
        case "ERROR": return 'class="alert alert-danger" role="alert"';
        case "INFO": return 'class="alert alert-info" role="alert"';
        case "WARN": return 'class="alert alert-warning" role="alert"';
        default: return 'class="alert alert-primary" role="alert"';
    }
}
function appendAlertDiv(msg, kind) {
    const custom_style = 'padding-top: 0.25em; padding-bottom: 0.25em;'
    $('#test-results-output-col').append(`<div ${string2cssClassAndRole(kind)} style="${custom_style}">${msg}</div>`);
}

/**
 * this ... simplifies ... things.
 */
async function acquire_default_admin_token() {
    return await acquire_token({username: 'admin', password: 'admin'});
}

/**
 * Main code path starts here
 */

let tokenRes = await acquire_default_admin_token()
//console.log(tokenRes);
appendAlertDiv('token request did not fail throwing.')

try {
    let listAllFilesResponse = await get_all_filenames();
    appendAlertDiv(`all filenames endpoint did not throw (for admin)`);
    // listAllFilesResponse = {asdf:'asdf'}; // uncomment for testing the test
    appendAlertDiv(
        `all filenames endpoint returned something that has a length (n=${listAllFilesResponse?.length})`,
        listAllFilesResponse.hasOwnProperty('length')
        );
    // try showing the first 100 files
    try {
        let collectEmbedsUrls = []
        for (let i = 0; i < 100 && i < listAllFilesResponse.length; i++) {
            let filename = listAllFilesResponse[i];
            //appendAlertDiv(`${filename}`);
            collectEmbedsUrls.push(make_link_from_fileName(filename))
        }
        //console.log(collectEmbedsVar);
        let collectEmbedTags = collectEmbedsUrls.map((fileUrl) => `
            <img src="${fileUrl}" class="img-thumbnail" style="max-height: 3em; max-width: 3em" alt="your ${fileUrl} here">
        `)
        appendAlertDiv(collectEmbedTags.join(" "))

    } catch(e) {
        appendAlertDiv(`throwing happend in a try block for inserting image links in all filenames endpoint`, 'ERROR')
    }

} catch(e) {
    appendAlertDiv(`all filenames endpoint *did*  throw (for admin)`, 'ERROR');

}

/**
 * same for other endpoint
 */
try {
    let listAllFileInfoResponse = await get_all_fileInfo();
    appendAlertDiv(`all fileINFO endpoint did not throw (for admin)`);
    appendAlertDiv(
        `all fileINFO endpoint returned something that has a length (n=${listAllFileInfoResponse?.length})`,
        listAllFileInfoResponse.hasOwnProperty('length')
    );
    // try showing the first 100 files
    try {
        let collectEmbedsUrls = []
        for (let i = 0; i < 100 && i < listAllFileInfoResponse.length; i++) {
            let filename = listAllFileInfoResponse[i].fileName;
            //appendAlertDiv(`${filename}`);
            collectEmbedsUrls.push(make_link_from_fileName(filename))
        }
        //console.log(collectEmbedsVar);
        let collectEmbedTags = collectEmbedsUrls.map((fileUrl) => `
            <img src="${fileUrl}" class="ximg-thumbnail" style="max-height: 3em; max-width: 3em"  alt="your ${fileUrl} here">
        `)
        appendAlertDiv(collectEmbedTags.join(" "))

    } catch(e) {
        appendAlertDiv(`throwing happend in a try block for inserting image links for fileINFO endpoint`, 'ERROR')
    }

} catch(e) {
    appendAlertDiv(`all fileINFO endpoint *did*  throw (for admin)`, 'ERROR');

}