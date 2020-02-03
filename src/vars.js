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