/*
    note: with a side-effect only import no defintions here are visible outside,
    but the customElements.define stuff still counts as "has happened"
 */

const html_template_string = `
<style>
.beispiel-komponente { font-style: italic}
</style>
<template><div class="beispiel-kxxxomponente">Hello World</div></template>
`

class BeispielKomponente extends HTMLElement {
    static observedAttributes = ["color", "size"]; // from bsp at https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
    constructor() {
        // Always call super first in constructor
        super();
        this.myShadowTemplate = this.attachShadow({ mode: "open" })
        this.myShadowTemplate.innerHTML = html_template_string
    }

    connectedCallback() {
        console.log("Custom element added to page.");
        this.appendChild(cloneNode(this.myShadow,true))
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    connectedMoveCallback() {
        console.log("Custom element moved with moveBefore()");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }
}
customElements.define("beispiel-komponente", BeispielKomponente);