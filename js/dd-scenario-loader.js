window.DDScenarioLoader = (() => {
  'use strict';

  const loaded = new Map();

  function loadScript(src) {
    if (!src) return Promise.resolve();
    if (loaded.has(src)) return loaded.get(src);

    const promise = new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.getAttribute('src') === src || script.src.endsWith(src));
      if (existing?.dataset.ddLoaded === 'true') {
        resolve();
        return;
      }

      const script = existing || document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.ddScenarioScript = 'true';
      script.addEventListener('load', () => {
        script.dataset.ddLoaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', () => reject(new Error(`シナリオデータを読み込めませんでした: ${src}`)), { once: true });
      if (!existing) document.head.appendChild(script);
    });

    loaded.set(src, promise);
    return promise;
  }

  function list() {
    if (Array.isArray(window.DDScenarioList)) return window.DDScenarioList;
    if (Array.isArray(window.DDQuests)) return window.DDQuests;
    return [];
  }

  function descriptor(id) {
    return list().find(item => item.id === id) || null;
  }

  async function loadScenario(id) {
    const item = descriptor(id);
    if (!item) throw new Error(`シナリオが見つかりません: ${id}`);
    if (!window.DDScenarios?.[id]) await loadScript(item.entry);
    const scenario = window.DDScenarios?.[id];
    if (!scenario) throw new Error(`シナリオ本体が登録されませんでした: ${id}`);
    return scenario;
  }

  async function loadModule(id, moduleName) {
    const scenario = await loadScenario(id);
    const src = scenario.modules?.[moduleName];
    if (!src) return null;
    await loadScript(src);
    return window.DDScenarioData?.[id]?.[moduleName] ?? null;
  }

  async function loadModules(id, moduleNames = []) {
    const result = {};
    for (const name of moduleNames) result[name] = await loadModule(id, name);
    return result;
  }

  return { list, descriptor, loadScenario, loadModule, loadModules };
})();
