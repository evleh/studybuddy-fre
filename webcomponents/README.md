# mdn on webcomponents

[Hauptseite](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)  
[Erstes "vollständiges" Beispiel](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#shadow_dom_and_custom_elements)  

# mdn beispiele

[github repo mit bsps](https://github.com/mdn/web-components-examples)
[]

# webcomponents im lecture-moodle

Es gibt n >= 1 Links zu Tutorialvideos iirc.

# zutaten

- eine Javascript Klasse "extends HTMLElement" mit constructor und "connectedCallback" methode
- den Registriere-Die-Klasse-Beim-Browser call. Bsps: `customElements.define("name-des-tags", NameDerKlasse);`
- wenn ich das html mit dem ich das custom-tag aufbaue in einen template string, außerhalb der klasse gebe, kann das ganz ok sein vom syntax-highlighting der IDE.
- das html durch das <mein-eigenes-tag /> dann ersetzt wird, wird von einem <template> tag umhüllt

# notes

- ich kann <style> tags einbauen. das auch immer dort definiert wird hat keine auswirkungen auf den rest des "DOMs"