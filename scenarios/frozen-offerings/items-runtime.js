window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['frozen-offerings'] = window.DDScenarioData['frozen-offerings'] || {};
const items = [
  {id:'ITEM_SNOWSHOES',name:'Snowshoes',ja:'かんじき',type:'gear',priceGp:10,price:{gp:10},weight:0},
  {id:'ITEM_CLIMBER_KIT',name:"Climber's kit",ja:'登攀用具',type:'gear',priceGp:25,price:{gp:25},weight:0},
  {id:'ITEM_SNOW_GLASSES',name:'Snow glasses',ja:'雪眼鏡',type:'gear',priceGp:5,price:{gp:5},weight:0},
  {id:'ITEM_LLAMA_SHIRT',name:'Llama wool undershirt',ja:'ラマ毛の下着',type:'clothing',priceGp:15,price:{gp:15},weight:0},
  {id:'ITEM_KNUCKLEHEAD_OIL',name:'Knucklehead oil',ja:'ナックルヘッド油',type:'consumable',priceGp:15,price:{gp:15},weight:0},
  {id:'ITEM_TACKLE',name:'Fishing tackle',ja:'釣り道具',type:'gear',weight:0},
  {id:'ITEM_LIGHT_CROSSBOW',name:'Light crossbow',ja:'ライト・クロスボウ',type:'gear',weight:0},
  {id:'ITEM_YETI_PELT',name:'Yeti pelt',ja:'イエティの毛皮',type:'gear',valueGp:100,weight:0},
  {id:'ITEM_WOOD',name:'Wooden item',ja:'木製品',type:'gear',weight:0},
  {id:'ITEM_TINDERBOX',name:'Tinderbox',ja:'火口箱',type:'gear',weight:0},
  {id:'ITEM_STONE_GIANT_POTION',name:'Potion of stone giant strength',ja:'ストーン・ジャイアント・ストレングスのポーション',type:'consumable',weight:0},
  {id:'ITEM_NECKLACE_FIREBALLS',name:'Necklace of fireballs',ja:'ファイアーボールの首飾り',type:'gear',weight:0}
];
window.DDScenarioData['frozen-offerings'].items = items;
window.DD_ITEMS = window.DD_ITEMS || {};
for (const item of items) if (!window.DD_ITEMS[item.id]) window.DD_ITEMS[item.id] = item;
