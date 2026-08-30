window.DDQuests = [
  {
    id: 'frozen-offerings',
    title: 'Frozen Offerings',
    titleJa: 'Frozen Offerings',
    entry: 'scenarios/frozen-offerings/scenario.js'
  }
];
window.DDScenarioList = window.DDQuests;

(() => {
  'use strict';

  let loaderPromise = null;

  function ensureLoader() {
    if (window.DDScenarioLoader) return Promise.resolve(window.DDScenarioLoader);
    if (loaderPromise) return loaderPromise;

    loaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'js/dd-scenario-loader.js?v=20260830-1';
      script.async = true;
      script.addEventListener('load', () => resolve(window.DDScenarioLoader), { once: true });
      script.addEventListener('error', () => reject(new Error('シナリオ読み込み機能を読み込めませんでした。')), { once: true });
      document.head.appendChild(script);
    });
    return loaderPromise;
  }

  async function loadSelectedScenario(id) {
    if (!id) return null;
    const loader = await ensureLoader();
    const scenario = await loader.loadScenario(id);

    try {
      const game = JSON.parse(localStorage.getItem('ddActiveGame') || 'null');
      if (game && (game.activeQuestId === id || game.quest?.id === id)) {
        game.scenario = {
          id: scenario.id,
          title: scenario.title,
          startSceneId: scenario.startSceneId
        };
        if (!game.scenarioStates) game.scenarioStates = {};
        if (!game.scenarioStates[id]) {
          game.scenarioStates[id] = typeof structuredClone === 'function'
            ? structuredClone(scenario.states || {})
            : JSON.parse(JSON.stringify(scenario.states || {}));
        }
        localStorage.setItem('ddActiveGame', JSON.stringify(game));
      }
    } catch (_) {}

    document.dispatchEvent(new CustomEvent('ddscenario:loaded', { detail: { id, scenario } }));
    return scenario;
  }

  window.DDLoadScenario = loadSelectedScenario;
  window.DDEnsureScenarioLoader = ensureLoader;

  document.addEventListener('click', event => {
    const button = event.target.closest?.('.quest-row[data-quest-id]');
    if (!button || button.disabled) return;
    loadSelectedScenario(button.dataset.questId).catch(error => console.error(error));
  });

  const resume = () => {
    try {
      const game = JSON.parse(localStorage.getItem('ddActiveGame') || 'null');
      const id = game?.activeQuestId || game?.quest?.id;
      if (id) loadSelectedScenario(id).catch(error => console.error(error));
    } catch (_) {}
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resume, { once: true });
  else resume();
})();
