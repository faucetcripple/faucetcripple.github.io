// this data is for manual snake to grid alignment.
let s_adjust = {
    x: 8,
    y: 8,
}


class Snake {
    constructor(id, scene, x, y, facing, headtile, tailtile, tint, isPiped = debug.isSnakePiped, speedmod = debug.startSpeed) {

        this.isVerbose = true; // debugging
        const _THIS = this;
        this.scene = scene;

        //server properties::
        this.id = id; // server wire.

        //base properties::
        this.tint = tint;
        this.isPiped = isPiped; // PIPELINE
        this.headtile = headtile;
        this.tailtile = tailtile;

        this.alpha = SS.playerAlpha;

        // debug displayObject:
        this.readout = undefined;

        // state properties::
        this.isAlive = true;
        this.autoDrive = false;

        // statistic properties::
        this.actioncount = 0; // wire me.

        // PIXEL POS:
        this.x = ((x * 16) + -936 / 3) - s_adjust.x;
        this.y = ((y * 16) + -528 / 3) - s_adjust.y;

        //grid space::
        this.gs = {
            x: x,
            y: y,
            s: 16,
        };

        this.d = {
            ar: ['up', 'right', 'down', 'left'],
            di: facing,
            turnFlag: false,
            isCC: false, // for tail tagging when spawning for end rotation accuracy
            change: 0,
            mutate: function () {


                // reset::
                _THIS.d.isCC = false;
                _THIS.d.turnFlag = false;
                //start process inputs::
                _THIS.d.change = window.control_turn; // grab from update loop;
                //                console.log(`got data = ${window.control_turn}`);
                if (_THIS.d.change > 0) {
                    _THIS.d.turnC(); // relative right turn.

                } else if (_THIS.d.change < 0) {
                    _THIS.d.turnCC(); // realive left turn.
                }
                // reset inputs:
                window.control_turn = 0;
                _THIS.d.change = 0;
            },
            turnC: function () {
                _THIS.d.di++;
                if (_THIS.d.di >= _THIS.d.ar.length) {
                    _THIS.d.di = 0;
                }
                _THIS.d.turnFlag = true;

            },
            turnCC: function () {
                _THIS.d.di--;
                if (_THIS.d.di < 0) {
                    _THIS.d.di = _THIS.d.ar.length - 1;
                }
                _THIS.d.isCC = true;
                _THIS.d.turnFlag = true;
            },
        }

        // speed related::
        this.movetick = 0; // frame counter
        this.movemod = speedmod; // modulo of frame.
        this.speedmod = [60, 45, 40, 30, 20, 10]; // un used.

        this.lastPos = {
            x: undefined,
            y: undefined,
        }

        this.gstate = {
            // game options:
            isTrimming: true,
        }


        this.tail = []; // more aptly this is the body.

        this.maxLength = debug.startLength; // this is game stuff; no max length.

        this.fx = {
            headPulse: {
                increment: 0.01,
                maxAccumulation: 0.09, // scale or 'mock height' or zoom
                accumulation: 0,
                isOn: true,
                run: function () {
                    _THIS.head.scale += _THIS.fx.headPulse.increment;
                    _THIS.fx.headPulse.accumulation += _THIS.fx.headPulse.increment;
                    // bound range like sine wave::
                    if (_THIS.fx.headPulse.accumulation > _THIS.fx.headPulse.maxAccumulation || _THIS.fx.headPulse.accumulation <= 0) {
                        _THIS.fx.headPulse.increment *= -1;
                    }
                }
            },
            update: function () { // run all the effects that are toggled on::
                if (_THIS.fx.headPulse.isOn) {
                    _THIS.fx.headPulse.run();
                }
                //            this.sinParts('x'); // gstate experimental
            }
        }

        this.createEnds();

    }

    checkIfSelf() {
        // game mode mutator here (donuts allowed)
        if (this.tail.length > 3) {
            for (let i = 0; i < this.tail.length - 2; i++) {

                if (this.gs.x == this.tail[i].gs.x && this.gs.y == this.tail[i].gs.y) {
                    // if collision is true::
                    this.isAlive = false;
                    if (this.isVerbose) {
                        console.log(`[id:${this.id}][Collision][Self][x${this.gs.x}x|y${this.gs.y}y]`)
                    };
                    return true;
                }
            }
        }
        return false;
    }

    checkIfWall(ahead = 0, direction = this.d.di) {
        switch (direction) {
            case 0:
                if (this.gs.y - ahead == 0) {
                    //                    console.log(`top detected ${ahead}`);
                    return true;
                }
                break;
            case 1:
                if (this.gs.x + ahead == GD.w) {
                    //                    console.log(`right detected ${ahead}`);
                    return true;
                }
                break;
            case 2:
                if (this.gs.y + ahead == GD.h) {
                    //                    console.log(`bottom detected ${ahead}`);
                    return true;
                }
                break;
            case 3:
                if (this.gs.x - ahead == 0) {
                    //                    console.log(`left detected ${ahead}`);
                    return true;
                }
                break;
            default:
                return false;
        }
        return false;
    }

    checkTile() {

        let dx = 0;
        let dy = 0;

        switch (this.d.di) {
            case 0:
                dy--;
                break;
            case 1:
                dx++;
                break;
            case 2:
                dy++;
                break;
            case 3:
                dx--
                break;
        }



        if (GD.prop.floor.infoGrid[this.gs.y + dy][this.gs.x + dx]) {
            console.log(GD.prop.floor.infoGrid[this.gs.y + dy][this.gs.x + dx])
            //        if (GD.prop.floor.infoGrid[this.gs.y][this.gs.x]) {

            this.isAlive = false;
            return true;
        } else {
            return false;
        }

    }

    checkLeft(dist = 1) {
        let leftturn = this.d.di - 1;
        if (leftturn < 0) {
            leftturn = 3
        }
        return this.checkIfWall(dist, leftturn);
    }

    checkRight(dist = 1) {
        let leftturn = this.d.di + 1;
        if (leftturn >= 4) {
            leftturn = 0;
        }
        this.checkIfWall(dist, leftturn)
    }

    setSpeed(val) {
        return this.movemod = Math.floor((val * 70) + 10);
    }

    setThrottle(val) {
        let valb = 1 - val;;
        return this.movemod = Math.floor((valb * 70) + 10);
    }

    showData() {
        this.readout = this.scene.add.text(this.head.x + 16, this.head.y - 16, `testicle ${this.id}`);
        //        this.readout.font = 'VT220-mod';
    } //wip

    dataReshow() {
        this.readout.text = `id:${this.id}`;
        this.readout.x = this.head.x + 16;
        this.readout.y = this.head.y + 16;
    } //wip

    createEnds() {
        if (this.isPiped) {
            //fancy::
            //            this.head = this.scene.add.image(this.x, this.y, this.headtile).setTint(this.tint).setDepth(5).setPostPipeline(BendPostFX);
            this.head = this.scene.add.image(this.x, this.y, this.headtile).setTint(this.tint).setDepth(50).setPostPipeline(SNAKE_EDGEBEND);
            this.head.setPostPipeline(HueRotatePostFX)

            //            this.end = this.scene.add.image(this.x, this.y, this.tailtile).setTint(this.tint).setDepth(3).setPostPipeline(BendPostFX); //HueRotatePostFX
            this.end = this.scene.add.image(this.x, this.y, this.tailtile).setTint(this.tint).setDepth(3).setPostPipeline(SNAKE_EDGEBEND); //HueRotatePostFX
            this.end.setPostPipeline(HueRotatePostFX)
        } else {
            //plain::
            this.head = this.scene.add.image(this.x, this.y, this.headtile).setTint(this.tint).setDepth(50);


            this.end = this.scene.add.image(this.x, this.y, this.tailtile).setTint(this.tint).setDepth(3);

            this.end.gs = this.gs;

        }

        this.head.alpha = this.alpha;
        this.end.alpha = this.alpha;

        this.angleHead(this.d.di);
        this.angleTail(this.d.di);
    }

    headTween(tweendir) {
        // this actually moves the head.
        let tweenA = undefined;




        let timeslice = 500 / 60;
        let duration = timeslice * this.movemod;






        switch (tweendir) {
            case 0:
                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    y: this.head.y - this.gs.s,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });


                break;
            case 1:
                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    x: this.head.x + this.gs.s,
                    //                    duration: 300,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });


                break;
            case 2:


                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    y: this.head.y + this.gs.s,
                    //                    duration: 400,
                    //                    duration: duration,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });

                break;
            case 3:
                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    x: this.head.x - this.gs.s,
                    //                    duration: 500,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });


                break;
            default:
                console.log(`headTween default case hit`);
        }



    }

    addPart(part) {
        //this be old code



        let angles = [90, 180, -90, 0]
        if (this.isPiped) {
            //            this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y, part).setTint(this.tint).setAngle(angles[this.d.di]).setAlpha(1).setPostPipeline(BendPostFX);
            this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y, part).setTint(this.tint).setAngle(angles[this.d.di]).setAlpha(1).setPostPipeline(SNAKE_EDGEBEND);

            this.tail[this.tail.length - 1].setPostPipeline(HueRotatePostFX);
        } else {
            this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y, part).setTint(this.tint).setAngle(angles[this.d.di]).setAlpha(1)
        }

        if (this.d.isCC) {
            this.tail[this.tail.length - 1].setAngle(this.tail[this.tail.length - 1].angle -= 90);
        }

        if (part === 's_turn') { // hardcoded part
            this.tail[this.tail.length - 1].isC = true;
        } else {
            this.tail[this.tail.length - 1].isC = false;
        }


        if (debug.isPlayerinContainer) {
            window._C.add(this.tail[this.tail.length - 1]);
        }
        this.tail[this.tail.length - 1].setDepth(debug.playerBodyDepth);

        // imprint tag true or false for things looking for it.
        this.tail[this.tail.length - 1].isCC = this.d.isCC;


        // WIP tag with current grid data.
        this.tail[this.tail.length - 1].gs = {};
        this.tail[this.tail.length - 1].gs.x = this.gs.x;
        this.tail[this.tail.length - 1].gs.y = this.gs.y;

        this.tail[this.tail.length - 1].alpha = this.alpha;


    }

    angleHead(doit) {
        switch (doit) {
            case 0:
                this.head.angle = 0;
                break;
            case 1:
                this.head.angle = 90;
                break;
            case 2:
                this.head.angle = 180;
                break;
            case 3:
                this.head.angle = -90;
                break;

        }
    }

    angleTail(mydir) {

        switch (mydir) {
            case 0:
                this.end.angle = -90;
                break;
            case 1:
                this.end.angle = 0;
                break;
            case 2:
                this.end.angle = 90;
                break;
            case 3:
                this.end.angle = -180;
                break;
        }
    }

    mySine() {
        let rate = 5;
        let mySine = Math.sin(this.movetick) / 10;
        return mySine;
    }

    sinParts(key = 'scale') {

        let scalefactor = 100;

        this.tail.forEach(element => element[key] += (this.mySine()) * scalefactor);


    }

    bodyPlacement() {

        // the head has just mutated and needs retargeting.

        //        GD.prop.floor.writeInfo(this.gs.x, this.gs.y, false);

        this.head.y = this.lastPos.y;
        this.head.x = this.lastPos.x;

        let part = 's_mid';


        if (this.d.turnFlag) {
            part = 's_turn';
        }

        this.addPart(part);

    }

    checkTrimTail() {
        if (this.gstate.isTrimming) {
            if (this.trim_gs) { // update infogrid
                GD.prop.floor.writeInfo(this.trim_gs.x, this.trim_gs.y, false);
            }


            if (this.tail.length >= this.maxLength) { // only if its too long
                this.tailGo(this.tail[1].x, this.tail[1].y, this.tail[1].angle, this.tail[1].isCC, this.tail[1].isC);

                // put deleted block position into memory 
                this.trim_gs = this.tail[0].gs;
                // remove trail block
                this.tail[0].destroy();
                this.tail.splice(0, 1);

            }
        }
    }

    tailGo(x, y, a, isCC = false, isC = false) {
        // sets up movement tweens and rotations of tail

        if (isCC) {
            a += -90;
        } else if (isC) {

            if (a == 90) {
                a = -90;
            } else {
                a += 180;
            }
        }

        let timeslice = 500 / 60;
        let duration = timeslice * this.movemod;




        let tweenT = this.scene.tweens.add({
            targets: this.end,
            y: y,
            x: x,
            //            duration: 500,
            duration: duration,
            ease: 'Quart.easeIn', //Bounce was fun
            yoyo: false,
            repeat: 0
        });

        if (isCC || isC) {
            let tweenR = this.scene.tweens.add({
                targets: this.end,
                angle: a,
                //            duration: 500,
                duration: duration,
                ease: 'Quart.easeIn',
                yoyo: false,
                repeat: 0
            });
        }




    }

    updateGS() {
        switch (this.d.di) {
            case 0:
                this.gs.y--;
                break;
            case 1:
                this.gs.x++;
                break;
            case 2:
                this.gs.y++;
                break;
            case 3:
                this.gs.x--;
                break;
        }
    }

    updateFloorInfo() {
        GD.prop.floor.writeInfo(this.gs.x, this.gs.y, true);
    }

    death_destroyTile() {

        console.log(called);


    }

    deathSequence() {
        // this is only freshly sketched out.
        // deleting collisions too fast (first frame)


        this.head.alpha = 0; // pop noise.

        this.tail.forEach(element => GD.prop.floor.writeInfo(element.gs.x, element.gs.y, false));

        GD.prop.floor.writeInfo(this.end.gs.x, this.end.gs.y, false);
        GD.prop.floor.writeInfo(this.gs.x, this.gs.y, false);

        let d = 0;

        let dur = 100;

        let scale = 1.2;

        // zip of double end block
        this.tail[0].destroy();
        GD.prop.floor.writeInfo(this.tail[0].gs.x, this.tail[0].gs.y, false);
        this.tail[0].alpha = 0;

        this.scene.tweens.add({
            targets: this.end,
            ease: 'Sine.easeInOut',
            //            ease: 'Elastic',
            yoyo: true,
            scaleX: scale,
            scaleY: scale,
            duration: dur,
            delay: 0,
            repeat: 0,
            onComplete: function () {
                //                GD.prop.floor.writeInfo(arguments[1][0].gs.x, arguments[1][0].gs.y, false);
                //                arguments[1][0].destroy();
            },
        });

        const _THIS = this;

        function testbig() {
            if (_THIS.tail.length > 1) {
                //                        _THIS.tail[0].alpha = 0;
                _THIS.end.setDepth(10);
                _THIS.tailGo(_THIS.tail[1].x, _THIS.tail[1].y, _THIS.tail[1].angle, _THIS.tail[1].isCC, _THIS.tail[1].isC);


                // put deleted block position into memory 
                _THIS.trim_gs = _THIS.tail[0].gs;
                // remove trail block

                _THIS.tail[0].destroy();
                _THIS.tail.splice(0, 1);
                //                _THIS.tail[0].destroy();
            } else {
                _THIS.tail[0].destroy();
                _THIS.end.destroy();
            }
            //            _THIS.tail[0].alpha = 0;


        }


        // end to head.
        for (let i = 0; i < this.tail.length; i++) {
            d++;
            this.scene.tweens.add({
                targets: this.tail[i],
                ease: 'Sine.easeInOut',
                //       
                scope: window,
                ease: 'Elastic',
                yoyo: true,
                scaleX: scale,
                scaleY: scale,
                duration: dur,
                delay: i * dur,
                repeat: 0,
                onComplete: testbig,
            });
        }

        this.scene.tweens.add({
            targets: this.head,
            ease: 'Sine.easeInOut',
            //            ease: 'Elastic',
            yoyo: true,
            scaleX: scale,
            scaleY: scale,
            duration: dur,
            delay: d++ * dur,
            repeat: 0,
            onComplete: function () {
                //                GD.prop.floor.writeInfo(arguments[1][0].gs.x, arguments[1][0].gs.y, false);
                arguments[1][0].destroy();
            },
        });


    }

    captureLastFrameData() {
        this.lastPos.x = this.head.x;
        this.lastPos.y = this.head.y;
    }

    checkInputs() {
        this.d.mutate(); // get direction of movement
    }

    avoidWalls() {
        if (this.autoDrive) {
            if (this.checkIfWall(1)) {
                window.control_turn = 1
            }
        }
    }

    collisionAction() {
        console.log(`COLLISION ${this.gs.x},${this.gs.y}`);
        this.deathSequence();
        this.isAlive = false;
        this.head.alpha = 0; // pop noise. MOCK DEATH SEQUENCE
    }

    moveHead() {
        this.headTween(this.d.di); // move head
        this.angleHead(this.d.di);
    }

    update() {
        this.avoidWalls();

        if (this.isAlive) {} else {
            // exit if dead
            return
        }

        if (this.isAlive) {
            // every tick::
            this.movetick++;
            this.fx.update();
            if (this.movetick % this.movemod == 0) { // action tick::

                if (this.checkIfWall()) {
                    this.collisionAction();
                    //                    }
                } else {
                    // all normal 'action ticks'
                    // setup
                    this.actioncount++;
                    this.captureLastFrameData();
                    // mutate
                    this.checkInputs(); // find direction. d.di update.
                    // sync
                    this.updateGS(); // update movement from origin.



                    if (this.checkIfSelf()) {
                        this.angleHead(this.d.di);
                        this.collisionAction();
                        // stop head from being drawn
                        //                        return;
                    }





                    // Tell floor to create collider:
                    this.updateFloorInfo(); // writing early??

                    // redraw
                    this.moveHead();
                    this.bodyPlacement(); // place body
                    this.checkTrimTail(); // write action here. tail pos = false.
                    window.control_turn = 0;

                }

            } // Eo action tick

        } // Eo isAlive

    } // End of update

} // End of class
