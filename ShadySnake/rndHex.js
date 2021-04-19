// nice little ditty; all but first function required for this.rnd.hex();

const hexLib = {
    normalTo255: function (val = 0) {
        return val *= 255;
    },
    hexDouble: function (val = 0) {
        if (val < 16) {
            return `0${val.toString(16)}`;
        } else {
            return val.toString(16);
        }
    },
    rnd: {
        hex: function () {
            let hexString = ``;
            for (let i = 0; i < 3; i++) {
                hexString += hexLib.rnd.hexDouble();
            }
            return `0x` + hexString;
        },
        hexDouble: function () {
            return hexLib.hexDouble(hexLib.rnd.r255());

        },
        r255: function () {
            return Math.floor(Math.random() * 256);
        },
    }

}


function rndHex() {
    return `0x${Math.floor(Math.random()*256).toString(16)}${Math.floor(Math.random()*256).toString(16)}${Math.floor(Math.random()*256).toString(16)}`;
}

//console.log(rndHex());
