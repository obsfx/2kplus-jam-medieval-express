let rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

let setAreaOnArr = (x, y, w, h, value) => {
    for (let i = y; i < y + h; i++) {
        for (let j = x; j < x + w; j++) {
            map[i * size + j] = value;
        }
    }
}

let getAvailablePos = () => {
    let pos = [];
    map.map((e, i) => {
        if (e == EMPTY) {
            pos.push({
                x: i % size,
                y: Math.floor(i / size)
            })
        }
    });

    return pos;
}

let set = (c, r, o, val) => {
    map[o.y * size + o.x] = EMPTY;
    o.x = c;
    o.y = r;
    map[o.y * size + o.x] = val;
}

let operateMobs = () => {

    mobs.map((e, i) => {
        let c = player.x > e.x ? 1 : -1;
        let r = player.y > e.y ? 1 : -1;

        if (rand(0, 9) > 2 && !e.d) {
            if (map[e.y * size + e.x + c] == PLAYER || map[(e.y + r) * size + e.x] == PLAYER) {
                console.log("mob attack")
            } else if (map[e.y * size + e.x + c] == EMPTY && player.x != e.x) {
                map[e.y * size + e.x + c] = map[e.y * size + e.x];
                map[e.y * size + e.x] = EMPTY;
                mobs[i].x = e.x + c;
            } else if (map[(e.y + r) * size + e.x] == EMPTY) {
                map[(e.y + r) * size + e.x] = map[e.y * size + e.x];
                map[e.y * size + e.x] = EMPTY;
                mobs[i].y = e.y + r;
            }
        }
    })
}