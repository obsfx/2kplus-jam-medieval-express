//MedEx medival express
ctx.textBaseline = "top";
ctx.font = "bold 12px monospace";

let run = () => {
    currentRoom = 0;
    locked = false;
    gameOver = false;
    initial = false;

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
        ctx.fillText('MedEx: Medival Express', base * scale, size * base * scale);
        ctx.fillText('Room: ' + (currentRoom + 1) + '/' + levels.length + ' HP: ' + player.h, base * scale, (size + 1) * base * scale);
    } else {
        ctx.fillStyle = '#FF0';
        if (player.d) ctx.fillText("You died for the gods... for... transportation gods...", base * scale, 1 * base * scale);
        ctx.fillText("MedEx / created for 2kplus game jam", base * scale, 2 * base * scale);
        ctx.fillText("github.com/obsfx / twitter.com/obsfx", base * scale, 3 * base * scale);
        if (initial) ctx.fillText("<Press [E] to start the game>", base * scale, 4 * base * scale);
        else ctx.fillText("Thanks for playing! <Press [E] if you want to play again>", base * scale, 4 * base * scale);
        
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