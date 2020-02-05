window.onkeydown = e => {
    if (!e.repeat && !locked) {
        if (e.keyCode == 69) {
            player.g = 1;
            
            if (gameOver) {
                run();
            }
        }

        if (e.keyCode == 39) {
            player.m(player.x + 1, player.y, RIGHT);
        } else if (e.keyCode == 37) {
            player.m(player.x - 1, player.y, LEFT);
        } else if (e.keyCode == 38) {
            player.m(player.x, player.y - 1, UP);
        } else if (e.keyCode == 40) {
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