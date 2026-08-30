window.DDBattle = (() => {
  'use strict';

  let battle = null;

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mod = score => Math.floor(((Number(score)||10)-10)/2);
  const pb = level => Math.min(6,2+Math.floor((Math.max(1,Number(level)||1)-1)/4));
  const d20 = () => 1 + Math.floor(Math.random()*20);

  function injectStyle(){
    if($('ddBattleStyle')) return;
    const style=document.createElement('style');
    style.id='ddBattleStyle';
    style.textContent=`
      .battle-wrap{display:grid;gap:5px;padding-bottom:4px}
      .battle-map{position:relative;width:min(100%,180px);height:180px;margin:0 auto;border:2px solid #6d563d;border-radius:7px;overflow:hidden;background:#ddd}
      .battle-map img{width:100%;height:100%;display:block;object-fit:cover}
      .battle-status{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}
      .battle-card{min-width:0;border:1px solid #a58a65;border-radius:6px;background:#f4e3c5;padding:4px 5px;font-size:10px;line-height:1.15}
      .battle-card strong{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .battle-hp{margin-top:2px;font-weight:850}
      .battle-log{min-height:38px;max-height:52px;overflow:auto;border-left:3px solid #8a6b48;background:#e5d1b1;padding:4px 6px;font-size:10px;line-height:1.25}
      .battle-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}
      .battle-actions button{min-height:38px;border:1px solid #806849;border-radius:7px;background:#ead4ae;color:#352719;padding:4px 6px;font-size:11px;font-weight:850}
      .battle-actions .wide{grid-column:1/-1}
      .battle-turn{font-size:10px;font-weight:850;text-align:center;color:#5f482f}
      #windowContent img{max-width:100%;max-height:180px;width:auto!important;height:auto!important;object-fit:contain;display:block;margin:0 auto}
      #windowContent .map-card img{max-height:105px}
      @media(max-height:760px){.battle-map{width:145px;height:145px}.battle-log{max-height:44px}}
    `;
    document.head.appendChild(style);
  }

  function getGame(){ return window.DDInventory?.getGame?.() || {}; }
  function saveGame(game){ return window.DDInventory?.saveGame?.(game) || game; }

  function rollExpr(expr){
    const clean=String(expr||'0').replace(/\s+/g,'');
    let total=0;
    for(const raw of clean.match(/[+-]?[^+-]+/g)||[]){
      const sign=raw.startsWith('-')?-1:1;
      const term=raw.replace(/^[+-]/,'');
      const m=/^(\d+)d(\d+)/i.exec(term);
      if(m){ for(let i=0;i<Number(m[1]);i++) total += sign*(1+Math.floor(Math.random()*Number(m[2]))); }
      else total += sign*(Number(term)||0);
    }
    return total;
  }

  function saveMod(character,ability){
    const names={str:'Strength',dex:'Dexterity',con:'Constitution',int:'Intelligence',wis:'Wisdom',cha:'Charisma'};
    let value=mod(character.abilities?.[ability]);
    if((character.saveProficiencies||[]).includes(names[ability])) value+=pb(character.level||1);
    return value;
  }

  function pcAc(game){
    const c=game.character||{},inventory=game.inventory||[],equipment=game.equipment||[];
    let ac=10+mod(c.abilities?.dex), armor=false, bonus=0;
    for(const eq of equipment){
      const owned=inventory.find(v=>v.uid===eq.uid)||inventory.find(v=>v.itemId===eq.itemId);
      const data=window.DDInventory?.itemData(eq.itemId||owned?.itemId);
      if(!data) continue;
      if(data.type==='armor'&&data.id!=='shield'&&data.ac!=null){
        const dex=mod(c.abilities?.dex);
        const maxDex=Number.isFinite(Number(data.maxDex))?Number(data.maxDex):(/medium/i.test(String(data.properties||''))?2:null);
        ac=Number(data.ac)+(maxDex==null?0:Math.min(maxDex,dex)); armor=true;
      }
      if(data.acBonus!=null) bonus+=Number(data.acBonus)||0;
    }
    return (armor?ac:10+mod(c.abilities?.dex))+bonus;
  }

  function playerWeapon(game){
    const inv=game.inventory||[],eq=game.equipment||[];
    const slot=eq.find(v=>v.slot==='mainHand');
    const owned=slot && (inv.find(v=>v.uid===slot.uid)||inv.find(v=>v.itemId===slot.itemId));
    const data=owned && window.DDInventory?.itemData(owned.itemId);
    if(!data) return {name:'素手',toHit:mod(game.character?.abilities?.str)+pb(game.character?.level||1),damage:`1+${Math.max(0,mod(game.character?.abilities?.str))}`};
    const text=`${data.name||''} ${(data.properties||[]).join(' ')}`.toLowerCase();
    const dexWeapon=/bow|crossbow|finesse|dart|sling/.test(text);
    const ability=dexWeapon?'dex':'str';
    const abilityMod=mod(game.character?.abilities?.[ability]);
    const dice=(String(data.damage||'').match(/\d+d\d+/)||['1d4'])[0];
    return {name:data.ja||data.name,toHit:abilityMod+pb(game.character?.level||1),damage:`${dice}+${Math.max(0,abilityMod)}`};
  }

  function aliveEnemies(){ return battle.enemies.filter(e=>e.hp>0); }
  function log(text){ battle.log.push(text); if(battle.log.length>8) battle.log.shift(); }

  function createOrder(game){
    const rows=[{kind:'pc',id:'pc',roll:d20()+mod(game.character?.abilities?.dex)},{kind:'thalgar',id:'thalgar',roll:d20()+3}];
    battle.enemies.forEach(e=>rows.push({kind:'enemy',id:e.id,roll:d20()+Number(e.initiativeMod||0)}));
    rows.sort((a,b)=>b.roll-a.roll);
    battle.order=rows; battle.turnIndex=0; battle.round=1;
    log(`イニシアチブ：${rows.map(v=>`${v.kind==='pc'?'あなた':v.kind==='thalgar'?'Thalgar':battle.enemies.find(e=>e.id===v.id)?.label} ${v.roll}`).join(' / ')}`);
  }

  function currentActor(){ return battle.order?.[battle.turnIndex]||null; }
  function advance(){ battle.turnIndex++; if(battle.turnIndex>=battle.order.length){battle.turnIndex=0;battle.round++;} runAutomaticTurns(); }

  function targetDamage(target,amount){ amount=Math.max(0,Math.floor(amount)); if(target==='pc') battle.pcHp=Math.max(0,battle.pcHp-amount); else battle.thalgarHp=Math.max(0,battle.thalgarHp-amount); }
  function enemyTarget(){ const choices=[]; if(battle.pcHp>0) choices.push('pc'); if(battle.thalgarHp>0) choices.push('thalgar'); return choices.length?choices[Math.floor(Math.random()*choices.length)]:null; }

  function enemyTurn(enemy){
    if(!enemy||enemy.hp<=0) return;
    const target=enemyTarget(); if(!target) return;
    const targetName=target==='pc'?'あなた':'Thalgar';
    const game=getGame(); const character=game.character||{};
    if(enemy.breath && (enemy.breathReady || (enemy.breath.firstRound && battle.round===1 && !enemy.breathUsed))){
      enemy.breathUsed=true; enemy.breathReady=false;
      for(const t of ['pc','thalgar']){
        if((t==='pc'?battle.pcHp:battle.thalgarHp)<=0) continue;
        const sm=t==='pc'?saveMod(character,enemy.breath.saveAbility):5;
        const r=d20()+sm; const full=rollExpr(enemy.breath.damage); const dmg=r>=enemy.breath.dc?Math.floor(full/2):full;
        targetDamage(t,dmg); log(`${enemy.label}の${enemy.breath.name}：${t==='pc'?'あなた':'Thalgar'} ${r}/${enemy.breath.dc} → ${dmg}ダメージ`);
      }
      return;
    }
    if(enemy.breath && enemy.breathUsed){ const r=d20(); if((enemy.breath.recharge||[]).includes(r)) enemy.breathReady=true; }
    if(enemy.special?.once && !enemy.specialUsed){
      enemy.specialUsed=true; const sm=target==='pc'?saveMod(character,enemy.special.saveAbility):1; const r=d20()+sm;
      if(r<enemy.special.dc){ if(target==='pc') battle.pcStunned=1; else battle.thalgarStunned=1; log(`${enemy.label}の${enemy.special.name}：${targetName} ${r}/${enemy.special.dc} → 次の手番を失う`); }
      else log(`${enemy.label}の${enemy.special.name}：${targetName} ${r}/${enemy.special.dc} → 成功`);
      return;
    }
    if(enemy.special?.kind==='gaze' && !enemy.gazeUsed){
      enemy.gazeUsed=true; const sm=target==='pc'?saveMod(character,'con'):5; const r=d20()+sm;
      if(r<enemy.special.dc){const dmg=rollExpr(enemy.special.damage);targetDamage(target,dmg);if(target==='pc')battle.pcStunned=1;else battle.thalgarStunned=1;log(`${enemy.label}の${enemy.special.name}：${targetName} ${r}/${enemy.special.dc} → ${dmg}ダメージ`);}else log(`${enemy.label}の${enemy.special.name}：${targetName} ${r}/${enemy.special.dc} → 成功`);
    }
    const ac=target==='pc'?pcAc(game):15;
    for(const atk of enemy.attacks||[]){ for(let i=0;i<Number(atk.count||1);i++){ const r=d20()+Number(atk.toHit||0); if(r>=ac){const dmg=rollExpr(atk.damage);targetDamage(target,dmg);log(`${enemy.label} ${atk.name}：${targetName} AC${ac}に ${r} → ${dmg}ダメージ`);}else log(`${enemy.label} ${atk.name}：${targetName} AC${ac}に ${r} → ミス`); } }
  }

  function thalgarTurn(){
    if(battle.thalgarHp<=0) return;
    if(battle.thalgarStunned){battle.thalgarStunned=0;log('Thalgarは行動できない。');return;}
    const target=aliveEnemies()[0]; if(!target) return;
    for(let i=0;i<2&&target.hp>0;i++){ const r=d20()+6; if(r>=target.ac){const dmg=rollExpr('1d12+3');target.hp=Math.max(0,target.hp-dmg);log(`Thalgarのグレートアックス：${target.label} AC${target.ac}に ${r} → ${dmg}ダメージ`);}else log(`Thalgarのグレートアックス：${target.label}に ${r} → ミス`); }
  }

  function battleEnded(){ if(!aliveEnemies().length){ finishVictory(); return true; } if(battle.pcHp<=0 && battle.thalgarHp<=0){ finishDefeat(); return true; } return false; }

  function runAutomaticTurns(){
    if(battleEnded()) return;
    let guard=0;
    while(guard++<20){
      const actor=currentActor(); if(!actor) break;
      if(actor.kind==='pc'){
        if(battle.pcStunned){battle.pcStunned=0;log('あなたは行動できない。');battle.turnIndex++;if(battle.turnIndex>=battle.order.length){battle.turnIndex=0;battle.round++;}continue;}
        render(); return;
      }
      if(actor.kind==='thalgar') thalgarTurn();
      if(actor.kind==='enemy') enemyTurn(battle.enemies.find(e=>e.id===actor.id));
      if(battleEnded()) return;
      battle.turnIndex++; if(battle.turnIndex>=battle.order.length){battle.turnIndex=0;battle.round++;}
    }
    render();
  }

  function playerAttack(enemyId){
    const target=battle.enemies.find(e=>e.id===enemyId&&e.hp>0); if(!target)return;
    const game=getGame(),weapon=playerWeapon(game),r=d20()+weapon.toHit;
    if(r>=target.ac){const dmg=rollExpr(weapon.damage);target.hp=Math.max(0,target.hp-dmg);log(`${weapon.name}：${target.label} AC${target.ac}に ${r} → ${dmg}ダメージ`);}else log(`${weapon.name}：${target.label} AC${target.ac}に ${r} → ミス`);
    advance();
  }

  function finishVictory(){
    const game=getGame(); game.character.hp=battle.pcHp;
    game.scenarioStates ||= {}; game.scenarioStates[battle.scenarioId] ||= {};
    game.scenarioStates[battle.scenarioId].thalgarHp=battle.thalgarHp>0?battle.thalgarHp:1;
    game.pendingCombat=null; saveGame(game); battle.finished='win'; log('戦闘勝利。'); render();
  }

  function finishDefeat(){
    const game=getGame(); game.character.hp=0; game.pendingCombat=null;
    game.scenarioStates ||= {}; game.scenarioStates[battle.scenarioId] ||= {}; game.scenarioStates[battle.scenarioId].questLost=true; saveGame(game);
    battle.finished='lose'; log('あなたとThalgarが倒れた。クエスト失敗。'); render();
  }

  function render(){
    injectStyle();
    const root=$('scenarioActions'); if(!root||!battle)return;
    const title=$('speakerName'),message=$('messageText');
    if(title) title.textContent=`戦闘：${battle.encounterName}`;
    if(message) message.textContent='';
    const turn=currentActor();
    const cards=[`<div class="battle-card"><strong>あなた</strong><div class="battle-hp">HP ${battle.pcHp}/${battle.pcMax}</div></div>`,`<div class="battle-card"><strong>Thalgar</strong><div class="battle-hp">HP ${battle.thalgarHp}/68</div></div>`];
    for(const e of battle.enemies)cards.push(`<div class="battle-card"><strong>${esc(e.label)}</strong><div class="battle-hp">HP ${e.hp}/${e.maxHp} / AC ${e.ac}</div></div>`);
    root.innerHTML=`<div class="battle-wrap"><div class="battle-map">${battle.map?.image?`<img src="${esc(battle.map.image)}" alt="${esc(battle.map.name||'戦闘マップ')}">`:''}</div><div class="battle-status">${cards.join('')}</div><div class="battle-turn">${battle.order?`Round ${battle.round}　${turn?.kind==='pc'?'あなたの手番':turn?.kind==='thalgar'?'Thalgarの手番':'敵の手番'}`:'戦闘開始前'}</div><div class="battle-log">${battle.log.slice(-5).map(esc).join('<br>')||'イニシアチブを振って戦闘を開始します。'}</div><div class="battle-actions" id="battleActions"></div></div>`;
    const actions=$('battleActions');
    if(battle.finished==='win'){ const b=document.createElement('button');b.className='wide';b.textContent='戦闘終了 → 次へ';b.onclick=()=>window.DDScenarioRuntime?.gotoScene(battle.onWin);actions.appendChild(b);return; }
    if(battle.finished==='lose'){const b=document.createElement('button');b.className='wide';b.textContent='クエスト失敗';b.disabled=true;actions.appendChild(b);return;}
    if(!battle.order){const b=document.createElement('button');b.className='wide';b.textContent='イニシアチブを振る';b.onclick=()=>{createOrder(getGame());runAutomaticTurns();};actions.appendChild(b);return;}
    if(turn?.kind==='pc'){
      if(battle.pcHp<=0){const b=document.createElement('button');b.className='wide';b.textContent='死亡セーヴを振る';b.onclick=()=>{const r=d20();log(`死亡セーヴ：${r} → ${r>=10?'成功':'失敗'}`);battle.deathSuccess=(battle.deathSuccess||0)+(r>=10?1:0);battle.deathFail=(battle.deathFail||0)+(r<10?1:0);if(battle.deathSuccess>=3){battle.pcHp=1;log('意識を取り戻した。');}if(battle.deathFail>=3){battle.pcHp=0;battle.pcDead=true;}advance();};actions.appendChild(b);return;}
      for(const e of aliveEnemies()){ const b=document.createElement('button');b.textContent=`攻撃 → ${e.label}`;b.onclick=()=>playerAttack(e.id);actions.appendChild(b); }
    }
  }

  async function start({scenarioId,scene,monsters,map}){
    injectStyle();
    const game=getGame(),state=game.scenarioStates?.[scenarioId]||{};
    const enemies=[];
    for(const base of monsters||[]){for(let i=0;i<Number(base.count||1);i++)enemies.push({...base,id:`${base.id}-${i+1}`,label:Number(base.count||1)>1?`${base.name} ${i+1}`:base.name,hp:Number(base.hp||1),maxHp:Number(base.hp||1),specialUsed:false,gazeUsed:false,breathUsed:false,breathReady:false});}
    battle={scenarioId,sceneId:scene.id,onWin:scene.combat.onWin,encounterName:enemies.map(e=>e.label.replace(/ \d+$/,'')).filter((v,i,a)=>a.indexOf(v)===i).join(' / '),enemies,map,pcHp:Number(game.character?.hp||game.character?.maxHp||1),pcMax:Number(game.character?.maxHp||game.character?.hp||1),thalgarHp:Number(state.thalgarHp??68),log:[],order:null,turnIndex:0,round:1,pcStunned:0,thalgarStunned:0};
    render();
  }

  return {start};
})();