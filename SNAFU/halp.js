let halp = {
    tint: {
        arr: function (arr, val) {
            arr.forEach(element => element.tint = val);
            return halp;
        },
        arrPattern: function (arr, key = 'chess') {
            arr.forEach(element => element.tint = halp.rnd.pattern(key));
            return halp;
        },

    },
    color: {

        patterns: {
            chess: [0x141414, 0xcccccc],
            soft_purple: [0x7f5fa8, 0x8b4989, 0xd8b8bd, 0x6d77ac, 0xe3e2f0],
            flame_ship: [0xfd7300, 0xff8100, 0xff9a00, 0xffc100, 0xfff400],
            vampire_sky: [0xff2f2f, 0xe53535, 0xb81d1d, 0xab1616, 0x740707]
        },
        skin: [0x8d5524, 0xc68642, 0xe0ac69, 0xf1c27d, 0xffdbac],
        opts: {

        },
        rnd0x: function () {
            return Math.random() * 0xffffff;
        },
        rndSkin: function () {
            return halp.rnd.element(halp.color.skin);
        }
    },
    rnd: {
        hex: function () {
            return halp.color.rnd0x;
        },
        index: function (arr) {
            return Math.floor(Math.random() * arr.length);
        },
        element: function (arr) {
            return arr[halp.rnd.index(arr)];
        },
        pattern: function (key = 'chess') {
            return halp.rnd.element(halp.color.patterns[key]);
        },
    }
}
