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

    let t = (val == PLAYER) ? "you moved" : "package moved"; 
    logs.push(t);
}

let operateMobs = () => {
    mobs.map((e, i) => {
        let c = player.x > e.x ? 1 : -1;
        let r = player.y > e.y ? 1 : -1;
        
        if (rand(0, 9) > 4 && !e.d) {
            if (map[e.y * size + e.x + c] == PLAYER || map[(e.y + r) * size + e.x] == PLAYER) {
                player.h -= 1;
                logs.push("you took damage");
                if (player.h == 0) {
                    player.d = 1;
                    gameOver = true;
                }
            } else if (map[e.y * size + e.x + c] == EMPTY && player.x != e.x) {
                map[e.y * size + e.x + c] = e.t;
                map[e.y * size + e.x] = EMPTY;
                mobs[i].x = e.x + c;
            } else if (map[(e.y + r) * size + e.x] == EMPTY) {
                map[(e.y + r) * size + e.x] = e.t;
                map[e.y * size + e.x] = EMPTY;
                mobs[i].y = e.y + r;
            }
        }
    });
}