// window.addEventListener('keydown', e => {
//     if (!e.repeat) {
//         console.log('fire');
//     }
// });

window.onkeydown = e => {
    if (!e.repeat) {
        if (e.keyCode == 69) {
            player.g = 1;
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