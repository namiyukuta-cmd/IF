window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['mill-at-dawn'] = window.DDScenarioData['mill-at-dawn'] || {};

const items = [
  {
    id:'ITEM_MILL_HEALING_POTION',
    name:'Potion of Healing',
    ja:'治癒のポーション',
    type:'consumable',
    weight:0,
    description:'飲むと傷を癒す赤い薬。',
    use:'回復用の消耗品。'
  }
];

window.DDScenarioData['mill-at-dawn'].items = items;
window.DD_ITEMS = window.DD_ITEMS || {};
for (const item of items) if (!window.DD_ITEMS[item.id]) window.DD_ITEMS[item.id] = item;
