/// <reference path="./BaseHUD.ts" />
/// <reference path="./BattleHUD.ts" />
/// <reference path="./UnitGraph.ts" />

var world_initiated = 0;
var battleHud: BattleHUD = new BattleHUD();

var checkForStart = setInterval(() => {
    if (world_initiated != 0)
    {
        setTimeout(() => runHud(), 3000);
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