(() => {
  'use strict';

  const ACTIVE_KEY = 'ddActiveGame';

  function getGame() {
    if (window.DDInventory?.getGame) return window.DDInventory.getGame();
    try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null'); } catch (_) { return null; }
  }

  function saveGame(game) {
    if (window.DDInventory?.saveGame) return window.DDInventory.saveGame(game);
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(game));
    return game;
  }

  async function restartQuest() {
    const game = getGame();
    if (!game) return;
    const id = game.activeQuestId || game.quest?.id;
    if (!id) return;

    game.character ||= {};
    if (game.character.maxHp != null) game.character.hp = Number(game.character.maxHp);
    game.pendingCombat = null;

    game.questStates ||= {};
    game.questStates[id] = {...(game.questStates[id] || {}), status:'active'};
    if (game.quest?.id === id) game.quest = {...game.quest, status:'active'};

    game.scenarioStates ||= {};
    if (game.scenarioStates[id]) {
      delete game.scenarioStates[id].questLost;
    }

    if (Array.isArray(game.completedQuests)) {
      game.completedQuests = game.completedQuests.filter(qid => qid !== id);
    }

    saveGame(game);

    if (window.DDLoadScenario) {
      await window.DDLoadScenario(id, {start:true, reset:true});
    } else {
      location.reload();
    }
  }

  function replaceFailureButton() {
    const actions = document.getElementById('battleActions');
    if (!actions || actions.dataset.deathChoices === 'true') return;
    const failed = [...actions.querySelectorAll('button')].find(button => button.disabled && button.textContent.trim() === 'クエスト失敗');
    if (!failed) return;

    actions.dataset.deathChoices = 'true';
    actions.innerHTML = '';

    const top = document.createElement('button');
    top.type = 'button';
    top.textContent = 'TOPに戻る';
    top.addEventListener('click', () => { location.href = 'DD_top.html'; });

    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'このクエストを最初から';
    retry.addEventListener('click', async () => {
      top.disabled = true;
      retry.disabled = true;
      try {
        await restartQuest();
      } catch (error) {
        console.error(error);
        top.disabled = false;
        retry.disabled = false;
      }
    });

    actions.append(top, retry);
  }

  const observer = new MutationObserver(replaceFailureButton);
  const start = () => {
    observer.observe(document.body, {subtree:true, childList:true});
    replaceFailureButton();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
