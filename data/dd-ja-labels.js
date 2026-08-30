window.DD_JA_LABELS={
skills:{'Acrobatics':'軽業','Animal Handling':'動物使い','Arcana':'魔法学','Athletics':'運動','Deception':'ペテン','History':'歴史','Insight':'看破','Intimidation':'威圧','Investigation':'捜査','Medicine':'医術','Nature':'自然','Perception':'知覚','Performance':'芸能','Persuasion':'説得','Religion':'宗教','Sleight of Hand':'手先の早業','Stealth':'隠密','Survival':'生存'},
languages:{'Common Sign Language':'共通手話','Draconic':'竜語','Dwarvish':'ドワーフ語','Elvish':'エルフ語','Giant':'巨人語','Gnomish':'ノーム語','Goblin':'ゴブリン語','Halfling':'ハーフリング語','Orc':'オーク語'},
alignments:{'Lawful Good':'秩序にして善','Neutral Good':'中立にして善','Chaotic Good':'混沌にして善','Lawful Neutral':'秩序にして中立','Neutral':'真なる中立','Chaotic Neutral':'混沌にして中立','Lawful Evil':'秩序にして悪','Neutral Evil':'中立にして悪','Chaotic Evil':'混沌にして悪'},
feats:{'Alert':'警戒','Crafter':'製作者','Healer':'治療師','Lucky':'幸運','Magic Initiate':'魔法のたしなみ','Musician':'音楽家','Savage Attacker':'猛攻','Skilled':'技能習熟','Tavern Brawler':'酒場流喧嘩殺法','Tough':'頑健'},
species:{Dragonborn:'ドラゴンボーン',Dwarf:'ドワーフ',Elf:'エルフ',Gnome:'ノーム',Goliath:'ゴライアス',Halfling:'ハーフリング',Human:'ヒューマン',Orc:'オーク',Tiefling:'ティーフリング'},
terms:{'Cantrip':'キャントリップ（初級呪文）','Skill Proficiency':'技能習熟','Origin Feat':'オリジン特技','Background':'背景・出自','Species':'種族','Language':'言語','Common':'共通語'},
label(value,group){const m=this[group]||{};return m[value]?`${value}（${m[value]}）`:value;}
};

setTimeout(()=>{
  const sel=document.getElementById('className');
  const info=document.getElementById('classInfo');
  const equip=document.getElementById('classEquipment');
  if(!sel||!info||!equip)return;

  document.getElementById('classBeginnerGuide')?.remove();
  document.querySelectorAll('.class-pick-grid,.class-more,.class-long-desc,.class-choice-layout').forEach(x=>x.remove());

  const panel=sel.closest('.step-panel');
  const title=panel.querySelector('.section-title');
  const lead=panel.querySelector('.lead');
  const field=sel.closest('.field');
  const equipTitle=equip.previousElementSibling;
  const errorBox=document.getElementById('errorBox');
  const next=document.getElementById('nextBtn');
  const prev=document.getElementById('prevBtn');
  const panels=[...document.querySelectorAll('.step-panel')];

  document.getElementById('dd-new-mobile-font-fix')?.remove();
  const st=document.createElement('style');
  st.id='dd-new-mobile-font-fix';
  st.textContent=`
    body{font-size:13px!important;line-height:1.38!important}
    header h1{font-size:17px!important}
    .rules-note{font-size:12px!important;line-height:1.35!important;margin:4px 0 7px!important}
    .section-title{font-size:16px!important;margin:0 0 4px!important}
    .lead{font-size:12px!important;line-height:1.35!important;margin:0 0 6px!important}
    .subhead{font-size:15px!important;margin:10px 0 5px!important}
    .field{font-size:13px!important;margin-bottom:8px!important}
    .info-box{font-size:12px!important;line-height:1.32!important;gap:2px!important;padding:7px!important;margin:0!important}
    .info-box strong{font-size:14px!important}
    .check-card,.radio-card{padding:7px!important;min-height:46px!important}
    .check-card span,.radio-card span{font-size:13px!important}
    .check-card small,.radio-card small{font-size:12px!important}
    .nav-actions button{font-size:13px!important;min-height:45px!important}
    .steps{grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:2px!important;margin:0 0 8px!important}
    .step-dot,.pseudo-step-dot{min-height:37px;border:1px solid #4f4436;background:#1d1915;color:#b9aa95;font-size:10px!important;display:grid;place-items:center;text-align:center;padding:2px!important}
    .step-dot.active,.pseudo-step-dot.active{border-color:var(--accent);color:var(--text);background:#332a20}
    .step-dot.done,.pseudo-step-dot.done{color:#cdb991;border-color:#806b50}
    .class-choice-layout{display:grid;grid-template-columns:34% 66%;gap:6px;align-items:start;margin-top:5px}
    .class-choice-layout[hidden],#classEquipment[hidden]{display:none!important}
    .class-pick-list{display:grid;grid-template-columns:1fr;gap:4px}
    .class-pick{width:100%;min-height:31px;border:1px solid var(--line);background:#191611;color:var(--text);font:inherit;font-size:11.5px;padding:4px 3px;text-align:center;line-height:1.2}
    .class-pick.active{border-color:var(--accent);background:#3a3025;color:var(--accent)}
    .class-detail-box{min-height:100%;align-content:start}
    .class-detail-name{display:block;color:var(--accent);font-size:14px;font-weight:700;margin-bottom:4px}
    .class-detail-primary{display:block;color:var(--text);font-size:12.5px;font-weight:700;margin-bottom:5px}
    .class-detail-meta{display:block;margin:0 0 3px}
    .class-detail-desc{border-top:1px solid #514535;margin-top:6px;padding-top:6px;display:grid;gap:5px}
    .class-detail-desc p{margin:0;font-size:12px;line-height:1.38}
    .class-detail-desc b{color:#eadbc6}
    @media(max-width:380px){.class-choice-layout{grid-template-columns:36% 64%}.class-pick{font-size:11px}.class-detail-name{font-size:13px}}
  `;
  document.head.appendChild(st);

  field.style.display='none';

  const steps=document.querySelector('.steps');
  steps.innerHTML=[
    '<div class="step-dot">1<br>クラス</div>',
    '<div class="pseudo-step-dot">2<br>装備</div>',
    '<div class="step-dot">3<br>出自</div>',
    '<div class="step-dot">4<br>詳細</div>',
    '<div class="step-dot">5<br>能力</div>',
    '<div class="step-dot">6<br>属性</div>',
    '<div class="step-dot">7<br>仕上げ</div>'
  ].join('');
  const visualDots=[...steps.children];
  function setProgress(index){
    visualDots.forEach((dot,i)=>{
      dot.classList.toggle('active',i===index);
      dot.classList.toggle('done',i<index);
    });
  }

  const layout=document.createElement('div');
  layout.className='class-choice-layout';
  const list=document.createElement('div');
  list.className='class-pick-list';
  field.after(layout);
  layout.append(list,info);
  info.classList.add('class-detail-box');

  const abilityJa={Strength:'筋力',Dexterity:'敏捷力',Constitution:'耐久力',Intelligence:'知力',Wisdom:'判断力',Charisma:'魅力'};
  const bi=v=>abilityJa[v]?`${v}（${abilityJa[v]}）`:v;
  const guides={
    Barbarian:['怒りの力で前線に立つ、丈夫な近接戦士です。','Rage（激怒）を使って耐えながら、大きな武器で攻撃します。','初心者向け。近接戦闘の基本を覚えやすいです。'],
    Bard:['音楽・話術・魔法を使える万能型です。','仲間を助け、攻撃・回復・妨害の魔法を使います。','できることが多いぶん、覚えることはやや多めです。'],
    Cleric:['神聖な力を使う魔法戦士です。','回復・支援・攻撃を使い分け、前線にも立てます。','魔法と戦闘の両方を覚えたい人向けです。'],
    Druid:['自然の力を使う魔法使いです。','攻撃・回復・地形妨害などを状況に合わせて使います。','魔法の種類が多く、覚える量は多めです。'],
    Fighter:['武器と防具の扱いに優れた戦士です。','武器攻撃を中心に戦い、自分を回復する能力もあります。','ACや攻撃ロールなど戦闘の基本を覚えやすいです。'],
    Monk:['素早い身のこなしと格闘で戦う武術家です。','素手や軽い武器、高い機動力を使います。','防具なしで戦う仕組みに少し慣れが必要です。'],
    Paladin:['重装備と神聖魔法を組み合わせる騎士です。','武器と盾で前線に立ち、回復や強化も行います。','戦士として動きながら魔法も覚えたい人向けです。'],
    Ranger:['探索と武器戦闘に強い野外の専門家です。','弓や近接武器で戦い、少し魔法も使います。','戦闘と探索の両方を覚えたい人向けです。'],
    Rogue:['隠密・鍵開け・罠・急所攻撃など技能で切り抜ける専門家です。','Sneak Attack（急所攻撃）で大きな一撃を狙います。','技能判定を覚えるのに向いています。'],
    Sorcerer:['生まれつき自分の中に魔力を持つ魔法使いです。','覚えた呪文を自分の魔力で強く使います。','ウィザードより呪文管理は軽めです。'],
    Warlock:['強大な存在との契約によって力を得る魔法使いです。','独自の魔法と能力を組み合わせて戦います。','独自ルールが多めなので少し慣れが必要です。'],
    Wizard:['勉強と研究によって魔法を身につける魔法使いです。','Spellbook（呪文書）から状況に合う呪文を選びます。','できることは多いですが、覚える量も多めです。']
  };

  function renderInfo(){
    const c=window.DD_SRD_CHARACTER?.classes?.[sel.value];
    if(!c)return;
    const g=guides[sel.value]||['','',''];
    info.innerHTML=`<span class="class-detail-name">${c.ja} / ${sel.value}</span><span class="class-detail-primary">主要能力：${String(c.primary).split(' / ').map(bi).join(' / ')}</span><span class="class-detail-meta">Hit Die（ヒット・ダイス）：D${c.hitDie}</span><span class="class-detail-meta">Saving Throws（セーヴ習熟）：${c.saves.map(bi).join(' / ')}</span><span class="class-detail-meta">Class Skills（クラス技能）：${c.skillCount}個</span><div class="class-detail-desc"><p>${g[0]}</p><p><b>戦闘：</b>${g[1]}</p><p><b>初心者：</b>${g[2]}</p></div>`;
  }

  function renderButtons(){
    list.innerHTML='';
    [...sel.options].forEach(o=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='class-pick'+(o.value===sel.value?' active':'');
      b.textContent=window.DD_SRD_CHARACTER?.classes?.[o.value]?.ja||o.value;
      b.addEventListener('click',()=>{
        sel.value=o.value;
        sel.dispatchEvent(new Event('change',{bubbles:true}));
        setTimeout(()=>{renderButtons();renderInfo();},0);
      });
      list.appendChild(b);
    });
  }

  let equipmentPage=false;
  let returnToEquipment=false;

  function clearPseudoError(){if(errorBox){errorBox.textContent='';errorBox.hidden=true;}}

  function showClass(){
    equipmentPage=false;
    title.textContent='1. クラスを選ぶ';
    lead.hidden=false;
    layout.hidden=false;
    equipTitle.hidden=true;
    equip.hidden=true;
    panel.classList.remove('class-equipment-page');
    renderButtons();
    renderInfo();
    prev.hidden=true;
    setProgress(0);
    clearPseudoError();
    window.scrollTo(0,0);
  }

  function showEquipment(){
    equipmentPage=true;
    title.textContent='2. Starting Equipment（開始装備）';
    lead.hidden=true;
    layout.hidden=true;
    equipTitle.hidden=false;
    equipTitle.textContent='Starting Equipment（開始装備）';
    equip.hidden=false;
    panel.classList.add('class-equipment-page');
    prev.hidden=false;
    setProgress(1);
    clearPseudoError();
    window.scrollTo(0,0);
  }

  showClass();

  next.addEventListener('click',e=>{
    if(!panel.hidden&&!equipmentPage){
      e.preventDefault();
      e.stopImmediatePropagation();
      showEquipment();
    }
  },true);

  prev.addEventListener('click',e=>{
    if(!panel.hidden&&equipmentPage){
      e.preventDefault();
      e.stopImmediatePropagation();
      showClass();
      return;
    }
    const visible=panels.findIndex(p=>!p.hidden);
    if(visible===1)returnToEquipment=true;
  },true);

  function sync(){
    const visible=panels.findIndex(p=>!p.hidden);
    if(visible===0){
      if(returnToEquipment){returnToEquipment=false;setTimeout(showEquipment,0);}
      else setProgress(equipmentPage?1:0);
      return;
    }
    if(visible>0)setProgress(visible+1);
  }

  const observer=new MutationObserver(sync);
  panels.forEach(p=>observer.observe(p,{attributes:true,attributeFilter:['hidden']}));
},0);
