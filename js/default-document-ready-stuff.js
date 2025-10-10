import load_navbar from "./navbar-loading.js";
import './auth.js'

// assume jquery loaded at this point
// also: the ready-handler-add here implies "do a side-effect only import in the html file
// like: import '../js/default-document-ready-stuff
$(document).ready(function() {
    console.log('default document ready stuff initialized');
    load_navbar();

});