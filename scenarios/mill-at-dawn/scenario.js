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
    maps: 'scenarios/mill-at-dawn/maps.js',
    items: 'scenarios/mill-at-dawn/items.js',
    monsters: 'scenarios/mill-at-dawn/monsters.js',
    rewards: 'scenarios/mill-at-dawn/rewards.js'
  },
  overview: [
    { id:'flow-01', label:'依頼を受ける', location:'Brackenford', next:'flow-02' },
    { id:'flow-02', label:'水車小屋へ向かう', location:'町外れ', next:'flow-03' },
    { id:'flow-03', label:'異変を調べる', location:'水車小屋', next:'flow-04' },
    { id:'flow-04', label:'ジャイアント・ラット戦', location:'水車小屋・水路', next:'flow-05' },
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

// このLv.1シナリオは単独PC戦闘を使うため、最新の共通戦闘エンジンを先に読み込む。
(() => {
  const src = 'js/dd-battle.js?v=20260830-2';
  if ([...document.scripts].some(s => (s.getAttribute('src') || '').includes('dd-battle.js?v=20260830-2'))) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
})();
