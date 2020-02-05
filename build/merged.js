 
 
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

let map = new Array(144).fill(EMPTY);

let colors = [ '#0FF', '#F61677', '#FFF', '#0F0' ];

let spriteSheet = '00011001000110010011110101000101010101100111010101100100111011100000000000110000101101111011011100000000111111110000000001000010111111111000000110111101101001011011110110111001101111011011110111111111100000011000000110000001100000011000000110000001100000010000000000000000011000101011110100010100000110000000000000000000000000000000000000011010000110100000001000010111001010100110100000100100001111010001100100000010001110010111010101100110111001010001100000100010001110110001101100101010011011000110101011101010000000000010000000110000011100000111000001110000011111001111111100000000000000000001000000111000011011000111011011111011111111110000000000000000001111000001100000011000000110000011110001111110'.split("");

let size = 12;
let base = 8;
let scale = 3;

let doors = {
    d1: { x: 0, y: 0 },
    d0: { x: 0, y: 0 }
}

let mobs = [];

let mobd = [
    { a: 1, h: 2 },
    { a: 1, h: 3 },
    { a: 1, h: 4 },
    { a: 2, h: 4 }
]

let levels = [
    { r: MOB0, m: 3 },
    { r: MOB0, m: 3 },
    { r: MOB0, m: 3 },
    { r: MOB1, m: 2 },
    { r: MOB1, m: 2 },
    { r: MOB1, m: 3 },
    { r: MOB2, m: 3 },
    { r: MOB2, m: 4 },
    { r: MOB2, m: 5 },
    { r: MOB2, m: 3 },
    { r: MOB3, m: 3 },
    { r: MOB1, m: 3 },
    { r: MOB1, m: 4 },
    { r: MOB2, m: 5 },
    { r: MOB3, m: 5 },
]

let currentRoom;

let locked;
let gameOver = true;
let logs = [];
let initial = true;

let cargo = {
    x: 0,
    y: 0
}

let player = { 
    x: 0, 
    y: 0,
    a: 1,
    d: 0,
    h: 45,
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
            let i = mobs.filter(e => e.x == c && e.y == r && !e.d)[0].i;
            mobs[i].h -= player.a;
            logs.push("you attacked");
            if (mobs[i].h < 1) {
                mobs[i].d = 1;
                map[r * size + c] = EMPTY;
                logs.push("you killed a creature");
            }

            operateMobs();
        } else if (map[r * size + c] == CARGO) {
            if (d == RIGHT) {
                // console.log("SOLUNDASIN")
                if (map[r * size + c + 1] == EMPTY || map[r * size + c + 1] == DOOR0) {
                    if (map[r * size + c + 1] == DOOR0) {

                        if (++currentRoom > levels.length - 1) {
                            gameOver = true;          
                        } else {
                            locked = true;
                            logs.push("next room");
                            setTimeout(() => createRoom(currentRoom), 250);
                        }
                    }
                    
                    set(c + 1, r, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
                }
            }
            
            if (d == LEFT) {
                // console.log("SAĞINDASIN")
                if (map[r * size + c - 1] == EMPTY) {
                    set(c - 1, r, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
                }
            }
            
            if (d == UP) {
                // console.log("ALTINDASIN")
                if (map[(r - 1) * size + c] == EMPTY) {
                    set(c, r - 1, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
                }
            }
            
            if (d == DOWN) {
                // console.log("ÜSTÜNDESİN")
                if (map[(r + 1) * size + c] == EMPTY) {
                    set(c, r + 1, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
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
// ---------- ./src/room.js
// ---------- 
let createRoom = level => {
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, size - 2, size - 2, EMPTY);

    let pos = getAvailablePos().filter(e => e.x > 2 && e.x < 7 && e.y > 1 && e.y < 8);
    mobs = [];
    let miscc = rand(3, 6);
    for (let i = 0; i < miscc; i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        map[randPos.y * size + randPos.x] = rand(MISC0, MISC2);
    }

    let mobc = rand(levels[currentRoom].m, 6);
    for (let i = 0; i < mobc; i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        let rmob = levels[currentRoom].r;
        // console.log(mobd[rmob - MOB0], rmob);
        map[randPos.y * size + randPos.x] = rmob;
        mobs[mobs.length] = {
            i: mobs.length,
            t: rmob,
            h: mobd[rmob - MOB0].h,
            a: mobd[rmob - MOB0].d,
            d: 0,
            x: randPos.x,
            y: randPos.y
        }
    }

    let door1y = !level ? rand(1, size - 2) : player.y;
    let door0y = rand(1, size - 2);

    map[door1y * size] = DOOR0;
    map[door0y * size + size - 1] = DOOR0;

    map[door1y * size + 1] = PLAYER;
    player.x = 1;
    player.y = door1y;

    map[(door1y) * size + 2] = CARGO;
    cargo.x = 2;
    cargo.y = door1y;

    doors = {
        d1: { x: 0, y: door1y },
        d0: { x: size - 1, y: door0y }
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
ctx.font = "bold 12px monospace";

let run = () => {
    currentRoom = 0;
    locked = false;
    gameOver = false;
    initial = false;
    logs = [];

    player.a = 1;
    player.d = 0;
    player.h = 45;
    player.g = 0;

    createRoom(currentRoom);
}

// drawSprite(1, 1, PLAYER, colors[0]);
// drawSprite(9, 1, DOOR1, colors[1]);
// console.log(map)

let loop = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 500, 500);

    if (!gameOver) {
        ctx.fillStyle = colors[2];
        ctx.fillRect(base * scale / 2, base * scale / 2, (size - 1) * base * scale, (size - 1) * base * scale);
        ctx.fillStyle = "#000";
        ctx.fillRect(base * scale / 2 + 2, base * scale / 2 + 2, (size - 1) * base * scale - 4, (size - 1) * base * scale - 4);

        map.map((e, i) => {

            if (e != EMPTY) {
                let color = colors[2];

                if (e == PLAYER) color = colors[0];
                if (e == CARGO) {
                    (player.g && (player.x - cargo.x)**2 + (player.y - cargo.y)**2 == 1) ? 
                    color = colors[2] :
                    color = colors[3];
                }
                if (e >= MOB0 && e <= MOB3) color = colors[1];

                if (e != WALL) drawSprite(i % size, Math.floor(i / size), e, color);
            } else {
                ctx.fillStyle = '#666';
                ctx.fillRect(i % size * base * scale + base, Math.floor(i / size) * base * scale + base, scale, scale);
            }
        });

        mobs.map(e => {
            if (!e.d) {
                ctx.fillStyle = '#FF0';
                ctx.fillRect(
                    e.x * base * scale, 
                    e.y * base * scale - base * scale / 2,
                    8 * e.h,
                    5
                );
            }
        });

        ctx.fillStyle = '#FF0';
        ctx.fillText("Room: " + (currentRoom + 1) + "/" + levels.length + " HP: " + player.h, base * scale, (size + 1) * base * scale);

        logs.map((e, i, arr) => ctx.fillText(arr[arr.length - 1 - i], (size + 1) * base * scale, (i + 1) * base * scale))
        if (logs.length > 20) logs.shift();
    } else {
        ctx.fillStyle = '#FF0';
        if (player.d) ctx.fillText("You died for the gods... for... transportation gods...", base * scale, base * scale);
        ctx.fillText("Medival Express / 2kjplusjam / twitter github @obsfx", base * scale, 2 * base * scale);
        let t = (initial) ? "Press E to start the game" : "Thanks for playing! Press E to play again";
        ctx.fillText(t, base * scale, 3 * base * scale);
        
    }

    // if (player.g && (player.x - cargo.x)**2 + (player.y - cargo.y)**2 == 1) {
    //     ctx.strokeStyle = colors[0];
    //     // ctx.beginPath();
    //     // ctx.lineWidth = 4;

    //     ctx.fillRect(
    //         player.x * base * scale + base * scale / 2, 
    //         player.y * base * scale + base * scale / 2, 
    //         (player.x - cargo.x) * base * scale + 8, 
    //         (player.y - cargo.y) * scale + 8);
    //     // ctx.moveTo(player.x * base * scale + base * scale / 2, player.y * base * scale + base * scale / 2);
    //     // ctx.lineTo(cargo.x * base * scale + base * scale / 2, cargo.y * base * scale + base * scale / 2);
    //     // ctx.stroke();
    //     // ctx.closePath();
    // }
}
// console.log(player, mobs);

// run();
setInterval(loop, 1E3 / 30);
// loop();