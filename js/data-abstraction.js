
let dummyBoxes = []
let { promise:boxesHaveLoaded, resolve:boxLoadingResolve, reject:boxLoadingReject } = Promise.withResolvers()

jQuery.getJSON('../DummyData/boxes.json', (data) => {
    dummyBoxes = data;
    for (let key of dummyBoxes.keys()) {
        dummyBoxes[key].id = dummyBoxes[key].id || key; // put array index as id in box for dummy data
    }

    boxLoadingResolve(dummyBoxes)
});



export class Boxes extends Object {
    constructor({use_dummy_data = false}={}) {
        super()
        this._config = { use_dummy_data };
        // TODO: make use_dummy_data optional
    }

    getById(id) {
        return boxesHaveLoaded.then(
            (boxesResolved) => {
                let boxesMatching = boxesResolved.filter((box) => box.id === id);
                if (boxesMatching.length > 0) {
                    return Promise.resolve(boxesMatching[0]);
                } else {
                    return Promise.reject(`no box found with id ${id}`)
                }
            }
        )
    }
    publicBoxes() {
        if (this._config.use_dummy_data) {
            return boxesHaveLoaded.then(
                (boxesResolved) => Promise.resolve(boxesResolved.filter(b=>b.public==="1"))
            )
        }
    }
}

// prep hook into globals
if (!window.sb) window.sb = {}
window.sb.boxes = new Boxes({use_dummy_data:true})

