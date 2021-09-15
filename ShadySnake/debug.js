// simulated stuff coming from server page::
const initData = {
    id: 'd74g0n',
    col: rndHex(),
    x: 20,
    y: 21,
    lvl: 8,
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
    startLength: 2,
    playerBodyDepth: 2, //body
    showInfoGrid: false, // hitboxes

}


// super state (no functions)
let SS = {
    roundStart: false,
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
        camBend: undefined,
        camElevator: undefined,
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

// event manager::
let EVE = {
    tickShort: 0,
    tockLong: 0,
    cycle: 100,
    increment: function () {
        EVE.tickShort++;
        if (EVE.tickShort > EVE.cycle) {
            EVE.tickShort = 1;
            EVE.tockLong++;
            console.log(`long + ${EVE.tockLong}`);
        }
    },
    update: function () {
        EVE.increment();
        EVE.events();
    },
    getSin: function () {
        return Math.abs(Math.sin(EVE.tickShort) / 100);
    },
    zonkZoom: function () {

        //        GD.prop.cam.setZoom(EVE.getSin() - 5);

    },
    events: function () {
        switch (EVE.tockLong) {
            case 0:
                EVE.zonkZoom();
                break;
            case 1:
                SS.noiseAlphaTick = true;

                break;
            case 2:
                SS.rotTileCaseIndex = 2;
                break;
            case 3:
                SS.tweenTileBool = true;
                break;

        }
    }
}
