(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  let battlePromise = null;

  function game(){ try{return JSON.parse(localStorage.getItem('ddActiveGame')||'{}');}catch(_){return {};} }

  function injectStyle(){
    if($('ddUiPatchStyle')) return;
    const style=document.createElement('style');
    style.id='ddUiPatchStyle';
    style.textContent=`
      /* 所持品詳細を縦に伸ばしすぎない */
      #windowContent:has(.item-detail){padding:5px 7px 7px}
      #windowContent:has(.item-detail) .item-back{min-height:31px;padding:3px 7px;font-size:11px;margin:0 0 4px}
      .item-detail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 6px;align-items:start}
      .item-detail h2{grid-column:1/-1;font-size:15px!important;line-height:1.1;margin:2px 0 0!important}
      .item-ja,.item-owned-count,.item-equipped-label{margin:0!important;font-size:10px!important;line-height:1.2}
      .item-equipped-label{font-weight:800}
      .item-text-section{margin:1px 0!important;padding:5px 6px!important;min-height:0}
      .item-text-section h3{font-size:11px!important;margin:0 0 2px!important}
      .item-text-section p{font-size:10px!important;line-height:1.35!important;margin:0!important}
      .item-stat-list{grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:9px}
      .item-stat{min-height:25px!important;font-size:10px!important;line-height:1.1}
      .item-list-section{grid-column:1/-1;margin:1px 0!important;padding:3px 0}
      .item-list-section h3{font-size:11px!important;margin:0 0 2px!important}
      .item-list-section ul{display:flex;flex-wrap:wrap;gap:2px 10px;margin:0;padding:0;list-style:none;font-size:9px;line-height:1.25}
      .item-actions{grid-column:1/-1;margin-top:2px!important;position:sticky;bottom:0;background:#f0e1c5;padding-top:3px}
      .item-actions button{min-height:34px!important;font-size:11px!important;padding:4px 7px!important}
      .roll-ready-note{margin:4px 0 0;padding:4px 6px;border-left:3px solid #8a6b48;background:#e5d1b1;font-size:10px;font-weight:700}
      .map-visual-wrap{display:grid;gap:6px}
      .map-visual-current{padding:6px 8px;border:1px solid #9d805c;background:#e1c9a2;border-radius:6px;font-size:12px;font-weight:800}
      .map-visual{border:1px solid #9d805c;border-radius:7px;overflow:hidden;background:#f8ead0}
      .map-visual img{display:block;width:100%;max-height:62vh;object-fit:contain;background:#ddd}
      .map-visual-label{padding:5px 7px;font-size:11px;font-weight:800}
      .map-no-image{padding:9px;border:1px dashed #a48a64;border-radius:6px;font-size:11px;color:#715a40}
      .map-thumb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
      .map-thumb{border:1px solid #ad936d;border-radius:6px;overflow:hidden;background:#f8ead0;font-size:10px}
      .map-thumb img{display:block;width:100%;aspect-ratio:1;object-fit:cover}.map-thumb span{display:block;padding:4px}
    `;
    document.head.appendChild(style);
  }

  function isRollAction(button){
    const t=(button.textContent||'').trim();
    return /判定|セーヴ|d20|登攀|毛皮採取|馬を落ち着かせる|協力者を探す|Yetiから離れる|焚き火を起こす/.test(t);
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#scenarioActions .scenario-action');
    if(!button||!isRollAction(button)) return;
    if(button.dataset.rollArmed==='1'){
      delete button.dataset.rollArmed;
      document.querySelector('.roll-ready-note')?.remove();
      return;
    }
    event.preventDefault();event.stopImmediatePropagation();
    const original=(button.textContent||'判定').trim();
    button.dataset.rollArmed='1';
    button.textContent=`d20を振る　－ ${original}`;
    document.querySelector('.roll-ready-note')?.remove();
    const note=document.createElement('div');note.className='roll-ready-note';note.textContent='まだ判定していません。もう一度タップするとダイスを振ります。';button.after(note);
  },true);

  function closeWindow(){ const layer=$('windowLayer'); if(layer)layer.hidden=true; }
  function openMapWindow(){
    const layer=$('windowLayer'),title=$('windowTitle'),content=$('windowContent'); if(!layer||!title||!content)return;
    if(!layer.hidden&&title.textContent==='マップ'){closeWindow();return;}
    const g=game(),id=g.activeQuestId||g.quest?.id,currentId=g.location?.id||'';
    const maps=window.DDScenarioData?.[id]?.maps||[];
    const current=maps.find(v=>v.id===currentId)||null;
    const discovered=(g.discoveredMaps||[]).map(v=>typeof v==='string'?v:v.id);
    const visualMaps=maps.filter(v=>v.image&&discovered.includes(v.id));
    title.textContent='マップ';
    let html=`<div class="map-visual-wrap"><div class="map-visual-current">現在地：${escapeHtml(g.location?.label||g.current?.location||'未設定')}</div>`;
    if(current?.image) html+=`<div class="map-visual"><img src="${escapeHtml(current.image)}" alt="${escapeHtml(current.name)}"><div class="map-visual-label">${escapeHtml(current.name)}</div></div>`;
    else html+=`<div class="map-no-image">この場所には専用の画像マップはありません。戦闘マップは戦闘地点へ到達すると表示されます。</div>`;
    if(visualMaps.length){html+=`<div class="map-thumb-grid">${visualMaps.map(v=>`<div class="map-thumb"><img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.name)}"><span>${escapeHtml(v.name)}</span></div>`).join('')}</div>`;}
    html+='</div>'; content.innerHTML=html; layer.hidden=false;
  }
  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  document.addEventListener('click',event=>{
    if(!event.target.closest?.('#mapButton'))return;
    event.preventDefault();event.stopImmediatePropagation();openMapWindow();
  },true);

  async function loadMaps(id){
    if(!id)return null;
    try{
      if(!window.DDScenarioLoader) await window.DDEnsureScenarioLoader?.();
      return await window.DDScenarioLoader?.loadModule(id,'maps');
    }catch(_){return null;}
  }

  function ensureBattle(){
    if(window.DDBattle)return Promise.resolve(window.DDBattle);
    if(battlePromise)return battlePromise;
    battlePromise=new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.src='js/dd-battle.js?v=20260830-2';s.async=true;s.onload=()=>resolve(window.DDBattle);s.onerror=()=>reject(new Error('戦闘機能を読み込めませんでした。'));document.head.appendChild(s);
    });
    return battlePromise;
  }

  async function upgradeCombat(){
    const root=$('scenarioActions'); if(!root)return;
    const g=game(),pending=g.pendingCombat; if(!pending)return;
    if(root.dataset.combatReady===String(pending.sceneId))return;
    const id=pending.scenarioId;
    try{
      if(!window.DDScenarioLoader)await window.DDEnsureScenarioLoader?.();
      const scenario=await window.DDScenarioLoader.loadScenario(id);
      const scenes=await window.DDScenarioLoader.loadModule(id,'scenes')||[];
      const monsters=await window.DDScenarioLoader.loadModule(id,'monsters')||[];
      const maps=await loadMaps(id)||[];
      const scene=scenes.find(v=>String(v.id)===String(pending.sceneId)); if(!scene?.combat)return;
      const selected=(scene.combat.monsterIds||[]).map(mid=>monsters.find(v=>v.id===mid)).filter(Boolean);
      const map=maps.find(v=>v.id===scene.mapId)||null;
      root.dataset.combatReady=String(pending.sceneId);
      root.innerHTML=`<div class="scenario-result">戦闘：${escapeHtml(selected.map(v=>`${v.ja||v.name} ×${v.count||1}`).join(' / '))}</div><button id="startScenarioBattle" class="scenario-action" type="button">戦闘開始</button>`;
      $('startScenarioBattle')?.addEventListener('click',()=>{location.href='DD_battle.html?v=20260830-2023';});
    }catch(error){console.error(error);}
  }

  document.addEventListener('ddscenario:loaded',event=>{loadMaps(event.detail?.id);setTimeout(upgradeCombat,0);});
  const observer=new MutationObserver(()=>upgradeCombat());
  const observe=()=>{const root=$('storyArea');if(root)observer.observe(root,{childList:true,subtree:true});upgradeCombat();};

  injectStyle();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{observe();const g=game();loadMaps(g.activeQuestId||g.quest?.id);},{once:true});
  else{observe();const g=game();loadMaps(g.activeQuestId||g.quest?.id);}
})();
