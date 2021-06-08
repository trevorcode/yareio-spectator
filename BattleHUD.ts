class BattleHUD {

    hud: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    selecting: boolean = false;
    selectionStart: Position;
    currentLineYPos: number;
    currentLineXPos: number;

    basesHud: BaseHUD[];

    init() {
        let template = document.createElement('canvas');
        template.setAttribute("style", "z-index:-2");
        template.setAttribute("width", `${window.innerWidth}`);
        template.setAttribute("height", `${window.innerHeight}`);
        document.body.appendChild(template);

        //document.querySelector('body').innerHTML += `<canvas id="tofu_canvas" style="height:100vh; z-index:-2">`;
        this.hud = template;
        this.ctx = this.hud.getContext("2d");


        this.basesHud = [];
        bases.forEach(x => {
            this.basesHud.push(new BaseHUD(x));
        });

    }

    render() {

        this.ctx.clearRect(0, 0, this.hud.width, this.hud.height);

        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        this.currentLineYPos = 100;
        this.currentLineXPos = this.hud.width - 50;
        this.printText("Total unit count: " + living_spirits.filter(x => x.hp != 0).length)

        this.currentLineYPos += 20;
        this.basesHud.forEach(x => {
            x.render();
        });
    }

    tick() {
        this.basesHud.forEach(x => {
            x.tick();
        });
    }

    drawText(text: string, x: number, y: number) {
        this.ctx.font = "16px Arial";
        this.ctx.fillText(text, x, y);
    }

    printText(text: string) {
        let width = this.ctx.measureText(text).width;
        let tempLineXPos = this.currentLineXPos;

        tempLineXPos = this.hud.width - width - (this.hud.width - tempLineXPos);


        this.drawText(text, tempLineXPos, this.currentLineYPos)
        this.currentLineYPos += 20;
    }

}