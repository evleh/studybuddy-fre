/*
    note: with a side-effect only import no defintions here are visible outside,
    but the customElements.define stuff still counts as "has happened"
 */

class BeispielKomponente extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        // there a more lifecycle things to explore here.
        // but one way to use it is to just put stuff into the "shadowRoot"
        // this.shadowRoot.innerHTML = '<img src="../img/placeholderimgs/eigenekarteien.jpg" class="img-fluid" />';

        // note: the shadow dom needs the same link-ref to bootstrap as the main html to "feel" the css
        // it is nevertheless only loaded once (in my tests)
        this.shadowRoot.innerHTML = `
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

            <figure class="figure">
                <img src="../img/placeholderimgs/eigenekarteien.jpg" class="figure-img img-fluid rounded" alt="...">
                <figcaption class="figure-caption">A caption for the above image.</figcaption>
            </figure>`
    }
}

customElements.define("beispiel-komponente", BeispielKomponente);