
const BACKEND_URL_BASE = 'http://localhost:8080'
const URL_USER = BACKEND_URL_BASE+"/users"
const AUTH_TOKEN_URL = BACKEND_URL_BASE+"/auth/token"
const BOXES_URL = BACKEND_URL_BASE+"/boxes"
const ME_URL = BACKEND_URL_BASE+"/me"
const ME_BOXES_URL = ME_URL+"/boxes"
const ME_USERINFO_URL = ME_URL+"/self"


export const constants = {
    BACKEND_URL_BASE, URL_USER, AUTH_TOKEN_URL, BOXES_URL, ME_URL, ME_BOXES_URL, ME_USERINFO_URL
}
export default constants;


if (!window.sb) window.sb = {}
window.sb.constants = constants;