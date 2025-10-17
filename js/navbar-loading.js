import {processElementsTaggedByCSSClasses} from "./util.js";

export default function load_navbar() {
    $('#insert-navbar-here').load(
        '../htmls/000-navbar.html',
        function(...params){ processElementsTaggedByCSSClasses() }
    );
}