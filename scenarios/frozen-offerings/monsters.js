window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['frozen-offerings'] = window.DDScenarioData['frozen-offerings'] || {};
window.DDScenarioData['frozen-offerings'].monsters = [
  {
    id:'MON_DEEP_SCION',name:'Deep Scion',count:2,combat:true,cr:3,mapId:'BATTLE_MAER',
    ac:11,hp:67,initiativeMod:1,
    attacks:[
      {name:'Bite',toHit:6,damage:'1d4+4',count:1},
      {name:'Claw',toHit:6,damage:'1d6+4',count:2}
    ],
    special:{kind:'screech',name:'Psychic Screech',saveAbility:'wis',dc:13,once:true}
  },
  {
    id:'MON_YETI',name:'Yeti',count:2,combat:true,cr:3,mapId:'BATTLE_YETI',
    ac:12,hp:51,initiativeMod:1,
    attacks:[{name:'Claw',toHit:6,damage:'1d6+4+1d6',count:2}],
    special:{kind:'gaze',name:'Chilling Gaze',saveAbility:'con',dc:13,damage:'3d6',oncePerTarget:true},
    fearOfFire:true
  },
  {
    id:'MON_XAKKRATH',name:'Xakkrath',base:'Young White Dragon',count:1,combat:true,cr:6,mapId:'BATTLE_DRAGON',boss:true,
    ac:17,hp:133,initiativeMod:0,
    attacks:[
      {name:'Bite',toHit:7,damage:'2d10+4+1d8',count:1},
      {name:'Claw',toHit:7,damage:'2d6+4',count:2}
    ],
    breath:{name:'Cold Breath',saveAbility:'con',dc:15,damage:'10d8',recharge:[5,6],firstRound:true}
  },
  { id: 'MON_REMORHAZ_FROZEN', name: 'Remorhaz', count: 1, combat: false, role: 'frozen-trophy' },
  { id: 'MON_SABER_TIGER_FROZEN', name: 'Saber-toothed Tiger', count: 2, combat: false, role: 'frozen-trophy' },
  { id: 'MON_WINTER_WOLF_FROZEN', name: 'Winter Wolf', count: 1, combat: false, role: 'frozen-trophy' },
  { id: 'MON_WOLVES', name: 'Wolves', count: 3, combat: false, role: 'environment' },
  { id: 'MON_ANGNATH', name: 'Angnath', base: 'White Dragon', count: 1, combat: false, role: 'background' }
];
