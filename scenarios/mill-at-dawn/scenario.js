window.DDScenarios = window.DDScenarios || {};
window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['mill-at-dawn'] = window.DDScenarioData['mill-at-dawn'] || {};

window.DDScenarios['mill-at-dawn'] = {
  id: 'mill-at-dawn',
  title: '夜明けの水車小屋',
  startSceneId: 'intro',
  minLevel: 1,
  maxLevel: 1,
  recommendedLevel: 1,
  modules: {
    scenes: 'scenarios/mill-at-dawn/scenes.js',
    items: 'scenarios/mill-at-dawn/items.js',
    monsters: 'scenarios/mill-at-dawn/monsters.js',
    rewards: 'scenarios/mill-at-dawn/rewards.js'
  },
  overview: [
    { id:'flow-01', label:'依頼を受ける', location:'Brackenford', next:'flow-02' },
    { id:'flow-02', label:'水車小屋へ向かう', location:'町外れ', next:'flow-03' },
    { id:'flow-03', label:'異変を調べる', location:'水車小屋', next:'flow-04' },
    { id:'flow-04', label:'水路の巣を排除する', location:'水車小屋・水路', next:'flow-05' },
    { id:'flow-05', label:'粉屋を救出する', location:'水車小屋・水路', next:'flow-06' },
    { id:'flow-06', label:'Brackenfordへ戻る', location:'Brackenford', end:true }
  ],
  states: {
    foundTracks: false,
    sawBrokenSluice: false,
    foundTool: false,
    ratsDrivenOff: false,
    millerRescued: false,
    questLost: false
  }
};
