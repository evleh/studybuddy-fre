
import load_navbar from "./navbar-loading.js";
import './auth.js'
import {processElementsTaggedByCSSClasses} from "./util.js";
import {doDOMInjectsForUserData} from "./user.js";
import "./error-ui.js"
import {get_me_userinfo} from "./bae-connect-me.js";
import {make_link_from_fileName} from "./bae-connect-files.js";


// assume jquery loaded at this point
// also: the ready-handler-add here implies "do a side-effect only import in the html file
// like: import '../js/default-document-ready-stuff
$(document).ready(async function () {
    console.log('[dev] default document.ready() handler now executing.');
    load_navbar();

    processElementsTaggedByCSSClasses(); // note: this call does not catch stuff loaded async, like - see above - load_navbar()
    doDOMInjectsForUserData();

    try {
        let meData = await get_me_userinfo();
        if (meData.foto) {
            // v2: navbarNav
            // v1: insert-navbar-here
            $('#insert-navbar-here').append($(`
                <a class="navbar-brand ">
                    <img src="${make_link_from_fileName(meData.foto)}" alt="Profile pic" 
                        width="30" height="30"
                        class="img-fluid rounded-circle shadow-sm border"
                        >
                </a>
            `))
        }
    } catch(e) {
        // user likely not logged in
    }

});