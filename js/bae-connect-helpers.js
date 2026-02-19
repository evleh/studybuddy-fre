

export function request_initializer(options={method:'GET'}) {
    let token = sessionStorage.getItem('accessToken');
    let result = {
        method: options.method,
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    }
    if (options.body) result.body = JSON.stringify(options.body);
    return result;
}

export function request_initializer_noToken(options) {
    let normal = request_initializer(options);
    delete normal.headers.Authorization;
    return normal;
}

/**
 * reason for this function:
 *   fetch() can do multipart if the body looks like this should be done.
 *   docs (mdn) say this requires not setting a content type, because (reasons)
 *   also the body must not be JSON.stringified.
 * @param options
 * @returns {{method: string, mode: string, headers: {Authorization: string, "Content-Type": string}}}
 */
export function request_initializer_noContentType_BodyNoStringify(options) {
    let normal = request_initializer(options);
    delete normal.headers["Content-Type"];
    if (options.body) normal.body = options.body
    return normal;
}
