window.DDScenarios = window.DDScenarios || {};
window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['frozen-offerings'] = window.DDScenarioData['frozen-offerings'] || {};

window.DDScenarios['frozen-offerings'] = {
  id: 'frozen-offerings',
  title: 'Frozen Offerings',
  source: 'dra34_FrozenOfferings(1).pdf',
  dataSheet: 'Frozen Offerings_シナリオ整理',
  startSceneId: 'intro',
  modules: {
    maps: 'scenarios/frozen-offerings/maps.js',
    npcs: 'scenarios/frozen-offerings/npcs.js',
    items: 'scenarios/frozen-offerings/items.js',
    monsters: 'scenarios/frozen-offerings/monsters.js',
    rewards: 'scenarios/frozen-offerings/rewards.js'
  },
  overview: [
    { id: 'flow-01', label: '依頼発生', location: 'Targos', next: 'flow-02' },
    { id: 'flow-02', label: '出発準備', location: 'Targos', next: 'flow-03' },
    { id: 'flow-03', label: '湖上移動', location: 'Maer Dualdon', next: 'flow-04' },
    { id: 'flow-04', label: '漂流船事件', location: 'Maer Dualdon', optional: true, next: 'flow-05' },
    { id: 'flow-05', label: 'Brukka村', location: 'Brukka Village', next: 'flow-06' },
    { id: 'flow-06', label: '追跡準備', location: 'Brukka Village', next: 'flow-07' },
    { id: 'flow-07', label: '雪原追跡', location: 'Frozen Plain', next: 'flow-08' },
    { id: 'flow-08', label: '雪原の危機', location: 'Frozen Plain', next: 'flow-09' },
    { id: 'flow-09', label: '二峰と凍結トロフィー', location: 'Two Peaks', next: 'flow-10' },
    { id: 'flow-10', label: '登山', location: 'Whitetooth Peak', next: 'flow-11' },
    { id: 'flow-11', label: '竜の巣への接近', location: "Dragon's Lair", next: 'flow-12' },
    { id: 'flow-12', label: 'Xakkrath戦', location: "Dragon's Lair", next: 'flow-13' },
    { id: 'flow-13', label: '結末', location: 'Targos', end: true }
  ],
  states: {
    TARDY: false,
    PREPARED: false,
    WARNED: false,
    HASTE: false,
    MOUNT: false,
    WANDERED: false,
    snowBlind: false,
    thalgarExhaustion: 0,
    inspiration: false,
    knowsWhitetooth: false,
    longRestTaken: false,
    shortRestTaken: false,
    questLost: false
  },
  scenes: []
};
