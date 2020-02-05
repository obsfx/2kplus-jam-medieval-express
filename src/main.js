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
    player.h = 30;
    player.g = 0;

    createRoom(currentRoom);
}

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
        ctx.fillText("Room: " + (currentRoom + 1) + "/" + levelL + " HP: " + player.h, base * scale, (size + 1) * base * scale);

        logs.map((e, i, arr) => ctx.fillText(arr[arr.length - 1 - i], (size + 1) * base * scale, (i + 1) * base * scale))
        if (logs.length > 20) logs.shift();
    } else {
        let list = [];
        list.push("Medival Express / 2kplus / twitter github @obsfx");
        
        if (player.d) list.push("You died for the gods.. for.. transportation gods.");
        else if (!initial) list.push("You delivered the package!");
        
        if (!initial) list.push("Thanks for playing!");

        // if (player.d) ctx.fillText("You died for the gods.. for.. transportation gods.", base * scale, base * scale);
        // else if (!initial) ctx.fillText("You delivered the package!", base * scale, base * scale);
        // ctx.fillText("Medival Express / 2kplus / twitter github @obsfx", base * scale, 2 * base * scale);
        list.push("Press E to start the game");

        ctx.fillStyle = '#FF0';
        list.map((e, i) => ctx.fillText(e, base * scale, (i + 1) * base * scale));
    }
}

setInterval(loop, 1E3 / 30);