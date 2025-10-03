
const BACKEND_URL_BASE = 'http://localhost:8080'
const URL_USER = BACKEND_URL_BASE+"/users"
const AUTH_TOKEN_URL = BACKEND_URL_BASE+"/auth/token"

export const constants = {
    BACKEND_URL_BASE, URL_USER, AUTH_TOKEN_URL
}
export default constants;


if (!window.sb) window.sb = {}
window.sb.constants = constants;