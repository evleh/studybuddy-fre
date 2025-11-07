import {test} from 'node:test';
import assert from 'node:assert';
import {dummyBoxes, dummyBoxesPromise} from './push-dummy-data.mjs'

test('test: dummyBoxes is an object', (t) => {
    console.log(typeof dummyBoxes);
    assert(dummyBoxes !== undefined && dummyBoxes !== null && typeof dummyBoxes === 'object');
})

test('test: waiting for dummyBoxes promise gives an array either way', (t) => {
    dummyBoxesPromise
        .then((boxes) => {
            assert(boxes instanceof Array);
            return boxes;
        })
        .catch((boxes) => {
            assert(boxes instanceof Array);
            return boxes;
        })
    ;
})

test('dummyBoxes load without error and there is > 0 items', (t) => {
    dummyBoxesPromise
        .then((boxes) => {
            assert(boxes.length > 0);
            return boxes;
        })
        .catch((boxes) => {
            assert(false); return boxes;
        });
})

test('all dummyboxes have a title', (t) => {
    dummyBoxesPromise.then((boxes) => {
        for (const box of boxes) {
            assert(box.hasOwnProperty('title'));
        }
    })
})