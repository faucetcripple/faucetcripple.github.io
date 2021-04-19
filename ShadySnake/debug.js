// simulated stuff coming from server page::
const initData = {
    id: 'd74g0n',
    col: rndHex(),
    x: 20,
    y: 21,
    lvl: 0,
    pcount: 0,
    //    lvl: Math.floor(Math.random() * 5),
}
console.log(`level: ${initData.lvl}`);


const debug = {
    camFollow: false,
    camPipe: false,
    edgePipe: false,
    edgeDepth: 1,
    isSnakePiped: false,
    isPlayerinContainer: false,
    autoTurn: 100,
    startSpeed: 10, // this is setup wrong in snake with speedmodolo unwired
    readout: false,
    startLength: 10,
    playerBodyDepth: 2, //body
    showInfoGrid: false, // hitboxes

}


// super state (no functions)
let SS = {
    roundStart: false,
    //    zoom: 0.75,
    lvl: initData.lvl,
    isSpawnMarked: false,
    zoom: 1,
    // snakes::
    playerAlpha: 1,

    rotTileCaseIndex: 0,
    tweenTileBool: false,
    //perl alpha toggles::
    noiseAlphaEdges: undefined, // to be wired in.
    noiseAlphaIndex: 0, // to be wired in.
    noiseAlphaGrid: false, // just init phase.
    noiseAlphaTick: false,
};
window.SS = SS; // used for console ? because im in a module?

// game design config::
let GD = {
    w: 40,
    h: 23,
    game: undefined,
    scene: undefined,
    //    lvl: initData.lvl, // because it's single player.
    prop: {
        cam: undefined,
        floor: undefined,
        player: undefined,
    },
    roundStyle: {
        edgeCol: COL.forEdge(), // can remove this for lvl arrays.
    }

}

let GOT = {
    tile: function (arr, x, y) { //unused me thinks
        return arr[x][y];
    },
    nOf: { // used for noise
        x: 0,
        y: 0,
        z: 0,
        zinc: 0.00001,
    },
    noise: function (x, y, z, o, p) {
        return getnoiseVal(x + GOT.nOf.x, y + GOT.nOf.y, z + GOT.nOf.z, o, p);
    }
}
