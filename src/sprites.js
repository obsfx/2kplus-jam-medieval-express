let drawSprite = (x, y, index, color) => {
    for (let i = 0; i < 64; i++) {
        if (spriteSheet[index * 64 + i] != "0") ctx.fillStyle = color;
        else ctx.fillStyle = '#000';

        let _x = (i % base) * scale + x * scale * base;
        let _y = Math.floor(i / base) * scale + y * scale * base;
        ctx.fillRect(_x, _y, scale, scale);
        // let _x = i % base + x;
        // let _y = Math.floor(i / base) + y;
        // console.log(spriteSheet[index * 64 + i], _x, _y);
    }
}