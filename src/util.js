let clear = (x, y) => ctx.clearRect(x * base * scale, y * base * scale, base * scale, base * scale);

let setAreaOnArr = (x, y, w, h, value) => {
    for (let i = y; i < y + h; i++) {
        for (let j = x; j < x + w; j++) {
            map[i * size + j] = value;
        }
    }
}

let createRoom = () => {
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, 8, 8, EMPTY);

    ctx.fillStyle = colors[2];
    ctx.fillRect(base * scale / 2, base * scale / 2, 9 * base * scale, 9 * base * scale);
    ctx.clearRect(base * scale / 2 + 2, base * scale / 2 + 2, 9 * base * scale - 4, 9 * base * scale - 4);
}