
const BACKEND_URL_BASE = 'http://localhost:8080'
const URL_USER = BACKEND_URL_BASE+"/users"
const AUTH_TOKEN_URL = BACKEND_URL_BASE+"/auth/token"
const BOXES_URL = BACKEND_URL_BASE+"/boxes"
const CARD_URL = BACKEND_URL_BASE+"/cards"
const COMMENT_URL = BACKEND_URL_BASE+"/boxcomments"


const ME_URL = BACKEND_URL_BASE+"/me"
const ME_BOXES_URL = ME_URL+"/boxes"
const ME_USERINFO_URL = ME_URL+"/self"

const PUBLIC_URL = BACKEND_URL_BASE+"/public"
const PUBLIC_BOXES_URL = PUBLIC_URL+"/boxes"

const FILE_URL = BACKEND_URL_BASE+"/api/files"
const FILE_VIEW_URL = FILE_URL+"/view"
const FILE_LIST_URL = FILE_URL+"/list"
const FILE_INFO_URL = FILE_URL+"/fileinfos"
const FILE_UPLOAD_URL = FILE_URL+"/upload"
const FILE_DELETE_URL = FILE_URL+"/delete"


const FILE_UPLOAD_REQUIRED_MULTIPART_PART_NAME = "file" // atm hardcoded in backend-endpoint.
const DEFAULT_PROFILE_PIC = "https://cdn.pixabay.com/photo/2016/06/22/21/18/cat-1474092_1280.jpg";

export const constants = {
    // urls
    BACKEND_URL_BASE, URL_USER, AUTH_TOKEN_URL, BOXES_URL, ME_URL, ME_BOXES_URL, ME_USERINFO_URL, CARD_URL,
    PUBLIC_URL, PUBLIC_BOXES_URL, COMMENT_URL, FILE_URL, FILE_VIEW_URL, FILE_LIST_URL, FILE_INFO_URL,
    FILE_UPLOAD_URL, FILE_UPLOAD_REQUIRED_MULTIPART_PART_NAME, FILE_DELETE_URL,

    // other
    DEFAULT_PROFILE_PIC
}
Object.freeze(constants); // makes constants fields read-only
export default constants;


if (!window.sb) window.sb = {}
window.sb.constants = constants;