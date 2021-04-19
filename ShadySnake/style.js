//let spawnColours = [0xffff00, 0x00ec37, 0xff004e, 0xa14265]
let spawnColours = [0xffff00, 0x00ec37, 0xff004e, 0x2222ff];

// game pallettes
var COL = {
    backdrop: ['backdrop_space', 'backdrop_space', 'backdrop_space'],

    edges: [0x007737, 0xffff00, 0x00ec37, 0xff004e, 0x2222ff],
    edgeAlpha: [1, 1, 1, 0.5],

    floors: [0x999999, 0x222222, 0x000000, 0x22ae44],
    floorAlpha: [1, 0.5, 0, 0.25, 1],
    floorImage: ['tile_basic',
        'tile_basic',
        'tile_basic',
        'tile_basic'],
    forEdge: function () {
        return COL.edges[Math.floor(Math.random() * COL.edges.length)];
    },
    bright: {
        yellow: 0xa2ad6c,
        red: 0xa14265,
    },
    spawn: {

    },
    snakes: [0xecec37, 0x00ec37, 0xff004e, 0x2222ff, 0x392766]
}
//window.COL = COL;
