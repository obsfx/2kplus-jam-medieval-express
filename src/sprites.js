let drawSprite = (x, y, index, color) => {
    ctx.fillStyle = color;
    for (let i = 0; i < 64; i++) {
        if (spriteSheet[index * 64 + i] != "0")
        ctx.fillRect((i % base) * scale + x * scale * base, Math.floor(i / base) * scale + y * scale * base, scale, scale);
        // let _x = i % base + x;
        // let _y = Math.floor(i / base) + y;
        // console.log(spriteSheet[index * 64 + i], _x, _y);
    }
}