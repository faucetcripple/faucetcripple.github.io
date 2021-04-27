// debug level
function syncDebugText(_S) {

    debug.text.setText([
            'id:' + _S.id,
            'x: ' + _S.gs.x,
            'y: ' + _S.gs.y,
//            'sx:' + _S.gs.spx,
//            'sy:' + _S.gs.spy,
        ]);
    debug.text.x = _S.head.x - 100;
    debug.text.y = _S.head.y - 45;
    debug.text.setDepth(8);
}


function markSpawns() {
    // debug function marking spawns::
    if (SS.isSpawnMarked) {
        // the true formula of 4x spawn.
        // SPAWN MARKING
        // spawn 1:
        GD.prop.floor.markTile(2, Math.ceil(GD.h / 2), spawnColours[0]);
        // spawn 2:
        GD.prop.floor.markTile(GD.w - 2, Math.floor(GD.h / 2), spawnColours[1]);
        // spawn 3:
        GD.prop.floor.markTile(Math.floor(GD.w / 2), 2, spawnColours[2]);
        // spawn 4:
        GD.prop.floor.markTile(Math.ceil(GD.w / 2), GD.h - 2, spawnColours[3]);
    }
}
