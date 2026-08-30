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
  let runtimePromise = null;

  function loadScript(src, errorMessage) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(s => s.getAttribute('src') === src || s.src.endsWith(src));
      if (existing?.dataset.ddLoaded === 'true') return resolve();
      const script = existing || document.createElement('script');
      script.src = src;
      script.async = true;
      script.addEventListener('load', () => { script.dataset.ddLoaded='true'; resolve(); }, {once:true});
      script.addEventListener('error', () => reject(new Error(errorMessage)), {once:true});
      if (!existing) document.head.appendChild(script);
    });
  }

  function ensureLoader() {
    if (window.DDScenarioLoader) return Promise.resolve(window.DDScenarioLoader);
    if (!loaderPromise) loaderPromise = loadScript('js/dd-scenario-loader.js?v=20260830-2','シナリオ読み込み機能を読み込めませんでした。').then(()=>window.DDScenarioLoader);
    return loaderPromise;
  }

  function ensureRuntime() {
    if (window.DDScenarioRuntime) return Promise.resolve(window.DDScenarioRuntime);
    if (!runtimePromise) runtimePromise = loadScript('js/dd-scenario-runtime.js?v=20260830-1','シナリオ進行機能を読み込めませんでした。').then(()=>window.DDScenarioRuntime);
    return runtimePromise;
  }

  async function loadSelectedScenario(id, options={}) {
    if (!id) return null;
    const loader = await ensureLoader();
    const scenario = await loader.loadScenario(id);

    try {
      const game = JSON.parse(localStorage.getItem('ddActiveGame') || 'null');
      if (game && (game.activeQuestId === id || game.quest?.id === id)) {
        game.scenario = { id:scenario.id, title:scenario.title, startSceneId:scenario.startSceneId };
        game.scenarioStates ||= {};
        if (!game.scenarioStates[id]) {
          game.scenarioStates[id] = typeof structuredClone === 'function'
            ? structuredClone(scenario.states || {})
            : JSON.parse(JSON.stringify(scenario.states || {}));
        }
        localStorage.setItem('ddActiveGame', JSON.stringify(game));
      }
    } catch (_) {}

    document.dispatchEvent(new CustomEvent('ddscenario:loaded', { detail:{id,scenario} }));

    if (options.start) {
      const runtime = await ensureRuntime();
      await runtime.start(id, !!options.reset);
    }
    return scenario;
  }

  window.DDLoadScenario = loadSelectedScenario;
  window.DDEnsureScenarioLoader = ensureLoader;
  window.DDEnsureScenarioRuntime = ensureRuntime;

  document.addEventListener('click', event => {
    const button = event.target.closest?.('.quest-row[data-quest-id]');
    if (!button || button.disabled) return;
    const id = button.dataset.questId;
    let reset = false;
    try {
      const game = JSON.parse(localStorage.getItem('ddActiveGame') || '{}');
      reset = !game?.scenarioProgress?.[id]?.currentSceneId;
    } catch (_) { reset = true; }
    loadSelectedScenario(id,{start:true,reset}).catch(error => console.error(error));
  });

  const resume = () => {
    try {
      const game = JSON.parse(localStorage.getItem('ddActiveGame') || 'null');
      const id = game?.activeQuestId || game?.quest?.id;
      if (id) loadSelectedScenario(id,{start:true,reset:false}).catch(error => console.error(error));
    } catch (_) {}
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resume, {once:true});
  else resume();
})();
