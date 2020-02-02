 
 
// ---------- ./src/vars.js
// ---------- 
let EMPTY = 0;

let PLAYER1 = 1;
let CARGO2 = 2;
let DOOR3 = 3;

let MOB4 = 4;
let MOB5 = 5;
let MOB6 = 6;
let MOB7 = 7;
let MOB8 = 8;
let MOB9 = 9;
let MOB10 = 10;

let MISC11 = 11;
let MISC12 = 12;
let MISC13 = 13;
let MISC14 = 14;
let MISC15 = 15;
let MISC16 = 16;

let ITEM17 = 17;
let ITEM18 = 18;
let ITEM19 = 19;
let ITEM20 = 20;
let ITEM21 = 21;
let ITEM22 = 22;
let ITEM23 = 23;
let ITEM24 = 24;

let WALL = 99;

// -------------------

let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

let map = new Array(100).fill(0);

let colors = [ '#30f0d7', '#e5e781', 'white' ];

let spriteSheet = '000110010001100100111101010001010101011001110101011001001110111000000000001100001011011110110111000000001111111100000000010000101111111110000001101111011010010110111101101110011011110110111101000110000010001000111011000110110010101001101100011010101110101000011100001111000010100101111101100101011011101010000001101101010000000000000000000110100001101000000010000101110010101001101000000000000000101000011011000110110000001000010010001010100011100000100100001111010001100100000010001110010111010101100110111001010000111000010001001000010010101000100001001100010111001001100110000000000000000001100010101111010001010000011000000000000000000000000000001000000011000001110000011100000111000001111100111111110000000000000000000100000011100001111010111000111100111111011111000000000000000000010000001110000110110001110110111110111111111100000000000000000000000000000000000011100010011101110011111110110000000000000000001111000001100000011000000110000011110001111110000000000000100000010100000010000001110000001000000111000011111000011000011001001000010010010010010010100100000100100111001110000000000000000000000000000001110000001000000111000001110000011100000100000010100000101000000100000001000000010000000110000000000000000000001111110001000100110001001100010011000100110001001111111110011110100101100000011000000110000001010000100100001000111100111111111100100110000001100100111111111100011000111111110000000000001000000101100001000100100010001000100100010001100100000110000000000000010001000011100000110000010010011000001000000000000000'.split("");

let size = 10;
let base = 8;
let scale = 3; 
// ---------- ./src/util.js
// ---------- 
let clear = (x, y) => ctx.clearRect(x * base * scale, y * base * scale, base * scale, base * scale);

let setAreaOnArr = (x, y, w, h, value) => {
    for (let i = y; i < y + h; i++) {
        for (let j = x; j < x + w; j++) {
            map[i * size + j] = value;
        }
    }
}

let createRoom = () => {
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, 8, 8, EMPTY);

    ctx.fillStyle = colors[2];
    ctx.fillRect(base * scale / 2, base * scale / 2, 9 * base * scale, 9 * base * scale);
    ctx.clearRect(base * scale / 2 + 2, base * scale / 2 + 2, 9 * base * scale - 4, 9 * base * scale - 4);
} 
// ---------- ./src/sprites.js
// ---------- 
let drawSprite = (x, y, index, color) => {
    ctx.fillStyle = color;
    for (let i = 0; i < 64; i++) {
        if (spriteSheet[index * 64 + i] != "0")
        ctx.fillRect((i % base) * scale + x * scale * base, Math.floor(i / base) * scale + y * scale * base, scale, scale);
        // let _x = i % base + x;
        // let _y = Math.floor(i / base) + y;
        // console.log(spriteSheet[index * 64 + i], _x, _y);
    }
} 
// ---------- ./src/main.js
// ---------- 
createRoom();

drawSprite(1, 1, 0, colors[0]);
clear(9, 1);
drawSprite(9, 1, 2, colors[1]);

// map.map((e, i) => {
//     if (e == WALL) {
//         ctx.fillRect(i % 10 * base * scale, Math.floor(i / 10) * base * scale, base * scale, base * scale)
//     }
// });