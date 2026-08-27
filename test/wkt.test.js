'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var vm = require('vm');

var html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
var match = html.match(/<script type="text\/javascript">([\s\S]*)<\/script>/);
assert.ok(match, 'index.html 应包含主脚本');

function mockEl() {
    return {
        value: '',
        textContent: '',
        title: '',
        classList: { add: function () {}, remove: function () {}, toggle: function () { return false; } },
        addEventListener: function () {},
        setAttribute: function () {},
        closest: function () { return { style: {} }; }
    };
}

var sandbox = {
    document: {
        getElementById: function () { return mockEl(); },
        createElement: function () { return mockEl(); },
        body: { appendChild: function () {}, removeChild: function () {} }
    },
    window: { addEventListener: function () {} },
    TMap: {
        LatLng: function (lat, lng) {
            this.lat = Number(lat);
            this.lng = Number(lng);
            this.getLat = function () { return this.lat; };
            this.getLng = function () { return this.lng; };
        }
    }
};
vm.createContext(sandbox);
vm.runInContext(match[1], sandbox);
var parseInputToPathList = sandbox.parseInputToPathList;
var serializePaths = sandbox.serializePaths;
var formatOutput = sandbox.formatOutput;

var SAMPLE_WKT = 'POLYGON ((113.876491 22.471723, 113.879306 22.472951, 113.879056 22.476129, 113.876491 22.471723))';

function ringLngLat(paths) {
    return paths.map(function (p) {
        return [p.lng, p.lat];
    });
}

var pathList = parseInputToPathList(SAMPLE_WKT, 'wkt');
assert.strictEqual(pathList.length, 1);
assert.strictEqual(pathList[0].length, 4);
assert.strictEqual(pathList[0][0].lng, 113.876491);
assert.strictEqual(pathList[0][0].lat, 22.471723);
assert.strictEqual(pathList[0][1].lng, 113.879306);
assert.strictEqual(pathList[0][1].lat, 22.472951);

var serialized = serializePaths(pathList[0]);
var wktOut = formatOutput(serialized, 'wkt');
assert.ok(/^POLYGON \(\(/.test(wktOut));
assert.ok(wktOut.indexOf('113.876491 22.471723') !== -1);
assert.ok(wktOut.indexOf('113.879306 22.472951') !== -1);

var roundTrip = parseInputToPathList(wktOut, 'wkt');
assert.deepStrictEqual(ringLngLat(roundTrip[0]), ringLngLat(pathList[0]));

var quoted = parseInputToPathList("'" + SAMPLE_WKT + "'", 'wkt');
assert.strictEqual(quoted[0][0].lng, 113.876491);

var ewkt = parseInputToPathList('SRID=4326;' + SAMPLE_WKT, 'wkt');
assert.strictEqual(ewkt[0][2].lat, 22.476129);

var multi = parseInputToPathList(
    'MULTIPOLYGON (((113 22, 114 22, 114 23, 113 22)), ((115 22, 116 22, 116 23, 115 22)))',
    'wkt'
);
assert.strictEqual(multi.length, 2);
assert.strictEqual(multi[1][0].lng, 115);

var hole = parseInputToPathList(
    'POLYGON ((0 0, 4 0, 4 4, 0 4, 0 0), (1 1, 2 1, 2 2, 1 2, 1 1))',
    'wkt'
);
assert.strictEqual(hole[0].length, 2);
assert.strictEqual(hole[0][1][0].lng, 1);
assert.ok(formatOutput(serializePaths(hole[0]), 'wkt').indexOf('(1 1, 2 1') !== -1);

assert.throws(function () {
    parseInputToPathList(SAMPLE_WKT, 'geojson');
});
assert.throws(function () {
    parseInputToPathList('{"type":"Polygon","coordinates":[[[113,22],[114,22],[114,23],[113,22]]]}', 'wkt');
});

var geojsonPaths = parseInputToPathList(
    '{"type":"Polygon","coordinates":[[[113,22],[114,22],[114,23],[113,22]]]}',
    'geojson'
);
assert.strictEqual(formatOutput(serializePaths(geojsonPaths[0]), 'geojson').indexOf('"type": "Polygon"') !== -1, true);

console.log('wkt tests passed');
