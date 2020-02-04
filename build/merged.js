 
 
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

let colors = [ '#0FF', '#F61677', '#FFF', '#0F0' ];

let spriteSheet = '00011001000110010011110101000101010101100111010101100100111011100000000000110000101101111011011100000000111111110000000001000010111111111000000110111101101001011011110110111001101111011011110111111111100000011000000110000001100000011000000110000001100000010000000000000000011000101011110100010100000110000000000000000000000000000000000000011010000110100000001000010111001010100110100000100100001111010001100100000010001110010111010101100110111001010001100000100010001110110001101100101010011011000110101011101010000000000010000000110000011100000111000001110000011111001111111100000000000000000001000000111000011011000111011011111011111111110000000000000000001111000001100000011000000110000011110001111110'.split("");

let size = 10;
let base = 8;
let scale = 3;

let doors = {
    d1: { x: 0, y: 0 },
    d0: { x: 0, y: 0 }
}

let mobs = [];

let currentRoom = 0;
let maxRoom = 8;

let locked = false;
let gameOver = false;

let cargo = {
    x: 0,
    y: 0
}

let player = { 
    x: 0, 
    y: 0,
    a: 1,
    d: 0,
    h: 15,
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
        } else if (mobs.filter(e => e.x == c && e.y == r && !e.d)[0]) {
            let i = mobs.filter(e => e.x == c && e.y == r)[0].i;
            mobs[i].h -= player.a;

            if (mobs[i].h > 0) {
                console.log("a");
                console.log(mobs[i].h);
            } else {
                console.log('ded');
                mobs[i].d = 1;
                map[r * size + c] = EMPTY;
            }

            operateMobs();
        } else if (map[r * size + c] == CARGO) {
            if (d == RIGHT) {
                // console.log("SOLUNDASIN")
                if (map[r * size + c + 1] == EMPTY || map[r * size + c + 1] == DOOR0) {
                    if (map[r * size + c + 1] == DOOR0) {
                        console.log("next room");

                        if (++currentRoom > 8) {
                            gameOver = true;
                            ctx.fillStyle = '#000';
                            ctx.fillRect(0, 0, 500, 500);
                            ctx.fillStyle = '#FF0';
                            ctx.fillText("Game Over", 50, 50);
                        } else {
                            locked = true;
                            setTimeout(() => createRoom(++currentRoom), 250);
                        }
                    }
                    
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
// ---------- ./src/room.js
// ---------- 
let createRoom = level => {
    
    console.log(map);
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, 8, 8, EMPTY);

    let pos = getAvailablePos().filter(e => e.x > 2 && e.x < 7 && e.y > 1 && e.y < 8);
    mobs = [];

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
            d: 0,
            x: randPos.x,
            y: randPos.y
        }
    }

    let door1y = !level ? rand(1, 8) : player.y;
    let door0y = rand(1, 8);

    map[door1y * size + 0] = DOOR0;
    map[door0y * size + 9] = DOOR0;

    map[door1y * size + 1] = PLAYER;
    player.x = 1;
    player.y = door1y;

    map[(door1y) * size + 2] = CARGO;
    cargo.x = 2;
    cargo.y = door1y;

    doors = {
        d1: { x: 0, y: door1y },
        d0: { x: 9, y: door0y }
    }

    locked = false;
} 
// ---------- ./src/controls.js
// ---------- 
// window.addEventListener('keydown', e => {
//     if (!e.repeat) {
//         console.log('fire');
//     }
// });

window.onkeydown = e => {
    if (!e.repeat && !locked) {
        if (e.keyCode == 69) {
            player.g = 1;

            if (gameOver) {
                run();
            }
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
ctx.textBaseline = "top";
ctx.font = "bold 10px monospace";

let run = () => {
    currentRoom = 0;
    locked = false;
    gameOver = false;

    player.a = 1;
    player.d = 0;
    player.h = 15;
    player.g = 0;

    createRoom(currentRoom);
}

// drawSprite(1, 1, PLAYER, colors[0]);
// drawSprite(9, 1, DOOR1, colors[1]);
// console.log(map)

let loop = () => {
    if (!gameOver) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 500, 500);
        ctx.fillStyle = colors[2];
        ctx.fillRect(base * scale / 2, base * scale / 2, 9 * base * scale, 9 * base * scale);
        ctx.fillStyle = "#000";
        ctx.fillRect(base * scale / 2 + 2, base * scale / 2 + 2, 9 * base * scale - 4, 9 * base * scale - 4);

        map.map((e, i) => {

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

    // mobs.map(e => {
    //     if (!e.d) {
    //         ctx.fillStyle = '#000';
    //         ctx.fillRect(e.x * base * scale, e.y * base * scale - base * scale / 2, 10, 10);
    //         ctx.fillStyle = '#FF0';
    //         ctx.fillText(e.h, e.x * base * scale, e.y * base * scale - base * scale / 2);
    //     }
    // })
}
// console.log(player, mobs);

run();
setInterval(loop, 1E3 / 30);
// loop();