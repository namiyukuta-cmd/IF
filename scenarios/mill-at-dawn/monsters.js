window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['mill-at-dawn'] = window.DDScenarioData['mill-at-dawn'] || {};
window.DDScenarioData['mill-at-dawn'].monsters = [
  {
    id:'MON_MILL_GIANT_RAT',
    name:'Weakened Giant Rat',
    ja:'弱ったジャイアント・ラット',
    count:1,
    combat:true,
    cr:'intro',
    ac:10,
    hp:3,
    initiativeMod:0,
    attacks:[
      {name:'Bite',ja:'噛みつき',toHit:2,damage:'1d2+1',count:1}
    ]
  }
];
