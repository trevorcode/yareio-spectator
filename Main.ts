/// <reference path="./BaseHUD.ts" />
/// <reference path="./BattleHUD.ts" />
/// <reference path="./UnitGraph.ts" />

var battleHud: BattleHUD = new BattleHUD();

var checkForStart = setInterval(() => {
    console.log("checking for start");
    if (world_initiated != 0)
    {
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