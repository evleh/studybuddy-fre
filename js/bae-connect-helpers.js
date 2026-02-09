

export function request_initializer(options={method:'GET'}) {
    //console.log(options);
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
    //console.log(result);
    return result;
}

export function request_initializer_noToken(options) {
    let normal = request_initializer(options);
    delete normal.headers.Authorization;
    return normal;
}
