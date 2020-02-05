let createRoom = level => {
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, size - 2, size - 2, EMPTY);

    let pos = getAvailablePos().filter(e => e.x > 2 && e.x < 7 && e.y > 1 && e.y < 8);
    mobs = [];
    let miscc = rand(3, 6);
    for (let i = 0; i < miscc; i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        map[randPos.y * size + randPos.x] = rand(MISC0, MISC2);
    }

    let mobc = rand(levels[currentRoom * 3 + 2], levels[currentRoom * 3 + 2] + 2);
    for (let i = 0; i < mobc; i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        let rmob = rand(levels[currentRoom * 3], levels[currentRoom * 3 + 1]);
        map[randPos.y * size + randPos.x] = rmob;
        mobs[mobs.length] = {
            i: mobs.length,
            t: rmob,
            h: mobd[rmob - MOB0].h,
            a: mobd[rmob - MOB0].d,
            d: 0,
            x: randPos.x,
            y: randPos.y
        }
    }

    let door1y = !level ? rand(1, size - 2) : player.y;
    let door0y = rand(1, size - 2);

    map[door1y * size] = DOOR0;
    map[door0y * size + size - 1] = DOOR0;

    map[door1y * size + 1] = PLAYER;
    player.x = 1;
    player.y = door1y;

    map[(door1y) * size + 2] = CARGO;
    cargo.x = 2;
    cargo.y = door1y;

    doors = {
        d1: { x: 0, y: door1y },
        d0: { x: size - 1, y: door0y }
    }

    locked = false;
}