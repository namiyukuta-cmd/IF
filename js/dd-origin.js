(() => {
  const SRD = window.DD_SRD_CHARACTER;
  const ORIGIN = window.DD_ORIGIN_OPTIONS;
  const JA = window.DD_JA_LABELS || {};
  if (!SRD || !ORIGIN) return;

  const $ = id => document.getElementById(id);
  const bgWrap = $('backgroundOriginChoiceSection');
  const speciesWrap = $('speciesOriginChoiceSection');
  const form = $('characterForm');
  if (!bgWrap || !speciesWrap || !form) return;

  const state = { background:{}, human:{} };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const baseFeatName = value => String(value||'').replace(/\s*\([^)]*\)\s*$/,'');
  const formatFeat = value => {
    const raw=String(value||'');
    const base=baseFeatName(raw);
    const ja=JA.feats?.[base];
    return ja ? `${base}（${ja}）${raw.slice(base.length)}` : raw;
  };
  const featDesc = value => JA.featDescriptions?.[baseFeatName(value)] || '';
  const spellInfo = value => {
    if(typeof JA.spell==='function') return JA.spell(value);
    const v=JA.spells?.[value];
    return v?{label:`${value}（${v[0]}）`,desc:v[1]}:{label:value,desc:''};
  };
  const skillLabel = value => JA.skills?.[value] ? `${value}（${JA.skills[value]}）` : value;

  function bgId(){ return $('background')?.value || ''; }
  function speciesId(){ return $('species')?.value || ''; }
  function bgRule(){ return ORIGIN.backgrounds[bgId()] || null; }
  function isHuman(){ return speciesId() === 'Human'; }
  function backgroundFeatBase(){ return bgRule()?.feat || ''; }

  function selectedValues(name){
    return [...document.querySelectorAll(`[name="${CSS.escape(name)}"]:checked`)].map(el => el.value);
  }

  function validHumanFeats(){
    const bgFeat = backgroundFeatBase();
    return ORIGIN.originFeats.filter(feat => feat !== bgFeat || ORIGIN.repeatableFeats.includes(feat));
  }

  function syncHumanFeatOptions(){
    if (!isHuman() || !$('humanFeat')) return;
    const select = $('humanFeat');
    const old = select.value;
    const valid = validHumanFeats();
    select.innerHTML = valid.map(v => `<option value="${esc(v)}">${esc(formatFeat(v))}</option>`).join('');
    select.value = valid.includes(old) ? old : (valid.includes('Skilled') ? 'Skilled' : valid[0] || '');
  }

  function spellAbilityOptions(selected){
    const opts = [['Intelligence','知力（INT）'],['Wisdom','判断力（WIS）'],['Charisma','魅力（CHA）']];
    return opts.map(([v,l]) => `<option value="${v}" ${selected===v?'selected':''}>${l}</option>`).join('');
  }

  function renderSpellMulti(name, options, selected, count){
    const set = new Set(selected || []);
    return `<p class="choice-explain">キャントリップは呪文スロットを使わず、基本的に何度でも使える基本魔法です。${count}個選びます。</p><div class="choice-grid">${options.map(v => {
      const info=spellInfo(v);
      return `<label class="check-card"><input type="checkbox" name="${esc(name)}" value="${esc(v)}" ${set.has(v)?'checked':''}><span><strong>${esc(info.label)}</strong>${info.desc?`<small>${esc(info.desc)}</small>`:''}</span></label>`;
    }).join('')}</div>`;
  }

  function level1SelectHtml(prefix, spellData, selected){
    const chosen=spellData.level1.includes(selected)?selected:(spellData.level1[0]||'');
    const info=spellInfo(chosen);
    return `<label class="field compact-field">Level 1 Spell（レベル1呪文）<select id="${prefix}Level1">${spellData.level1.map(v=>{const s=spellInfo(v);return `<option value="${esc(v)}" ${v===chosen?'selected':''}>${esc(s.label)}</option>`;}).join('')}</select></label><div class="info-box"><strong>${esc(info.label)}</strong><span>${esc(info.desc || '選んだレベル1呪文です。')}</span></div>`;
  }

  function magicInitiateHtml(prefix, fixedList, data, ownerLabel){
    const allowedLists = fixedList ? [fixedList] : ['Cleric','Druid','Wizard'].filter(list => list !== bgRule()?.fixedSpellList);
    let list = data.spellList;
    if (!allowedLists.includes(list)) list = allowedLists[0] || '';
    data.spellList = list;
    const spellData = ORIGIN.spellLists[list] || {cantrips:[],level1:[]};
    data.ability = data.ability || 'Intelligence';
    data.cantrips = Array.isArray(data.cantrips) ? data.cantrips.filter(v => spellData.cantrips.includes(v)) : [];
    data.level1 = spellData.level1.includes(data.level1) ? data.level1 : (spellData.level1[0] || '');

    return `
      <div class="class-choice-group">
        <div class="class-choice-head"><strong>Magic Initiate（魔法のたしなみ）</strong><span class="class-choice-count">Origin Feat</span></div>
        <p class="choice-explain">${esc(ownerLabel)}で得た初期特技です。${esc(featDesc('Magic Initiate'))}</p>
        ${fixedList
          ? `<div class="info-box"><strong>呪文リスト：${esc(fixedList)}（背景で固定）</strong><span>このMagic Initiateで覚える魔法は${esc(fixedList)}の呪文リストから選びます。背景によって決まっているため、ここは変更しません。</span></div>`
          : `<label class="field compact-field">呪文リスト<select id="${prefix}SpellList">${allowedLists.map(v=>`<option value="${v}" ${v===list?'selected':''}>${v}</option>`).join('')}</select></label><div class="info-box"><span>どのクラス系統の魔法を覚えるかを選びます。この選択は、このMagic Initiateで選べるキャントリップとレベル1呪文を決めます。</span></div>`}
        <label class="field compact-field">呪文能力値<select id="${prefix}SpellAbility">${spellAbilityOptions(data.ability)}</select></label>
        <div class="info-box"><span>呪文能力値は、この特技で覚えた呪文の攻撃やセーヴ難易度などに使う能力値です。</span></div>
        <h3 class="subhead">Cantrip（キャントリップ）</h3>
        ${renderSpellMulti(`${prefix}Cantrip`, spellData.cantrips, data.cantrips, 2)}
        <h3 class="subhead">Level 1 Spell（レベル1呪文）</h3>
        <p class="choice-explain">キャントリップより強力な呪文です。Magic Initiateでは1つ選びます。</p>
        ${level1SelectHtml(prefix,spellData,data.level1)}
      </div>`;
  }

  function saveDomState(){
    const rule = bgRule();
    if (rule?.feat === 'Magic Initiate') {
      state.background.spellList = rule.fixedSpellList;
      state.background.ability = $('bgSpellAbility')?.value || state.background.ability || 'Intelligence';
      state.background.cantrips = selectedValues('bgCantrip');
      state.background.level1 = $('bgLevel1')?.value || state.background.level1 || '';
    }
    if (rule?.gamingSet) state.background.gamingSet = $('bgGamingSet')?.value || state.background.gamingSet || ORIGIN.gamingSets[0];

    if (isHuman()) {
      state.human.feat = $('humanFeat')?.value || state.human.feat || '';
      if (state.human.feat === 'Magic Initiate') {
        state.human.spellList = $('humanSpellList')?.value || state.human.spellList || '';
        state.human.ability = $('humanSpellAbility')?.value || state.human.ability || 'Intelligence';
        state.human.cantrips = selectedValues('humanCantrip');
        state.human.level1 = $('humanLevel1')?.value || state.human.level1 || '';
      } else if (state.human.feat === 'Skilled') {
        state.human.skilled = selectedValues('humanSkilled');
      }
    }
  }

  function renderBackgroundOrigin(){
    const rule = bgRule();
    const bg = SRD.backgrounds[bgId()];
    const html = [];
    const feat=bg?.feat || rule?.feat || '';
    html.push(`<h3 class="subhead">Backgroundで得るOrigin Feat（初期特技）</h3>`);
    html.push(`<div class="info-box"><strong>${esc(formatFeat(feat))}</strong><span>${esc(featDesc(feat) || 'このBackgroundから得る初期特技です。')}</span></div>`);

    if (rule?.feat === 'Magic Initiate') {
      state.background.spellList = rule.fixedSpellList;
      html.push(magicInitiateHtml('bg', rule.fixedSpellList, state.background, bg?.ja || bgId()));
    } else if (rule?.gamingSet) {
      state.background.gamingSet = state.background.gamingSet || ORIGIN.gamingSets[0];
      html.push(`<div class="class-choice-group"><div class="class-choice-head"><strong>Gaming Set（ゲーム用具）</strong><span class="class-choice-count">1つ選択</span></div><p class="choice-explain">SoldierのTool Proficiency（道具習熟）として、どのゲーム用具に習熟するかを決めます。</p><label class="field compact-field">Gaming Set<select id="bgGamingSet">${ORIGIN.gamingSets.map(v=>`<option value="${esc(v)}" ${v===state.background.gamingSet?'selected':''}>${esc(v)}</option>`).join('')}</select></label></div>`);
    } else {
      html.push(`<p class="mini-note">このBackgroundでは、Origin Featについて追加で選ぶ項目はありません。</p>`);
    }
    bgWrap.innerHTML = html.join('');
  }

  function toolLabel(value){
    const items=Object.values(window.DD_ITEMS||{});
    const item=items.find(x=>x.name===value || (x.aliases||[]).includes(value));
    return item?.ja ? `${value}（${item.ja}）` : value;
  }

  function renderHumanOrigin(){
    if (!isHuman()) { speciesWrap.innerHTML=''; return; }
    const feat=$('humanFeat')?.value || state.human.feat || '';
    state.human.feat=feat;
    const html=[];
    html.push(`<h3 class="subhead">Humanの追加Origin Feat</h3>`);
    html.push(`<div class="info-box"><strong>${esc(formatFeat(feat))}</strong><span>${esc(featDesc(feat) || 'HumanのVersatileで追加取得する初期特技です。')}</span></div>`);

    if (feat === 'Magic Initiate') {
      html.push(magicInitiateHtml('human', '', state.human, 'HumanのVersatile'));
    } else if (feat === 'Skilled') {
      const options = [
        ...ORIGIN.skills.map(v=>({value:`skill:${v}`,label:`技能：${skillLabel(v)}`,desc:JA.skillDescriptions?.[v]||''})),
        ...ORIGIN.tools.map(v=>({value:`tool:${v}`,label:`道具：${toolLabel(v)}`,desc:''}))
      ];
      const set = new Set(state.human.skilled || []);
      html.push(`<div class="class-choice-group"><div class="class-choice-head"><strong>Skilled（技能習熟）</strong><span class="class-choice-count">3つ選択</span></div><p class="choice-explain">技能または道具から、合計3つの習熟を追加します。</p><div class="choice-grid">${options.map(o=>`<label class="check-card"><input type="checkbox" name="humanSkilled" value="${esc(o.value)}" ${set.has(o.value)?'checked':''}><span><strong>${esc(o.label)}</strong>${o.desc?`<small>${esc(o.desc)}</small>`:''}</span></label>`).join('')}</div></div>`);
    } else {
      html.push(`<p class="mini-note">このOrigin Featでは、キャラクター作成時に追加で選ぶ項目はありません。</p>`);
    }
    speciesWrap.innerHTML=html.join('');
  }

  function render(){
    saveDomState();
    syncHumanFeatOptions();
    renderBackgroundOrigin();
    renderHumanOrigin();
    bindDynamic();
  }

  function bindDynamic(){
    $('humanSpellList')?.addEventListener('change',()=>{ saveDomState(); render(); });
    ['bgLevel1','humanLevel1'].forEach(id => $(id)?.addEventListener('change',()=>{saveDomState();render();}));
    ['bgSpellAbility','bgGamingSet','humanSpellAbility'].forEach(id => $(id)?.addEventListener('change', saveDomState));
    document.querySelectorAll('input[name="bgCantrip"],input[name="humanCantrip"],input[name="humanSkilled"]').forEach(el => el.addEventListener('change', saveDomState));
  }

  function validateBackground(){
    saveDomState();
    const rule = bgRule();
    if (rule?.feat === 'Magic Initiate') {
      if ((state.background.cantrips || []).length !== 2) return `${SRD.backgrounds[bgId()]?.ja || bgId()}のMagic Initiateでキャントリップを2つ選んでください。`;
      if (!state.background.level1) return `${SRD.backgrounds[bgId()]?.ja || bgId()}のMagic Initiateでレベル1呪文を選んでください。`;
    }
    if (rule?.gamingSet && !state.background.gamingSet) return 'SoldierのGaming Setを1つ選んでください。';
    return '';
  }

  function validateHuman(){
    saveDomState();
    if (!isHuman()) return '';
    const feat = $('humanFeat')?.value || '';
    const rule=bgRule();
    if (!validHumanFeats().includes(feat)) return 'Humanの追加Origin Featを選び直してください。';
    if (feat === 'Magic Initiate') {
      if (!state.human.spellList) return 'HumanのMagic Initiateで呪文リストを選んでください。';
      if (state.human.spellList === rule?.fixedSpellList) return 'Magic Initiateを2回取る場合、別の呪文リストを選んでください。';
      if ((state.human.cantrips || []).length !== 2) return 'HumanのMagic Initiateでキャントリップを2つ選んでください。';
      if (!state.human.level1) return 'HumanのMagic Initiateでレベル1呪文を選んでください。';
    }
    if (feat === 'Skilled' && (state.human.skilled || []).length !== 3) return `HumanのSkilledで技能または道具を3つ選んでください。現在は${(state.human.skilled || []).length}個です。`;
    return '';
  }

  function validate(){ return validateBackground() || validateHuman(); }

  function showError(message){
    const box = $('errorBox');
    if (!box) return;
    box.textContent = message;
    box.hidden = !message;
    if (message) box.scrollIntoView({block:'nearest'});
  }

  function snapshot(){
    saveDomState();
    const out = { background:{ feat:SRD.backgrounds[bgId()]?.feat || backgroundFeatBase(), ...state.background } };
    if (isHuman()) out.human = { feat:$('humanFeat')?.value || '', ...state.human };
    return out;
  }

  function enrichGame(game){
    if (!game?.character) return game;
    const data = snapshot();
    game.character.originChoices = data;
    game.character.originSpells = {};

    if (data.background?.spellList) {
      game.character.originSpells.background = {
        feat:data.background.feat,
        spellList:data.background.spellList,
        spellcastingAbility:data.background.ability,
        cantrips:[...(data.background.cantrips || [])],
        level1:data.background.level1 || ''
      };
    }
    if (data.human?.feat === 'Magic Initiate') {
      game.character.originSpells.human = {
        feat:'Magic Initiate',
        spellList:data.human.spellList,
        spellcastingAbility:data.human.ability,
        cantrips:[...(data.human.cantrips || [])],
        level1:data.human.level1 || ''
      };
    }

    if (data.background?.gamingSet) {
      game.character.toolProficiencies = (game.character.toolProficiencies || []).filter(v => !String(v).startsWith('Gaming Set'));
      game.character.toolProficiencies.push(`Gaming Set: ${data.background.gamingSet}`);
      const gamingSetId = window.DDInventory?.resolveItemId(data.background.gamingSet, false);
      const ownedGamingSet = (game.inventory || []).find(item => item.itemId === 'gaming_set');
      if (gamingSetId && ownedGamingSet) ownedGamingSet.itemId = gamingSetId;
    }

    if (data.human?.feat === 'Skilled') {
      const skillAdds = (data.human.skilled || []).filter(v=>v.startsWith('skill:')).map(v=>v.slice(6));
      const toolAdds = (data.human.skilled || []).filter(v=>v.startsWith('tool:')).map(v=>v.slice(5));
      game.character.skills = [...new Set([...(game.character.skills || []), ...skillAdds])];
      game.character.toolProficiencies = [...new Set([...(game.character.toolProficiencies || []), ...toolAdds])];
    }

    game.character.pendingChoices = (game.character.pendingChoices || []).filter(v =>
      !String(v).includes('Magic Initiate') &&
      !String(v).includes('Gaming Setの種類') &&
      !String(v).includes('Human Origin Feat')
    );
    return game;
  }

  const originalSetItem = Storage.prototype.setItem;
  if (!window.__ddOriginStoragePatched) {
    window.__ddOriginStoragePatched = true;
    Storage.prototype.setItem = function(key, value){
      if (this === localStorage && key === 'ddActiveGame') {
        try { value = JSON.stringify(enrichGame(JSON.parse(value))); } catch (_) {}
      }
      return originalSetItem.call(this, key, value);
    };
  }

  $('background')?.addEventListener('change',()=>{ state.background={}; render(); });
  $('species')?.addEventListener('change',()=>{ state.human={}; render(); });
  $('humanFeat')?.addEventListener('change',()=>{ state.human={feat:$('humanFeat').value}; render(); });

  $('nextBtn')?.addEventListener('click', e => {
    const dots = [...document.querySelectorAll('.step-dot')];
    const active = dots.findIndex(dot => dot.classList.contains('active'));
    let err='';
    if(active===1) err=validateBackground();
    if(active===2) err=validateHuman();
    if (!err) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    showError(err);
  }, true);

  form.addEventListener('submit', e => {
    const err = validate();
    if (!err) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    showError(err);
  }, true);

  render();
})();
