class UnitGraph {

    constructor() {
        this.graphData = [];
        this.lastTData = null;
    }

    graphData: {tick: number, values: number[]}[];
    lastTData;
    graphIndex: number = 0;

    buildGraphData() {
        let w = (window as any);

        let gameBlocks: [string, Game_Block][] = Object.entries(w.game_blocks);

        if (this.lastTData != w.active_block) {
            this.graphData = gameBlocks.map(e =>
            (
                {
                    'tick': parseInt(e[0].substr(1)),
                    'values': 
                    [(Object.values(e[1].p1) as []).reduce((r, s) => s[3] ? r + s[1] : r, 0) * (w.shapes.shape1 == "squares" ? 112 / 200 : 1),
                    (Object.values(e[1].p2) as []).reduce((r, s) => s[3] ? r + s[1] : r, 0) * (w.shapes.shape2 == "squares" ? 112 / 200 : 1)]
                }
            )).sort((a, b) => b.tick - a.tick);
            this.lastTData = w.active_block;
        }
        this.graphIndex++;

    }



    drawGraph(index: number, color) {
        if (this.graphData.length > 0)
        {
            battleHud.ctx.strokeStyle = color;
            battleHud.ctx.beginPath();
            let x = battleHud.hud.width;
            battleHud.ctx.moveTo(--x, battleHud.hud.height - 80 - this.graphData[0].values[index]);
            this.graphData.forEach(data => {
                battleHud.ctx.lineTo(--x, battleHud.hud.height - 80 -data.values[index]);
            });
            
            battleHud.ctx.stroke();
        }

    }
}