const lines = []
    const linesArray = new PIXI.Graphics();
    const line = new PIXI.Graphics();
    line.lineStyle(5, 0xdcc306, 1);
    line.lineTo(0, -800);
    line.position.x = 220;
    line.position.y = 800;
    lines.push(line)
    linesArray.addChild(line);
    for(let i=0;i<3;i++){
        const line = new PIXI.Graphics();
        line.lineStyle(5, 0xdcc306, 1);
        line.lineTo(0, -800);
        line.position.x = lines[i].position.x + 200;
        line.position.y = 800;
        lines.push(line)
        linesArray.addChild(line);
    }
export {linesArray}