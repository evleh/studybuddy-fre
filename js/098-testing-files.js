import {acquire_token} from "./bae-connect-token.js";
import {
    delete_uploaded_file,
    get_all_fileInfo,
    get_all_filenames,
    make_link_from_fileName,
    upload_file
} from "./bae-connect-files.js";

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

/**
 * lots of vibe here initially
 */

try {
    // here be dragons? testing upload and delete

    // first get the current number of files (both ways)
    let beforeUploadCount = {
        minIOCount: (await get_all_filenames()).length,
        infoCount: (await get_all_fileInfo()).length
    }

    const svgString = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>
`;

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    console.log(svgBlob);
    let uploadResponse1 = await upload_file({
        fileOrBlob: svgBlob,
        filename: 'testing space SVG.no.1.svg', // user provided filenames likely to contain spaces on occasion. test.
    });
    console.log(uploadResponse1)
    appendAlertDiv(`upload did not throw, returned: '${uploadResponse1.toString()}'`)

    // get the numbers of files after upload
    let afterUploadCount = {
        minIOCount: (await get_all_filenames()).length,
        infoCount: (await get_all_fileInfo()).length
    }

    // try deleting the uploaded file.
    let deleteResponse = await delete_uploaded_file(uploadResponse1.toString())
    appendAlertDiv(`delete  did not throw, returned: ${deleteResponse.toString()}`)

    // get the numbers of files after upload
    let afterDeletionCount = {
        minIOCount: (await get_all_filenames()).length,
        infoCount: (await get_all_fileInfo()).length
    }

    console.log({afterDeletionCount,afterUploadCount,beforeUploadCount})
    let numberCheckOut =
        (beforeUploadCount.minIOCount === afterDeletionCount.minIOCount ) &&
        (beforeUploadCount.infoCount === afterDeletionCount.infoCount) &&
        (beforeUploadCount.minIOCount+1 === afterUploadCount.minIOCount) &&
        (beforeUploadCount.infoCount+1 === afterUploadCount.infoCount)
    ;
    appendAlertDiv(`number of files increases by one by upload and reduces by one by deletion.`,
        numberCheckOut);

} catch(e) {
    appendAlertDiv("Dragons happened.", 'WARN')
}
