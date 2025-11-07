
let dummyBoxes = []
let { promise:boxesHaveLoaded, resolve:boxLoadingResolve, reject:boxLoadingReject } = Promise.withResolvers()

jQuery.getJSON('../DummyData/boxes.json', (data) => {
    dummyBoxes = data;
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
                if (boxesResolved.hasOwnProperty(id)) {
                    return Promise.resolve(boxesResolved[id])
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

