window.DDScenarioRuntime = (() => {
  'use strict';

  const ACTIVE_KEY = 'ddActiveGame';
  let currentScenarioId = '';

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function getGame() {
    if (window.DDInventory?.getGame) return window.DDInventory.getGame();
    try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || '{}'); } catch (_) { return {}; }
  }

  function saveGame(game) {
    if (window.DDInventory?.saveGame) return window.DDInventory.saveGame(game);
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(game));
    return game;
  }

  function clone(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function injectStyle() {
    if (document.getElementById('ddScenarioRuntimeStyle')) return;
    const style = document.createElement('style');
    style.id = 'ddScenarioRuntimeStyle';
    style.textContent = `
      #scenarioActions{margin-top:18px;display:grid;gap:8px;padding-bottom:18px}
      .scenario-action{width:100%;min-height:46px;border:1px solid #8a6b48;border-radius:8px;background:#e8cfaa;color:#342719;padding:8px 10px;font-size:15px;line-height:1.35;font-weight:800;text-align:left}
      .scenario-action:active{transform:translateY(1px)}
      .scenario-result{padding:8px 10px;border-left:3px solid #8a6b48;background:#e5d1b1;font-size:14px;line-height:1.55}
      .scenario-note{padding:7px 9px;border:1px dashed #a68b68;background:#f4e5cb;font-size:13px;line-height:1.5}
      .scenario-shop{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      .scenario-shop button{min-width:0;min-height:44px;border:1px solid #9b7c58;border-radius:7px;background:#f0ddbd;color:#352719;padding:5px;font-size:12px;line-height:1.25;font-weight:750}
      .scenario-shop button:disabled{opacity:.55}
      .scenario-shop-summary{font-size:12px;font-weight:750;color:#6a5238}
      @media(max-width:430px){.scenario-action{font-size:14px}.scenario-result{font-size:13px}}
    `;
    document.head.appendChild(style);
  }

  function ensureActionRoot() {
    const story = document.getElementById('storyArea');
    if (!story) return null;
    let root = document.getElementById('scenarioActions');
    if (!root) {
      root = document.createElement('div');
      root.id = 'scenarioActions';
      story.appendChild(root);
    }
    return root;
  }

  function scenarioState(game, scenario) {
    game.scenarioStates ||= {};
    if (!game.scenarioStates[scenario.id]) game.scenarioStates[scenario.id] = clone(scenario.states || {});
    return game.scenarioStates[scenario.id];
  }

  function progress(game, scenarioId) {
    game.scenarioProgress ||= {};
    game.scenarioProgress[scenarioId] ||= { currentSceneId:null, visited:{}, values:{}, purchases:[] };
    const p = game.scenarioProgress[scenarioId];
    p.visited ||= {};
    p.values ||= {};
    p.purchases ||= [];
    return p;
  }

  function abilityMod(score) { return Math.floor(((Number(score) || 10) - 10) / 2); }
  function pb(level) { const lv=Math.max(1,Math.min(20,Math.floor(Number(level)||1))); return Math.min(6,2+Math.floor((lv-1)/4)); }
  function norm(value) { return String(value || '').toLowerCase(); }

  function characterCheckMod(game, ability, skill) {
    const c = game.character || {};
    let mod = abilityMod(c.abilities?.[ability]);
    if (!skill) return mod;
    const skills = new Set((c.skills || []).map(norm));
    const expertise = new Set((c.classChoices?.expertise || []).map(norm));
    const key = norm(skill);
    const bonus = pb(c.level || 1);
    if (expertise.has(key)) mod += bonus * 2;
    else if (skills.has(key)) mod += bonus;
    return mod;
  }

  function rollD20({advantage=false, disadvantage=false}={}) {
    const a = 1 + Math.floor(Math.random()*20);
    if (advantage === disadvantage) return {roll:a, rolls:[a]};
    const b = 1 + Math.floor(Math.random()*20);
    return {roll: advantage ? Math.max(a,b) : Math.min(a,b), rolls:[a,b]};
  }

  function rollDice(expr) {
    const m = /^(\d+)d(\d+)$/.exec(String(expr || '').trim());
    if (!m) return 0;
    let total = 0;
    for (let i=0;i<Number(m[1]);i++) total += 1 + Math.floor(Math.random()*Number(m[2]));
    return total;
  }

  function hasItem(game, itemId) {
    return Array.isArray(game.inventory) && game.inventory.some(v => v.itemId === itemId && Number(v.quantity || 1) > 0);
  }

  function addResult(root, text) {
    const div = document.createElement('div');
    div.className = 'scenario-result';
    div.textContent = text;
    root.appendChild(div);
  }

  function action(root, label, fn) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scenario-action';
    button.textContent = label;
    button.addEventListener('click', fn);
    root.appendChild(button);
    return button;
  }

  async function loadModule(id, name) {
    if (!window.DDScenarioLoader) await window.DDEnsureScenarioLoader?.();
    return window.DDScenarioLoader?.loadModule(id, name);
  }

  async function addItem(itemId, quantity=1) {
    if (window.DDInventory?.add) return window.DDInventory.add(itemId, quantity);
    return null;
  }

  function setFromStored(state, p, spec) {
    if (!spec) return;
    const value = p.values?.[spec.source];
    const mapped = spec.map?.[String(value)];
    if (mapped !== undefined) state[spec.target] = mapped;
  }

  async function applyEnter(scene, game, scenario, state, p) {
    if (p.visited[scene.id]) return game;
    const enter = scene.enter || {};
    if (enter.set) Object.assign(state, enter.set);
    if (enter.setFromStored) setFromStored(state, p, enter.setFromStored);
    if (Array.isArray(enter.addItems) && enter.addItems.length) {
      await loadModule(scenario.id, 'items');
      for (const item of enter.addItems) await addItem(item.id, item.quantity || 1);
      game = getGame();
    }
    if (scene.damage) {
      const amount = rollDice(scene.damage);
      if (game.character && Number.isFinite(Number(game.character.hp))) game.character.hp = Math.max(0, Number(game.character.hp)-amount);
      p.values[`damage:${scene.id}`] = amount;
    }
    p.visited[scene.id] = true;
    return game;
  }

  function discoverMap(game, scene) {
    if (!scene.mapId) return;
    game.discoveredMaps ||= [];
    if (!game.discoveredMaps.some(v => (typeof v === 'string' ? v : v.id) === scene.mapId)) {
      game.discoveredMaps.push({id:scene.mapId,label:scene.location || scene.mapId});
    }
  }

  async function gotoScene(id) {
    const scenario = window.DDScenarios?.[currentScenarioId];
    if (!scenario) return;
    const scenes = window.DDScenarioData?.[scenario.id]?.scenes || [];
    const scene = scenes.find(v => String(v.id) === String(id));
    if (!scene) {
      const root = ensureActionRoot();
      if (root) root.innerHTML = `<div class="scenario-note">Scene ${esc(id)} が見つかりません。</div>`;
      return;
    }

    let game = getGame();
    const state = scenarioState(game, scenario);
    const p = progress(game, scenario.id);
    game = await applyEnter(scene, game, scenario, state, p);
    const state2 = scenarioState(game, scenario);
    const p2 = progress(game, scenario.id);
    p2.currentSceneId = scene.id;
    game.activeQuestId = scenario.id;
    game.quest = {...(game.quest||{}),id:scenario.id,title:scenario.title,status:'active'};
    game.location = {id:scene.mapId || '',label:scene.location || '未設定'};
    discoverMap(game, scene);

    if (scene.complete) {
      game.completedQuests ||= [];
      if (!game.completedQuests.includes(scenario.id)) game.completedQuests.push(scenario.id);
      game.questStates ||= {};
      game.questStates[scenario.id] = {...(game.questStates[scenario.id]||{}),status:'completed'};
      game.quest.status = 'completed';
    }
    saveGame(game);

    const title = document.getElementById('speakerName');
    const message = document.getElementById('messageText');
    if (title) title.textContent = scene.sourceEntry ? `${scene.sourceEntry}. ${scene.title}` : scene.title;
    if (message) message.textContent = scene.text || '';
    const location = document.getElementById('currentLocation');
    if (location) location.textContent = scene.location || '未設定';

    await renderActions(scene, scenario, state2, p2);
  }

  function afterRoll(root, text, next) {
    root.innerHTML = '';
    addResult(root, text);
    if (next) action(root, '次へ', () => gotoScene(next));
  }

  async function renderShop(root, scene, scenario) {
    const items = await loadModule(scenario.id, 'items') || [];
    const itemMap = new Map(items.map(v => [v.id,v]));
    const draw = () => {
      const game = getGame();
      const p = progress(game, scenario.id);
      const bought = new Set(p.purchases || []);
      const max = scene.shop.max || 3;
      const gp = Number(game.currency?.gp || 0);
      const wrap = document.createElement('div');
      wrap.className = 'scenario-shop';
      for (const id of scene.shop.items || []) {
        const item = itemMap.get(id);
        if (!item) continue;
        const button = document.createElement('button');
        const price = Number(item.priceGp || 0);
        button.type = 'button';
        button.textContent = `${item.ja || item.name} ${price}gp${bought.has(id)?' ✓':''}`;
        button.disabled = bought.has(id) || bought.size >= max || gp < price;
        button.addEventListener('click', async () => {
          let current = getGame();
          const cp = progress(current, scenario.id);
          if ((cp.purchases||[]).includes(id) || cp.purchases.length >= max) return;
          if (Number(current.currency?.gp || 0) < price) return;
          current.currency.gp -= price;
          saveGame(current);
          await addItem(id,1);
          current = getGame();
          const np = progress(current, scenario.id);
          if (!np.purchases.includes(id)) np.purchases.push(id);
          saveGame(current);
          await gotoScene(scene.id);
        });
        wrap.appendChild(button);
      }
      const summary = document.createElement('div');
      summary.className = 'scenario-shop-summary';
      summary.textContent = `購入 ${bought.size}/${max}　所持金 ${gp} gp`;
      root.appendChild(summary);
      root.appendChild(wrap);
    };
    draw();
  }

  function checkFlags(game, state, spec) {
    let advantage = false, disadvantage = false;
    if (spec.advantageIfItem && hasItem(game,spec.advantageIfItem)) advantage = true;
    if (Array.isArray(spec.advantageIfItems) && spec.advantageIfItems.every(id=>hasItem(game,id))) advantage = true;
    if (spec.disadvantageIfState && state[spec.disadvantageIfState]) disadvantage = true;
    if (spec.advantageIfState && state[spec.advantageIfState]) advantage = true;
    return {advantage,disadvantage};
  }

  function runCheck(root, spec, scenario, state, p, option={}) {
    const game = getGame();
    const merged = {...spec,...option};
    if (merged.autoFailIfState && state[merged.autoFailIfState]) {
      afterRoll(root, `自動失敗：${merged.autoFailIfState}`, merged.failure);
      return;
    }
    const flags = checkFlags(game,state,merged);
    const r = rollD20(flags);
    const mod = merged.modifier != null ? Number(merged.modifier) : characterCheckMod(game, merged.ability, merged.skill);
    const total = r.roll + mod;
    const success = total >= Number(merged.dc);
    if (merged.store) p.values[merged.store] = success;
    let damage = 0;
    if (success && merged.successDamage) damage = rollDice(merged.successDamage);
    if (!success && merged.failureDamage) damage = rollDice(merged.failureDamage);
    if (damage && game.character && Number.isFinite(Number(game.character.hp))) game.character.hp = Math.max(0,Number(game.character.hp)-damage);
    saveGame(game);
    const diceText = r.rolls.length > 1 ? `[${r.rolls.join(', ')}]→${r.roll}` : String(r.roll);
    afterRoll(root, `${merged.label || merged.skill || '判定'}：d20 ${diceText} ${mod>=0?'+':''}${mod} = ${total} / DC ${merged.dc} → ${success?'成功':'失敗'}${damage?`　${damage}ダメージ`:''}`, success ? merged.success : merged.failure);
  }

  async function renderActions(scene, scenario, state, p) {
    const root = ensureActionRoot();
    if (!root) return;
    root.innerHTML = '';

    if (scene.shop) await renderShop(root, scene, scenario);

    if (scene.end) {
      addResult(root, scene.complete ? 'クエスト完了' : 'シナリオ終了');
      return;
    }

    if (Array.isArray(scene.choices)) {
      for (const choice of scene.choices) action(root, choice.label, () => {
        const game = getGame();
        const st = scenarioState(game,scenario);
        if (choice.set) Object.assign(st,choice.set);
        saveGame(game);
        gotoScene(choice.next);
      });
      return;
    }

    if (scene.check) {
      const options = Array.isArray(scene.check.options) && scene.check.options.length ? scene.check.options : [null];
      for (const option of options) {
        const label = option?.label || (option?.skill ? `${scene.check.label}：${option.skill}` : scene.check.label || '判定する');
        action(root, label, () => runCheck(root, scene.check, scenario, state, p, option || {}));
      }
      return;
    }

    if (scene.save) {
      action(root, scene.save.label || 'セーヴする', () => runCheck(root, scene.save, scenario, state, p));
      return;
    }

    if (scene.multiSave) {
      action(root, scene.multiSave.label || '判定する', () => {
        const game = getGame();
        const spec = scene.multiSave;
        const advantage = Array.isArray(spec.advantageIfItems) && spec.advantageIfItems.every(id=>hasItem(game,id));
        const results=[]; let successes=0;
        for(let i=0;i<spec.count;i++){
          const r=rollD20({advantage}); const total=r.roll+Number(spec.modifier||0); const ok=total>=spec.dc; if(ok)successes++;
          results.push(`${r.roll}+${spec.modifier||0}=${total}${ok?'○':'×'}`);
        }
        p.values[spec.store || `multi:${scene.id}`]=successes;
        saveGame(game);
        afterRoll(root, `${results.join(' / ')}　成功 ${successes}/${spec.count}`, successes>=spec.successNeeded?spec.success:spec.failure);
      });
      return;
    }

    if (scene.multiCheck) {
      for (const option of scene.multiCheck.options || []) {
        action(root, `${scene.multiCheck.label}：${option.skill}`, async () => {
          const game=getGame(); const spec=scene.multiCheck; let successes=0; const results=[];
          for(let i=0;i<spec.count;i++){
            const r=rollD20(); const mod=characterCheckMod(game,option.ability,option.skill); const total=r.roll+mod; const ok=total>=spec.dc; if(ok)successes++;
            results.push(`${r.roll}${mod>=0?'+':''}${mod}=${total}${ok?'○':'×'}`);
          }
          if(spec.rewardPerSuccess && successes){ await loadModule(scenario.id,'items'); for(let i=0;i<successes;i++) await addItem(spec.rewardPerSuccess.itemId,spec.rewardPerSuccess.quantity||1); }
          const latest=getGame(); const lp=progress(latest,scenario.id); lp.values[`multi:${scene.id}`]=successes; saveGame(latest);
          afterRoll(root, `${results.join(' / ')}　成功 ${successes}/${spec.count}`, spec.next);
        });
      }
      return;
    }

    if (scene.itemBranch) {
      action(root,'持ち物を確認して進む',()=>{
        const game=getGame(); const spec=scene.itemBranch;
        const yes=Array.isArray(spec.all)?spec.all.every(id=>hasItem(game,id)):Array.isArray(spec.any)?spec.any.some(id=>hasItem(game,id)):false;
        gotoScene(yes?spec.yes:spec.no);
      });
      return;
    }

    if (scene.itemCheck) {
      action(root,scene.itemCheck.label || '持ち物を確認する',()=>{
        const game=getGame(); const ok=(scene.itemCheck.all||[]).every(id=>hasItem(game,id));
        if(!ok){ root.innerHTML=''; addResult(root,'必要な所持品がありません。原文ではこの場合の次のEntryが明記されていません。'); return; }
        runCheck(root,scene.itemCheck,scenario,state,p);
      });
      return;
    }

    if (scene.stateBranch) {
      action(root,'続ける',()=>gotoScene(state[scene.stateBranch.key]?scene.stateBranch.truthy:scene.stateBranch.falsy));
      return;
    }

    if (scene.roll) {
      action(root,scene.roll.label || `d${scene.roll.die}を振る`,()=>{
        let value=1+Math.floor(Math.random()*scene.roll.die); let bonus=0;
        for(const m of scene.roll.stateModifiers||[]) if(state[m.key]) bonus+=m.value;
        const total=value+bonus;
        const range=(scene.roll.ranges||[]).find(r=>(r.min==null||total>=r.min)&&(r.max==null||total<=r.max));
        afterRoll(root,`出目 ${value}${bonus?` + ${bonus}`:''} = ${total}`,range?.next);
      });
      return;
    }

    if (scene.attackOutcome) {
      action(root,'攻撃／効果が成功した',()=>gotoScene(scene.attackOutcome.hit));
      action(root,'攻撃／効果が失敗した',()=>gotoScene(scene.attackOutcome.miss));
      return;
    }

    if (scene.procedure?.type === 'climb') {
      action(root,'登攀判定をまとめて行う',()=>{
        const game=getGame(); const c=game.character||{}; const spec=scene.procedure; const wandered=!!state.WANDERED;
        const ath=characterCheckMod(game,'str','Athletics'); let damage=0; const results=[];
        for(let i=0;i<spec.pcCount;i++){
          const r=rollD20({disadvantage:wandered}); const total=r.roll+ath; const ok=total>=spec.pcDc; results.push(`登攀${i+1}:${total}${ok?'○':'×'}`);
          if(!ok){ const str=abilityMod(c.abilities?.str), dex=abilityMod(c.abilities?.dex), best=Math.max(str,dex); const s=rollD20(); const save=s.roll+best; const dmg=rollDice(save>=spec.fallSaveDc?spec.fallSuccessDamage:spec.fallFailureDamage); damage+=dmg; }
        }
        const th=rollD20(); const thTotal=th.roll+6; if(thTotal<spec.thalgarDc){ const d=rollDice(spec.thalgarFailureDamage); state.thalgarHp=Math.max(0,Number(state.thalgarHp??68)-d); if(state.thalgarHp<=0) state.thalgarDead=true; results.push(`Thalgar:${thTotal}×`); } else results.push(`Thalgar:${thTotal}○`);
        if(damage && Number.isFinite(Number(c.hp))) c.hp=Math.max(0,Number(c.hp)-damage);
        saveGame(game);
        afterRoll(root,`${results.join(' / ')}${damage?`　PC転落ダメージ合計 ${damage}`:''}`,scene.next);
      });
      return;
    }

    if (scene.combat) {
      const monsters = await loadModule(scenario.id,'monsters') || [];
      const selected=(scene.combat.monsterIds||[]).map(id=>monsters.find(v=>v.id===id)).filter(Boolean);
      addResult(root,`戦闘：${selected.map(v=>`${v.name} ×${v.count||1}`).join(' / ') || scene.combat.encounter}`);
      const game=getGame(); game.pendingCombat={scenarioId:scenario.id,sceneId:scene.id,encounter:scene.combat.encounter,onWin:scene.combat.onWin}; saveGame(game);
      const note=document.createElement('div'); note.className='scenario-note'; note.textContent='戦闘データまでは接続済みです。戦闘画面への接続は次の工程です。'; root.appendChild(note);
      return;
    }

    if (scene.next) action(root,'次へ',()=>gotoScene(scene.next));
  }

  async function start(id, reset=false) {
    if (!id) return null;
    injectStyle();
    if (!window.DDScenarioLoader) await window.DDEnsureScenarioLoader?.();
    const scenario = await window.DDScenarioLoader.loadScenario(id);
    currentScenarioId = id;
    await window.DDScenarioLoader.loadModule(id,'scenes');
    await window.DDScenarioLoader.loadModule(id,'items');
    let game=getGame(); const p=progress(game,id);
    if(reset){ p.currentSceneId=scenario.startSceneId; p.visited={}; p.values={}; p.purchases=[]; game.scenarioStates[id]=clone(scenario.states||{}); }
    saveGame(game);
    await gotoScene(p.currentSceneId || scenario.startSceneId);
    return scenario;
  }

  return { start, gotoScene };
})();
