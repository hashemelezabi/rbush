'use strict';

var N = 1000000,
    maxFill = 16;

var stamp = 0;

console.log('number: ' + N);
console.log('maxFill: ' + maxFill);

function randBox(size) {
    var x = Math.random() * size,
        y = Math.random() * size;
    return {
        minX: x,
        minY: y,
        maxX: x + Math.random() * (size - x),
        maxY: y + Math.random() * (size - y)
    };
}

function randPoint() {
    var x = Math.random(),
        y = Math.random();
    var currStamp = stamp;
    stamp++;
    return {
        minX: x,
        minY: y,
        maxX: x,
        maxY: y,
        oid: currStamp
    };
}

function genData(N, size) {
    var data = [];
    for (var i = 0; i < N; i++) {
        data.push(randBox(size));
    }
    return data;
}

function genUnitData(N) {
    var data = [];
    for (var i = 0; i < N; i++) {
        data.push(randPoint());
    }
    return data;
}

var data = genUnitData(N);

var rbush = typeof require !== 'undefined' ? require('..') : rbush;

var tree = rbush(maxFill);

// console.time('bulk-insert 1M points in unit square');
// tree.load(data);
// console.timeEnd('bulk-insert 1M points in unit square');

console.time('insert one by one');
for (var i = 0; i < N; i++) {
    tree.insert(data[i]);
}
console.timeEnd('insert one by one');

console.time('update 1M points in unit square by distance at most 0.15')
for (var i = 0; i < N; i++) {
    var xDelta = (Math.random() * 0.2) - 0.1;
    var yDelta = (Math.random() * 0.2) - 0.1;
    var x, y;
    if (data[i].minX + xDelta > 1.0) x = 1.0;
    else if (data[i].minX + xDelta < 0.0) x = 0.0;
    else x = data[i].minX + xDelta;
    if (data[i].minY + yDelta > 1.0) y = 1.0;
    else if (data[i].minY + yDelta < 0.0) y = 0.0;
    else y = data[i].minY + yDelta;
    tree.remove(data[i]);
    var newPoint = {
        minX: x,
        minY: y,
        maxX: x,
        maxY: y
    }
    tree.insert(newPoint);
}
console.timeEnd('update 1M points in unit square by distance at most 0.15')

var queryRects = genData(1000, 0.03);

console.time('1000 searches, query rectangle size at most 0.03')
for (i = 0; i < 1000; i++) {
    tree.search(queryRects[i]);
}
console.timeEnd('1000 searches, query rectangle size at most 0.03')

