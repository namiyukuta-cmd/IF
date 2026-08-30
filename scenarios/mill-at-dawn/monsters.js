window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['mill-at-dawn'] = window.DDScenarioData['mill-at-dawn'] || {};
window.DDScenarioData['mill-at-dawn'].monsters = [
  {
    id:'MON_MILL_GIANT_RAT',
    name:'Giant Rat',
    ja:'ジャイアント・ラット',
    count:2,
    combat:true,
    cr:'1/8',
    ac:12,
    hp:7,
    initiativeMod:2,
    attacks:[
      {name:'Bite',ja:'噛みつき',toHit:4,damage:'1d4+2',count:1}
    ]
  }
];
