import {
    request_initializer,
    request_initializer_noContentType_BodyNoStringify
} from "./bae-connect-helpers.js";
import constants from "./constants.js";

export function make_link_from_fileName(filename) {
    return constants.FILE_VIEW_URL+"/"+filename;
}

export function get_all_filenames() {
    // admin only
    return fetch(constants.FILE_LIST_URL, request_initializer())
        .then(response => response.json())
}

export function get_all_fileInfo() {
    // admin only
    return fetch(constants.FILE_INFO_URL, request_initializer())
        .then(response => response.json())
}

export function upload_file(options = {
    fileOrBlob:"",
    filename: "nosuchfile.svg"}
) {
    const formData = new FormData();
    formData.append(
        constants.FILE_UPLOAD_REQUIRED_MULTIPART_PART_NAME,
        options.fileOrBlob,
        options.filename
    )

    return fetch(constants.FILE_UPLOAD_URL, request_initializer_noContentType_BodyNoStringify({
        body: formData,
        method: "POST",
    }))
        .then(response => response.text())
}

export function delete_uploaded_file(filename) {
    // sending filename as part of the url opens the problem of having to encoding space, other characters.
    const full_deletion_uri = constants.FILE_DELETE_URL + "/" + encodeURIComponent(filename);
    console.log(full_deletion_uri);
    return fetch(full_deletion_uri, request_initializer({method: 'DELETE'}))
        .then(response => response.text())
}