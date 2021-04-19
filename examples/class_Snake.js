class Snake {
    constructor(id, scene, x, y, facing, headtile, tint = 0x770077) {
        this.x = x;
        this.y = y;
        this.tint = tint;
        this.scene = scene;
        this.tilescale = 16;

        this.direction = facing;
        this.headtile = headtile;

        this.movetick = 0;
        this.movemod = 60;

        this.lastPos = {
            x: undefined,
            y: undefined,
        }


        this.needsUpdate = false;
        this.tail = [];

        this.createHead();

        this.maxLength = 13;
    }

    createHead() {
        this.head = this.scene.add.image(this.x, this.y, this.headtile).setTint(this.tint).setDepth(5).setPostPipeline(HueRotatePostFX);
        this.headFace(this.direction);
    }

    tween(tweendir) {


        if (tweendir == 'up') {

            let tweenA = this.scene.tweens.add({
                targets: this.head,
                //            angle: 90,
                //            y: this.y - 16,
                //            y: this.y - 16,
                y: this.head.y - this.tilescale,
                duration: 1000 * (this.movemod / 60),
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }

        if (tweendir == 'down') {
            let tweenA = this.scene.tweens.add({
                targets: this.head,
                //            angle: 90,
                //            y: this.y - 16,
                //            y: this.y - 16,
                y: this.head.y + this.tilescale,
                //                duration: 500,
                duration: 1000 * (this.movemod / 60),
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }
        if (tweendir == 'left') {

            let tweenA = this.scene.tweens.add({
                targets: this.head,
                //            angle: 90,
                //            y: this.y - 16,
                //            y: this.y - 16,
                x: this.head.x - this.tilescale,
                //                duration: 500,
                duration: 1000 * (this.movemod / 60),
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }

        if (tweendir == 'right') {
            let tweenA = this.scene.tweens.add({
                targets: this.head,
                //            angle: 90,
                //            y: this.y - 16,
                //            y: this.y - 16,
                x: this.head.x + this.tilescale,
                //                duration: 500,
                duration: 1000 * (this.movemod / 60),
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }


    }

    followTween(part) {

        let tweenB = this.scene.tweens.add({
            targets: part,
            //            angle: 90,
            y: this.y,
            //            y: this.y + 16,
            alpha: 1,
            duration: 500,
            ease: 'Sine.easeOut',
            yoyo: false,
            repeat: 0
        });

    }

    addPart(part) {

        let offsety = 0;

        if (this.tail.length === 0) { // first part is tail
            part = 's_tail'; // over ride the called piece
            offsety = 0;
        }

        let anglelist = { // middle piece
            up: 90,
            down: -90,
            left: 0,
            right: 180,
        }

        console.log(part);

        if (this.direction == !this.lastDirection) {

            console.log('valid turn');

            this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y + offsety, 's_turn').setTint(this.tint).setAngle(180).setAlpha(1).setPostPipeline(HueRotatePostFX).setScale(1, -1);



        } else {
            //        this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y + offsety, part).setTint(this.tint).setAngle(90).setAlpha(1);


            //        this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y + offsety, part).setTint(this.tint).setAngle(anglelist[this.direction]).setAlpha(1);

            //        this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y + offsety, part).setTint(this.tint).setAngle(anglelist[this.direction]).setAlpha(1).setPostPipeline(LazersPostFX);;
            this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y + offsety, part).setTint(this.tint).setAngle(anglelist[this.direction]).setAlpha(1).setPostPipeline(HueRotatePostFX);



        }


        this.lastDirection = this.direction;






        if (this.tail.length === 1) {
            // style the first tail peice
            this.tail[0].angle = -90;
            //            this.tail[0].setDepth(6);
            //            this.tail[0].setBlendMode(1);

        } else {
            //            this.necktween(this.tail[this.tail.length - 1])
        }
    }

    RotPart(part, angle) {
        return part.rotation = angle;
    }

    headFace() {
        //        console.log(this.direction)

        switch (this.direction) {
            case 'up':
                this.head.angle = 0;
                break;
            case 'left':
                this.head.angle = -90;
                break;
            case 'right':
                this.head.angle = 90;
                break;
            case 'down':

                this.head.angle = -180;
                break;

        }
    }

    update() {



        if (this.tail.length >= this.maxLength) {
            // if length limited deal with trailing tail piece.
            // set placement of tailend to first array obj then remove.
            this.tail[0].x = this.tail[1].x;
            this.tail[0].y = this.tail[1].y;
            this.tail[0].angle = this.tail[1].angle + 180;


            this.tail[1].destroy();
            this.tail.splice(1, 1);
        }

        //        if (this.movetick % 60 == 0) {


        if (this.movetick % this.movemod == 0) {

            this.lastPos.x = this.x;
            this.lastPos.y = this.y;


            if (this.direction == "up") {

                this.tween(this.direction);

                this.head.y = this.y;
                this.addPart('s_mid');

                this.y -= this.tilescale;

            }

            if (this.direction == "down") {

                this.tween(this.direction);

                this.head.y = this.y;
                this.addPart('s_mid');

                this.y += this.tilescale;

            }

            if (this.direction == "left") {

                this.tween(this.direction);

                this.head.x = this.x;

                if (this.needsUpdate) {
                    this.addPart('s_turn');
                } else {

                    this.addPart('s_mid');
                }


                this.x -= this.tilescale;

            }

            if (this.direction == "right") {

                this.tween(this.direction);

                this.head.x = this.x;
                this.addPart('s_mid');

                this.x += this.tilescale;

            }

            this.headFace(this.direction);

            this.needsUpdate = false;


        }

    }




}
