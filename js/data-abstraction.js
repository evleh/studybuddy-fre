
let dummyBoxes = []
jQuery.getJSON('../DummyData/boxes.json', function(data) {
    dummyBoxes = data;
});

export class Boxes extends Object {
    constructor({use_dummy_data = false}={}) {
        super()
        this._config = { use_dummy_data };
        // TODO: make use_dummy_data optional
    }

    getById(id) {
        return dummyBoxes[id] || null;
    }
    publicBoxes() {
        if (this._config.use_dummy_data) {
            return dummyBoxes.filter(b=>b.public==="1");
        }
    }
}

// prep hook into globals
if (!window.sb) window.sb = {}
window.sb.boxes = new Boxes({use_dummy_data:true})