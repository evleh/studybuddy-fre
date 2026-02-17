import {request_initializer} from "./bae-connect-helpers.js";
import constants from "./constants.js";

export function upload_file(options) {
    // TODO
}

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