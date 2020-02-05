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

            if (mobs[i].h < 1) {
                mobs[i].d = 1;
                map[r * size + c] = EMPTY;
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