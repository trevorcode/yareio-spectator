/// <reference path="./BattleHUD.ts" />

var world_initiated = 0;
var battleHud: BattleHUD = new BattleHUD();
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
        }
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