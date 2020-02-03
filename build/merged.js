 
 
// ---------- ./src/vars.js
// ---------- 
let PLAYER = 0;
let CARGO = 1;

let DOOR0 = 2;
let DOOR1 = 3;

let MOB0 = 4;
let MOB1 = 5;
let MOB2 = 6;
let MOB3 = 7;

let MISC0 = 8;
let MISC1 = 9;
let MISC2 = 10;

let CORPSE = 11;

let WALL = 98;
let EMPTY = 99;

let LEFT = 0;
let RIGHT = 1;
let UP = 2;
let DOWN = 3;

// -------------------

let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

let map = new Array(100).fill(EMPTY);

let colors = [ '#0BF8F1', '#F61677', '#FFF', '#0F0' ];

let spriteSheet = '000110010001100100111101010001010101011001110101011001001110111000000000001100001011011110110111000000001111111100000000010000101111111110000001101111011010010110111101101110011011110110111101111111111000000110000001100000011000000110000001100000011000000100000000000000000110001010111101000101000001100000000000000000000000000000000000000110100001101000000010000101110010101001101000001001000011110100011001000000100011100101110101011001101110010100011000001000100011101100011011001010100110110001101010111010100000000000100000001100000111000001110000011100000111110011111111000000000000000000010000001110000110110001110110111110111111111100000000000000000011110000011000000110000001100000111100011111100000000000000000000000100000110001000100001010000111110110110111'.split("");

let size = 10;
let base = 8;
let scale = 3;

let currentRoom = {
    d1: { x: 0, y: 0 },
    d0: { x: 0, y: 0 },
    m: [ ]
}

let mobs = [];

let cargo = {
    x: 0,
    y: 0
}

let player = { 
    x: 0, 
    y: 0,
    g: 0,

    m: (c, r, d) => {
        if (map[r * size + c] == EMPTY) {
            set(c, r, player, PLAYER);

            if (player.g) {
                if (d == RIGHT && player.x - 2 == cargo.x && player.y == cargo.y) {
                    set(player.x - 1, player.y, cargo, CARGO);
                }

                if (d == LEFT && player.x + 2 == cargo.x && player.y == cargo.y) {
                    set(player.x + 1, player.y, cargo, CARGO);
                }

                if (d == UP && player.x == cargo.x && player.y + 2 == cargo.y) {
                    set(player.x, player.y + 1, cargo, CARGO);
                }

                if (d == DOWN && player.x == cargo.x && player.y - 2 == cargo.y) {
                    set(player.x, player.y - 1, cargo, CARGO);
                }
            }

            operateMobs();
        } else if (mobs.filter(e => e.x == c && e.y == r)[0]) {
            console.log('attack');
            operateMobs();
        } else if (map[r * size + c] == CARGO) {
            if (d == RIGHT) {
                // console.log("SOLUNDASIN")
                if (map[r * size + c + 1] == EMPTY) {
                    set(c + 1, r, cargo, CARGO);
                    set(c, r, player, PLAYER);
                }
            }
            
            if (d == LEFT) {
                // console.log("SAĞINDASIN")
                if (map[r * size + c - 1] == EMPTY) {
                    set(c - 1, r, cargo, CARGO);
                    set(c, r, player, PLAYER);
                }
            }
            
            if (d == UP) {
                // console.log("ALTINDASIN")
                if (map[(r - 1) * size + c] == EMPTY) {
                    set(c, r - 1, cargo, CARGO);
                    set(c, r, player, PLAYER);
                }
            }
            
            if (d == DOWN) {
                // console.log("ÜSTÜNDESİN")
                if (map[(r + 1) * size + c] == EMPTY) {
                    set(c, r + 1, cargo, CARGO);
                    set(c, r, player, PLAYER);
                }
            }
        }
    },
}; 
// ---------- ./src/util.js
// ---------- 
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

        if (rand(0, 9) > 2) {
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
// ---------- ./src/room.js
// ---------- 
let createRoom = () => {
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, 8, 8, EMPTY);

    let pos = getAvailablePos().filter(e => e.x > 1 && e.x < 8 && e.y > 1 && e.y < 8);

    for (let i = 0; i < rand(3, 5); i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        map[randPos.y * size + randPos.x] = rand(MISC0, MISC2);
    }

    for (let i = 0; i < rand(1, 4); i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        map[randPos.y * size + randPos.x] = rand(MOB0, MOB3);
        mobs[mobs.length] = {
            i: mobs.length,
            h: 10,
            k: 0,
            x: randPos.x,
            y: randPos.y
        }
    }

    let door1y = rand(1, 6);
    let door0y = rand(1, 7);

    map[door1y * size + 0] = DOOR1;
    map[door0y * size + 9] = DOOR0;

    map[door1y * size + 1] = PLAYER;
    player.x = 1;
    player.y = door1y;

    map[(door1y + 1) * size + 1] = CARGO;
    cargo.x = 1;
    cargo.y = door1y + 1;

    currentRoom = {
        d1: { x: 0, y: door1y },
        d0: { x: 9, y: door0y },
        m: map
    }
} 
// ---------- ./src/controls.js
// ---------- 
// window.addEventListener('keydown', e => {
//     if (!e.repeat) {
//         console.log('fire');
//     }
// });

window.onkeydown = e => {
    if (!e.repeat) {
        if (e.keyCode == 69) {
            player.g = 1;
        }

        //right
        /*|| e.keyCode == 68*/
        if (e.keyCode == 39) {
            player.m(player.x + 1, player.y, RIGHT);
        } else if (e.keyCode == 37 /*|| e.keyCode == 65*/) {
            //left
            player.m(player.x - 1, player.y, LEFT);
        } else if (e.keyCode == 38 /*|| e.keyCode == 87*/) {
            //up
            player.m(player.x, player.y - 1, UP);
        } else if (e.keyCode == 40 /*|| e.keyCode == 83*/) {
            //down
            player.m(player.x, player.y + 1, DOWN);
        }
    }
}

window.onkeyup = e => {
    if (!e.repeat) {
        if (e.keyCode == 69) {
            player.g = 0;
        }
    }
} 
// ---------- ./src/sprites.js
// ---------- 
let drawSprite = (x, y, index, color) => {
    for (let i = 0; i < 64; i++) {
        if (spriteSheet[index * 64 + i] != "0") ctx.fillStyle = color;
        else ctx.fillStyle = '#000';

        let _x = (i % base) * scale + x * scale * base;
        let _y = Math.floor(i / base) * scale + y * scale * base;
        ctx.fillRect(_x, _y, scale, scale);
        // let _x = i % base + x;
        // let _y = Math.floor(i / base) + y;
        // console.log(spriteSheet[index * 64 + i], _x, _y);
    }
} 
// ---------- ./src/main.js
// ---------- 
//MedEx medival express

createRoom();

// drawSprite(1, 1, PLAYER, colors[0]);
// drawSprite(9, 1, DOOR1, colors[1]);
// console.log(map)

let loop = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = colors[2];
    ctx.fillRect(base * scale / 2, base * scale / 2, 9 * base * scale, 9 * base * scale);
    ctx.fillStyle = "#000";
    ctx.fillRect(base * scale / 2 + 2, base * scale / 2 + 2, 9 * base * scale - 4, 9 * base * scale - 4);

    currentRoom.m.map((e, i) => {

        if (e != EMPTY) {
            let color = colors[2];

            if (e == PLAYER) color = colors[0];
            if (e == CARGO) color = colors[3];
            if (e > 3 && e < 8) color = colors[1];

            if (e != WALL) drawSprite(i % 10, Math.floor(i / 10), e, color);
        } else {
            ctx.fillStyle = '#666';
            ctx.fillRect(i % 10 * base * scale + base, Math.floor(i / 10) * base * scale + base, scale, scale);
        }
    });
}
console.log(player, mobs);

setInterval(loop, 1E3 / 30);
// loop();