
import load_navbar from "./navbar-loading.js";
import './auth.js'
import {processElementsTaggedByCSSClasses} from "./util.js";
import {doDOMInjectsForUserData} from "./user.js";
import "./error-ui.js"
import "./data-abstraction.js"


// assume jquery loaded at this point
// also: the ready-handler-add here implies "do a side-effect only import in the html file
// like: import '../js/default-document-ready-stuff
$(document).ready(function() {
    console.log('[dev] default document.ready() handler now executing.');
    load_navbar();

    processElementsTaggedByCSSClasses(); // note: this call does not catch stuff loaded async, like - see above - load_navbar()
    doDOMInjectsForUserData();
});