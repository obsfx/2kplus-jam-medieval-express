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