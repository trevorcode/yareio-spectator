// ==UserScript==
// @name         Yare Spectator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yare.io/d1/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @run-at       document-start
// ==/UserScript==
class BaseHUD {
    constructor(base) {
        this.base = base;
        this.prevBaseEnergy = 0;
        this.economyScore = 0;
        this.totalEconomyScore = 0;
        this.totalEconomyEfficiency = 0;
        this.economyScoreCount = 1;
        this.economyEfficiency = 0;
    }
    tick() {
        let tempEnergy = this.base.energy;
        if (this.prevBaseEnergy > tempEnergy) {
            tempEnergy += this.base.current_spirit_cost;
        }
        this.economyScore = tempEnergy - this.prevBaseEnergy;
        this.economyEfficiency = this.economyScore / living_spirits.filter(x => x.player_id == this.base.player_id && x.hp != 0).reduce((r, s) => r + s.size, 0);
        this.totalEconomyScore += this.economyScore;
        this.totalEconomyEfficiency += this.economyEfficiency;
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
        battleHud.printText(`Avg Economy Score (energy/s): ${Math.trunc(this.totalEconomyScore / this.economyScoreCount)}`);
        battleHud.printText(`Economic Efficiency: ${(this.economyEfficiency).toFixed(2)}`);
        battleHud.printText(`Avg Economic Efficiency: ${(this.totalEconomyEfficiency / this.economyScoreCount).toFixed(2)}`);
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
        this.unitGraph = new UnitGraph();
    }
    render() {
        this.ctx.clearRect(0, 0, this.hud.width, this.hud.height);
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        this.currentLineYPos = 100;
        this.currentLineXPos = this.hud.width - 50;
        this.printText("Total unit count: " + living_spirits.filter(x => x.hp != 0).length);
        this.currentLineYPos += 20;
        this.basesHud.forEach((x, index) => {
            x.render();
            this.unitGraph.drawGraph(index, x.base.color);
        });
    }
    tick() {
        this.basesHud.forEach(x => {
            x.tick();
        });
        this.unitGraph.buildGraphData();
    }
    drawText(text, x, y) {
        this.ctx.font = "16px Arial";
        this.ctx.fillText(text, x, y);
    }
    printText(text) {
        let width = this.ctx.measureText(text).width;
        let tempLineXPos = this.currentLineXPos;
        tempLineXPos = this.hud.width - width - (this.hud.width - tempLineXPos);
        this.drawText(text, tempLineXPos, this.currentLineYPos);
        this.currentLineYPos += 20;
    }
}
class UnitGraph {
    constructor() {
        this.graphIndex = 0;
        this.graphData = [];
        this.lastTData = null;
    }
    buildGraphData() {
        let w = window;
        let gameBlocks = Object.entries(w.game_blocks);
        if (this.lastTData != w.active_block) {
            this.graphData = gameBlocks.map(e => ({
                'tick': parseInt(e[0].substr(1)),
                'values': [Object.values(e[1].p1).reduce((r, s) => s[3] ? r + s[1] : r, 0) * (w.shapes.shape1 == "squares" ? 112 / 200 : 1),
                    Object.values(e[1].p2).reduce((r, s) => s[3] ? r + s[1] : r, 0) * (w.shapes.shape2 == "squares" ? 112 / 200 : 1)]
            })).sort((a, b) => b.tick - a.tick);
            this.lastTData = w.active_block;
        }
        this.graphIndex++;
    }
    drawGraph(index, color) {
        if (this.graphData.length > 0) {
            battleHud.ctx.strokeStyle = color;
            battleHud.ctx.beginPath();
            let x = battleHud.hud.width;
            battleHud.ctx.moveTo(--x, battleHud.hud.height - 80 - this.graphData[0].values[index]);
            this.graphData.forEach(data => {
                battleHud.ctx.lineTo(--x, battleHud.hud.height - 80 - data.values[index]);
            });
            battleHud.ctx.stroke();
        }
    }
}
/// <reference path="./BaseHUD.ts" />
/// <reference path="./BattleHUD.ts" />
/// <reference path="./UnitGraph.ts" />
var battleHud = new BattleHUD();
var checkForStart = setInterval(() => {
    console.log("checking for start");
    if (world_initiated != 0) {
        setTimeout(() => runHud(), 100);
    }
}, 1000);
function runHud() {
    clearInterval(checkForStart);
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
//# sourceMappingURL=script.user.js.map