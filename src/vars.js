let PLAYER = 0;
let CARGO = 1;

let DOOR0 = 2;

let MOB0 = 3;
let MOB1 = 4;
let MOB2 = 5;
let MOB3 = 6;

let MISC0 = 7;
let MISC1 = 8;
let MISC2 = 9;

let WALL = 98;
let EMPTY = 99;

let LEFT = 0;
let RIGHT = 1;
let UP = 2;
let DOWN = 3;

// -------------------

let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

let map = [];

let colors = [ '#0FF', '#F61677', '#FFF', '#0F0' ];

let spriteSheet = '0001100100011001001111010100010101010110011101010110010011101110000000000011000010110111101101110000000011111111000000000100001011111111100000011011110110100101101111011011100110111101101111010000000000000000011000101011110100010100000110000000000000000000000000000000000000011010000110100000001000010111001010100110100000100100001111010001100100000010001110010111010101100110111001010001100000100010001110110001101100101010011011000110101011101010000000000010000000110000011100000111000001110000011111001111111100000000000000000001000000111000011011000111011011111011111111110000000000000000001111000001100000011000000110000011110001111110'.split("");

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

// let levels = "333-333-343-442-462-344-453-553-454-553-663-364-336-555-665";
let levels = "333442353452462344453553454553663364336555665".split("").map(e => Number(e));
let levelL = 15;

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
    h: 30,
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
                if (map[r * size + c + 1] == EMPTY || map[r * size + c + 1] == DOOR0) {
                    if (map[r * size + c + 1] == DOOR0) {

                        if (++currentRoom > levelL - 1) {
                            gameOver = true;          
                        } else {
                            locked = true;
                            logs.push("next room");
                            setTimeout(() => createRoom(currentRoom), 200);
                        }
                    }
                    
                    set(c + 1, r, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
                }
            }
            
            if (d == LEFT) {
                if (map[r * size + c - 1] == EMPTY) {
                    set(c - 1, r, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
                }
            }
            
            if (d == UP) {
                if (map[(r - 1) * size + c] == EMPTY) {
                    set(c, r - 1, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
                }
            }
            
            if (d == DOWN) {
                if (map[(r + 1) * size + c] == EMPTY) {
                    set(c, r + 1, cargo, CARGO);
                    set(c, r, player, PLAYER);
                    operateMobs();
                }
            }
        }
    },
};