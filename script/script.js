class BaseHUD {
    constructor(base) {
        this.base = base;
        this.prevBaseEnergy = 0;
        this.totalEconomyScore = 0;
        this.economyScoreCount = 1;
    }
    tick() {
        let tempEnergy = this.base.energy;
        if (this.prevBaseEnergy > tempEnergy) {
            tempEnergy += this.base.current_spirit_cost;
        }
        this.economyScore = tempEnergy - this.prevBaseEnergy;
        this.totalEconomyScore += this.economyScore;
        this.prevBaseEnergy = this.base.energy;
        this.economyScoreCount++;
    }
    render() {
        battleHud.ctx.fillStyle = this.base.color;
        battleHud.printText(`${this.base.player_id}`);
        battleHud.currentLineYPos += 6;
        let units = living_spirits.filter(x => x.player_id == this.base.player_id && x.hp != 0);
        let deadUnits = living_spirits.filter(x => x.player_id == this.base.player_id && x.hp == 0).length;
        let unitCount = units.length;
        let totalEnergy = units.reduce((sum, s) => sum += s.energy, 0);
        let totalEnergyCapacity = units.reduce((sum, s) => sum += s.energy_capacity, 0);
        battleHud.printText(`Unit Count: ${Math.trunc(unitCount)}`);
        battleHud.printText(`Dead Units: ${Math.trunc(deadUnits)}`);
        battleHud.printText(`Energy: ${Math.trunc(totalEnergy)}`);
        battleHud.printText(`Energy Capacity: ${Math.trunc(totalEnergyCapacity)}`);
        battleHud.printText(`Economy Score (energy/s): ${Math.trunc(this.economyScore)}`);
        battleHud.printText(`Average Economy Score (energy/s): ${Math.trunc(this.totalEconomyScore / this.economyScoreCount)}`);
        battleHud.currentLineYPos += 24;
    }
}
class BattleHUD {
    constructor() {
        this.selecting = false;
    }
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
        this.drawText("Total unit count: " + living_spirits.length, this.hud.width - 200, 100);
        // this.drawText("My unit count: " + minions.length, this.hud.width - 200, 114)
        // this.drawText("My energy: " + minions.reduce((count, m) => count+=m.energy, 0), this.hud.width - 200, 128)
        // this.drawText("Enemy count: " + enemies.length, this.hud.width - 200, 142)
        this.currentLineYPos = 100;
        this.currentLineXPos = 50;
        this.basesHud.forEach(x => {
            x.render();
        });
    }
    tick() {
        this.basesHud.forEach(x => {
            x.tick();
        });
    }
    drawText(text, x, y) {
        this.ctx.font = "16px Arial";
        this.ctx.fillText(text, x, y);
    }
    printText(text) {
        this.drawText(text, this.currentLineXPos, this.currentLineYPos);
        this.currentLineYPos += 20;
    }
}
/// <reference path="./BattleHUD.ts" />
var world_initiated = 0;
var battleHud = new BattleHUD();
setTimeout(() => runHud(), 3000);
function runHud() {
    console.log("ready");
    var oldRender;
    battleHud.init();
    if (oldRender == null && render_state != null) {
        oldRender = render_state;
        render_state = function (timestamp) {
            oldRender(timestamp);
            newRender();
        };
    }
    setInterval(() => {
        tick();
    }, 1000);
    function newRender() {
        battleHud.render();
    }
    function tick() {
        battleHud.tick();
    }
}
//# sourceMappingURL=script.js.map