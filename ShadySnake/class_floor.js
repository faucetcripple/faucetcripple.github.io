class Floor {
    constructor(id, w, h, s, scene) {
        this.id = id;
        this.scene = scene;
        this.grid = [];
        // this is the tile images::
        this.gridB = undefined;
        // this is the collision data::
        this.infoGrid = undefined;
        this.pixelOrigin = {
            x: 0,
            y: 0
        };

        this.pixOff = {
            y: -((h + 0) * s),
            x: -((w) * s),
        }
        this.dim = {
            w: w,
            h: h,
            s: s,
        }
        this.createFloor();

    }

    createFloor() {
        // init the 2d array
        let mt_2DArray = [];
        for (let y = 0; y <= this.dim.h; y++) {
            mt_2DArray[y] = [undefined];

            for (let x = 0; x <= this.dim.w; x++) {
                mt_2DArray[y] = [undefined];
            }
        }
        this.gridB = mt_2DArray;

        let mt_2DArrayB = [];
        for (let y = 0; y <= this.dim.h; y++) {
            mt_2DArrayB[y] = [undefined];

            for (let x = 0; x <= this.dim.w; x++) {
                mt_2DArrayB[y] = [false];
            }
        }

        this.infoGrid = mt_2DArrayB;
        let ny = (this.dim.h / 2);
        let nx = (this.dim.w / 2);
        let tx = 0;
        let ty = 0;

        for (let y = -ny; y <= this.dim.h / 2; y += 1) {
            tx = 0;
            for (let x = -nx; x <= this.dim.w / 2; x += 1) {

                if (y == -ny && x == -nx) {
                    this.pixelOrigin = {
                        x: x * this.dim.s + this.pixOff.x,
                        y: y * this.dim.s + this.pixOff.y,
                    }
                }

                // create tile (image)
                let tmp = this.scene.add.image(x * this.dim.s + this.pixOff.x, y * this.dim.s + this.pixOff.y, 'tile_basic');
                // get turned into edge later by logic:
                // every tiles starts as floor.
                tmp.isEdge = false;

                // set tiles Properities Accordingly::
                tmp.alpha = COL.floorAlpha[SS.lvl]
                this.floorPaint(tmp, SS.lvl);

                // map out edges::
                if (y == -ny || y == this.dim.h - ny) {
                    this.writeInfo(tx, ty, true);
                    this.setUpEdge(tmp);
                } else if (x == -nx || x == this.dim.w - nx) {
                    this.writeInfo(tx, ty, true);
                    this.setUpEdge(tmp);
                }

                this.gridB[ty][tx] = tmp;
                tx++
                //this is for container - but fails; so 'okaaay'
                this.grid.push(tmp);
            }
            ty++;
            //            console.log(this.gridB);
        }
        window._C = this.scene.add.container(this.dim.w * this.dim.s, this.dim.h * this.dim.s);
        window._C.add(this.grid); // add array to container

    }

    getTile(x, y) {
        return this.gridB[y][x];
    }

    readInfo(x, y) {
        return this.infoGrid[y][x];
    }

    writeInfo(x, y, isTail = true) {
        return this.infoGrid[y][x] = isTail;
    }

    activeNoise(OctIndex = 1) {
        let fxOct = [5, 1, 5];
        for (let y = 0; y <= this.dim.h; y++) {
            for (let x = 0; x <= this.dim.w; x++) {
                this.gridB[y][x].alpha = getnoiseVal(x, y, GOT.nOf.z += GOT.nOf.zinc, fxOct[OctIndex]);
            }
        }
    }

    setUpEdge(tmp) {
        // this needs some stuff...
        // flag edge as edge:
        tmp.isEdge = true;

        // need to use the tile type switch here
        let edgeTint = COL.edges[SS.lvl];
        let edgeAlpha = 1;


        tmp.depth = debug.edgeDepth;

        tmp.tint = edgeTint;
        tmp.alpha = COL.edgeAlpha[SS.lvl];

        //plasma edges::
        //        tmp.setPostPipeline(PlasmaPostFX);

        //ghost edges::
        //        tmp.setPostPipeline(BendWaves2); // watermellon+vamp

        if (debug.edgePipe) {
            tmp.setPostPipeline(SNAKE_EDGEBEND);
        }


    };

    floorPipe(tmp) {
        /*        tmp.setPostPipeline(RBMAT);
                tmp.setPipeline(RBMAT);*/
    }

    markTile(x = 1, y = 1, color = 0xff0000) {
        this.gridB[y][x].tint = color;
    }

    floorPaint(tmp) {



        switch (SS.lvl) {

            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                tmp.tint = COL.floors[SS.lvl];
                break;
            case 10:
                tmp.tint = halp.rnd.pattern('soft_purple');
                break;
            case 20:
                tmp.tint = halp.rnd.pattern('flame_ship');
                break;
            case 30:
                tmp.tint = halp.rnd.pattern('soft_purple');
                break;
            case 40:
                tmp.tint = halp.rnd.pattern('vampire_sky');
                break;
            case 50:
                tmp.tint = Math.random() * 0xffffff;
                break;
            case 60:
                //                tmp.tint = 0x2b5c00;
                tmp.tint = 0xafb1b0;
                break;
            default:
        }




    }

    alphaTile(tmp, x, y) {
        // noise a single tile::
        tmp.alpha = getnoiseVal(x, y);
    }

    updateFloor() { // Working in here::

        if (SS.noiseAlphaTick) { // draw noise toggle.
            this.activeNoise();
        }

        if (debug.showInfoGrid) { // draw colliders::
            for (let y = 0; y <= GD.h; y++) {
                for (let x = 0; x <= GD.w; x++) {
                    if (this.infoGrid[y][x]) {
                        //mark tile if filled.
                        this.gridB[y][x].tint = 0xff0000;
                    } else {
                        this.gridB[y][x].tint = 0x4444ff;
                    }
                }
            }
        }
    }
}
