//MedEx medival express
ctx.textBaseline = "top";
ctx.font = "bold 12px monospace";

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
        ctx.fillRect(base * scale / 2, base * scale / 2, (size - 1) * base * scale, (size - 1) * base * scale);
        ctx.fillStyle = "#000";
        ctx.fillRect(base * scale / 2 + 2, base * scale / 2 + 2, (size - 1) * base * scale - 4, (size - 1) * base * scale - 4);

        map.map((e, i) => {

            if (e != EMPTY) {
                let color = colors[2];

                if (e == PLAYER) color = colors[0];
                if (e == CARGO) color = colors[3];
                if (e > 3 && e < 8) color = colors[1];

                if (e != WALL) drawSprite(i % size, Math.floor(i / size), e, color);
            } else {
                ctx.fillStyle = '#666';
                ctx.fillRect(i % size * base * scale + base, Math.floor(i / size) * base * scale + base, scale, scale);
            }
        });
    }

    mobs.map(e => {
        if (!e.d) {
            ctx.fillStyle = '#000';
            ctx.fillRect(e.x * base * scale, e.y * base * scale - base * scale / 2, 10, 10);
            ctx.fillStyle = '#FF0';
            ctx.fillText(e.h, e.x * base * scale, e.y * base * scale - base * scale / 2);
        }
    })
}
// console.log(player, mobs);

run();
setInterval(loop, 1E3 / 30);
// loop();