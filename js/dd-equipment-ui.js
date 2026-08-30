(() => {
  'use strict';

  const SLOT_DEFS = [
    { id:'head', label:'頭' },
    { id:'neck', label:'首' },
    { id:'armor', label:'防具' },
    { id:'hands', label:'手' },
    { id:'feet', label:'足' },
    { id:'mainHand', label:'利き手' },
    { id:'offHand', label:'逆手' },
    { id:'other', label:'その他魔法道具' }
  ];

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function injectStyle(){
    if ($('ddEquipmentUiStyle')) return;
    const style = document.createElement('style');
    style.id = 'ddEquipmentUiStyle';
    style.textContent = `
      #quickBar{grid-template-columns:repeat(6,minmax(0,1fr))!important}
      #quickBar .quick-button{font-size:10px!important;padding-left:0!important;padding-right:0!important}
      .equip-screen{display:grid;gap:6px}
      .equip-help{margin:0;padding:6px 8px;border:1px solid #a48a64;border-radius:6px;background:#e1c9a2;font-size:11px;line-height:1.35}
      .equip-slot-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
      .equip-slot-button{min-width:0;min-height:54px;padding:6px 7px;border:1px solid #9d805c;border-radius:7px;background:#f8ead0;color:#342719;text-align:left}
      .equip-slot-label{display:block;font-size:11px;font-weight:850;color:#624b34}
      .equip-slot-current{display:block;margin-top:3px;font-size:12px;font-weight:800;line-height:1.2;overflow-wrap:anywhere}
      .equip-slot-empty{color:#806e58;font-weight:600}
      .equip-picker-title{margin:2px 0 0;font-size:14px}
      .equip-candidate-list{display:grid;gap:5px}
      .equip-candidate{width:100%;min-height:46px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;padding:6px 8px;border:1px solid #a98d67;border-radius:6px;background:#f8ead0;color:#342719;text-align:left}
      .equip-candidate strong{display:block;font-size:12px;line-height:1.15}
      .equip-candidate small{display:block;margin-top:2px;font-size:10px;color:#715a40;line-height:1.15}
      .equip-candidate .equip-action{font-size:10px;font-weight:850;white-space:nowrap}
      .equip-picker-back,.equip-remove{min-height:38px;border:1px solid #806849;border-radius:6px;background:#ead4ae;color:#352719;font-size:12px;font-weight:850;padding:6px 9px}
      .equip-remove{background:#e4c9a0}
      .equip-none{padding:10px;border:1px dashed #a48a64;border-radius:6px;font-size:12px;text-align:center;color:#715a40}
      @media(max-width:370px){#quickBar .quick-button{font-size:9px!important}.equip-slot-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function getGame(){ return window.DDInventory?.getGame?.() || {}; }

  function itemName(data){ return data?.ja || data?.name || data?.id || '装備'; }

  function getEquipped(game, slot){
    return (game.equipment || []).find(entry => entry.slot === slot) || null;
  }

  function equippedData(game, slot){
    const entry = getEquipped(game, slot);
    if (!entry) return null;
    const owned = (game.inventory || []).find(v => v.uid === entry.uid) || (game.inventory || []).find(v => v.itemId === entry.itemId);
    return window.DDInventory?.itemData?.(entry.itemId || owned?.itemId) || null;
  }

  function textForMatch(data){
    return `${data?.id||''} ${data?.name||''} ${data?.ja||''} ${(data?.properties||[]).join(' ')} ${data?.equipSlot||''} ${data?.slot||''}`.toLowerCase();
  }

  function explicitSlot(data){ return String(data?.equipSlot || data?.slot || '').trim(); }

  function canEquipInSlot(data, slot){
    if (!data) return false;
    if (['ammo','consumable','pack','book'].includes(data.type)) return false;
    const declared = explicitSlot(data);
    if (declared) return declared === slot;
    const text = textForMatch(data);
    const props = Array.isArray(data.properties) ? data.properties.map(String) : [];

    if (slot === 'armor') return data.type === 'armor' && data.id !== 'shield';
    if (slot === 'mainHand') return data.type === 'weapon';
    if (slot === 'offHand') {
      if (data.id === 'shield') return true;
      if (data.type !== 'weapon') return false;
      return !props.some(v => /two-handed/i.test(v));
    }
    if (slot === 'head') return /\b(helm|helmet|hat|cap|circlet|headband|crown|mask|goggles)\b|兜|帽子|冠|頭/.test(text);
    if (slot === 'neck') return /\b(amulet|necklace|periapt|pendant|talisman)\b|首飾り|首輪|護符/.test(text);
    if (slot === 'hands') return /\b(glove|gloves|gauntlet|gauntlets|bracer|bracers)\b|手袋|籠手|腕甲/.test(text);
    if (slot === 'feet') return /\b(boot|boots|shoe|shoes|slipper|slippers)\b|ブーツ|靴|履物/.test(text);
    if (slot === 'other') {
      return !['weapon','armor'].includes(data.type)
        && !canEquipInSlot(data,'head')
        && !canEquipInSlot(data,'neck')
        && !canEquipInSlot(data,'hands')
        && !canEquipInSlot(data,'feet');
    }
    return false;
  }

  function refreshChrome(){
    try { window.renderEquipment?.(); } catch (_) {}
    try { window.renderHeader?.(); } catch (_) {}
  }

  function openWindow(){
    const layer=$('windowLayer'), title=$('windowTitle'), content=$('windowContent');
    if(!layer||!title||!content||!window.DDInventory) return;
    if(!layer.hidden && title.textContent === '装備'){
      layer.hidden = true;
      refreshChrome();
      return;
    }
    title.textContent='装備';
    layer.hidden=false;
    renderSlots();
  }

  function renderSlots(){
    const content=$('windowContent'); if(!content) return;
    const game=getGame();
    content.innerHTML=`
      <div class="equip-screen">
        <p class="equip-help">装備する場所を選んでください。押すと、所持品の中からその場所に装備できる物だけを表示します。</p>
        <div class="equip-slot-grid">
          ${SLOT_DEFS.map(slot=>{
            const data=equippedData(game,slot.id);
            return `<button class="equip-slot-button" data-equip-slot="${esc(slot.id)}" type="button"><span class="equip-slot-label">${esc(slot.label)}</span><span class="equip-slot-current ${data?'':'equip-slot-empty'}">${esc(data?itemName(data):'なし')}</span></button>`;
          }).join('')}
        </div>
      </div>`;
    content.querySelectorAll('[data-equip-slot]').forEach(button=>button.addEventListener('click',()=>renderPicker(button.dataset.equipSlot)));
  }

  function renderPicker(slotId){
    const content=$('windowContent'); if(!content) return;
    const def=SLOT_DEFS.find(v=>v.id===slotId); if(!def) return renderSlots();
    const game=getGame();
    const current=getEquipped(game,slotId);
    const candidates=(game.inventory||[]).filter(owned=>canEquipInSlot(window.DDInventory.itemData(owned.itemId),slotId));
    content.innerHTML=`
      <div class="equip-screen">
        <button class="equip-picker-back" id="equipPickerBack" type="button">← 装備一覧</button>
        <h3 class="equip-picker-title">${esc(def.label)}に装備</h3>
        ${current?`<button class="equip-remove" id="equipRemoveCurrent" type="button">現在の装備を外す</button>`:''}
        <div class="equip-candidate-list">
          ${candidates.length?candidates.map(owned=>{
            const data=window.DDInventory.itemData(owned.itemId);
            const isCurrent=current?.uid===owned.uid;
            return `<button class="equip-candidate" data-equip-uid="${esc(owned.uid)}" type="button"><span><strong>${esc(itemName(data))}</strong><small>${esc(data.name||'')}　×${esc(owned.quantity||1)}</small></span><span class="equip-action">${isCurrent?'装備中':'装備する'}</span></button>`;
          }).join(''):'<div class="equip-none">ここに装備できる所持品はありません。</div>'}
        </div>
      </div>`;

    $('equipPickerBack')?.addEventListener('click',renderSlots);
    $('equipRemoveCurrent')?.addEventListener('click',()=>{
      if(current) window.DDInventory.unequip(current.uid);
      refreshChrome();
      renderPicker(slotId);
    });
    content.querySelectorAll('[data-equip-uid]').forEach(button=>button.addEventListener('click',()=>{
      window.DDInventory.equip(button.dataset.equipUid,slotId);
      refreshChrome();
      renderPicker(slotId);
    }));
  }

  function installButton(){
    if($('equipmentButton')) return;
    const bar=$('quickBar'); if(!bar) return;
    const button=document.createElement('button');
    button.id='equipmentButton';
    button.className='quick-button';
    button.type='button';
    button.textContent='装備';
    const skill=$('skillButton');
    if(skill) bar.insertBefore(button,skill); else bar.appendChild(button);
    button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();openWindow();});
  }

  injectStyle();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installButton,{once:true});
  else installButton();

  window.DDEquipmentUI={open:openWindow,render:renderSlots,canEquipInSlot};
})();
