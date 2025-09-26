
const BACKEND_URL_BASE = 'http://localhost:8080'
const URL_USER = BACKEND_URL_BASE+"/users"

export const constants = {
    BACKEND_URL_BASE, URL_USER
}
export default constants;


if (!window.sb) window.sb = {}
window.sb.constants = constants;