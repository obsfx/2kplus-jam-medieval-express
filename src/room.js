let createRoom = () => {
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, 8, 8, EMPTY);

    let pos = getAvailablePos().filter(e => e.x > 1 && e.x < 8 && e.y > 1 && e.y < 8);

    for (let i = 0; i < rand(3, 5); i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        map[randPos.y * size + randPos.x] = rand(MISC0, MISC2);
    }

    for (let i = 0; i < rand(1, 4); i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        map[randPos.y * size + randPos.x] = rand(MOB0, MOB3);
        mobs[randPos.y * size + randPos.x] = {
            h: 10,
            k: 0
        }
    }

    let door1y = rand(1, 7);
    let door0y = rand(1, 7);

    map[door1y * size + 0] = DOOR1;
    map[door0y * size + 9] = DOOR0;

    map[door1y * size + 1] = PLAYER;
    player.x = 1;
    player.y = door1y;

    currentRoom = {
        d1: { x: 0, y: door1y },
        d0: { x: 9, y: door0y },
        m: map
    }
}