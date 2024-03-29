import { registerSettings } from './modules/settings.js';
import { FactionActorSheet } from "./modules/faction-sheet.js";
import { PowerItemSheet } from "./modules/power-sheet.js";
import { TerritoryItemSheet } from "./modules/territory-sheet.js";
import { ScarItemSheet } from "./modules/scar-sheet.js";
import { CoinItemSheet } from "./modules/coin-sheet.js";
import { EventItemSheet } from './modules/event-sheet.js';
import { MissionItemSheet } from './modules/mission-sheet.js';
import { DraftItemSheet } from './modules/draft-sheet.js'

export const log = (...args) => console.log("Risk Legacy | " + args);

Hooks.once("init", async () => {
  log("Initalizing Risk:Legacy Game System");

  //Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("risk", FactionActorSheet, { types: ["faction"], makeDefault: true });
  
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("risk", PowerItemSheet, { types: ["power"], makeDefault: true });
  Items.registerSheet("risk", TerritoryItemSheet, {types: ["territory"], makeDefault: true });
  Items.registerSheet("risk", CoinItemSheet, { types: ["coin"], makeDefault: true })
  Items.registerSheet("risk", ScarItemSheet, { types: ["scar"], makeDefault: true });
  Items.registerSheet("risk", EventItemSheet, { types: ["event"], makeDefault: true })
  Items.registerSheet("risk", MissionItemSheet, { types: ["mission"], makeDefault: true })
  Items.registerSheet("risk", DraftItemSheet, { types: ["draft"], makeDefault: true })

});

Hooks.once('ready', async () => {
  //Parse the packs
  log("Getting Risk Legacy Ready");
  let gamepacks = jsyaml.safeLoad(await (await fetch('systems/risklegacy/assets/unlocks/unlocks.yaml')).text()).packs;
  registerSettings(gamepacks);
  if(game.settings.get('risklegacy', 'initalized') == false){
    const template = `
    <div class="form-group" style="display:flex; flex-direction:column">
      <h1>Variant?</h1>
      <select id="variant">
        <option value="original">Original</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>
    `

    new Dialog({
      title: "Variant", 
      content: template,
      buttons: {
        "ok":{
          label: "Build World",
          callback: async (html)=>{
            let variant = html.find("#variant")[0].value.toLowerCase();
            await game.settings.set('risklegacy', 'variant', variant)
            setup();
          }
        }
      }
    }).render(true);
  } else {
    canvas.pan({x:5500,y:3000,scale:0})
  } 
}); 

Hooks.on("renderJournalDirectory", (app, html, data) => {
  const rulesButton = $('<button  style="min-width: 96%; margin: 10px 6px;">Base Rules</button>')

  html.find(".directory-footer").append(rulesButton);
  rulesButton.click((ev) => {
    ui.PDFoundry.openURL('systems/risklegacy/assets/rules.pdf');
  })
})

async function setup(){
  let variant = game.settings.get('risklegacy', 'variant')
    //Create new scene with Map
    Scene.create({
      name:"Map",
      active: true,
      gridType: 0,
      tokenVision: false,
      globalLight: true,
      height: 4000,
      width: 6000,
      img: `systems/risklegacy/assets/board/${variant}.jpg`
    }).then(() => {
      Tile.create({
        img: 'systems/risklegacy/assets/board/sideboard.jpg',
        x: 3500,
        y: 5000,
        width: 2200,
        height: 1300
      })
      //zooms out for the client
      canvas.pan({x:5500,y:3000,scale:0})
    })
    game.settings.set('risklegacy', 'initalized', true);
    
}