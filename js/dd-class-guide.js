(() => {
  'use strict';

  const GUIDES = {
    Barbarian: {
      summary:'怒りの力で前線に立つ、丈夫な近接戦士です。難しい魔法操作はなく、敵の近くで殴り合いたい人に向いています。',
      play:'戦闘ではRage（激怒）を使って耐えながら、斧などの大きな武器で攻撃します。HPが高く、多少攻撃を受けても戦いやすいクラスです。',
      outside:'筋力を使う運動や、荒野で力仕事をする場面が得意です。',
      beginner:'初心者向け。まず「敵の前に出て攻撃する」を覚えやすいです。'
    },
    Bard: {
      summary:'音楽・話術・魔法を全部少しずつ使える万能型です。仲間を助けたり、会話で問題を解決したりするのが得意です。',
      play:'Bardic Inspirationで味方を助け、必要に応じて攻撃・回復・妨害の呪文を使います。',
      outside:'説得、芸能、知識系など多くの技能を活かしやすく、会話中心の冒険でも活躍します。',
      beginner:'できることが多いぶん、少し覚えることは多めです。'
    },
    Cleric: {
      summary:'神聖な力を使う魔法戦士です。回復だけでなく、防御・攻撃・支援もできます。',
      play:'味方を回復・強化しつつ、必要なら前線でも戦えます。選択によって重い防具や武器を扱う形にもできます。',
      outside:'判断力を使う知覚・看破・医術などと相性がよく、仲間を支える役にも向きます。',
      beginner:'魔法を覚える練習には向いていますが、準備する呪文の選択があります。'
    },
    Druid: {
      summary:'自然の力を使う魔法使いです。植物・動物・天候などに関係する魔法を扱います。',
      play:'攻撃、回復、地形妨害などを使い分けます。正面から殴るより、状況に合わせて魔法を選ぶタイプです。',
      outside:'自然、生存、動物とのやり取りなど、野外探索で活躍しやすいです。',
      beginner:'魔法の種類が多いので、少し慣れてからだと扱いやすいです。'
    },
    Fighter: {
      summary:'武器と防具の扱いに最も素直な戦士です。剣、弓、盾など好きな戦い方を作りやすいです。',
      play:'武器攻撃が中心です。Second Windで自分を立て直せるので、戦闘の基本を覚えるのに向いています。',
      outside:'選んだ技能次第で運動、知覚、威圧などを担当できます。',
      beginner:'かなり初心者向け。AC、攻撃ロール、武器ダメージの仕組みを覚えやすいです。'
    },
    Monk: {
      summary:'素早い身のこなしと格闘で戦う武術家です。重い鎧を着ず、自分の身体を武器にします。',
      play:'素手やモンク武器で素早く攻撃し、高い機動力を活かして立ち回ります。',
      outside:'敏捷力や判断力を活かす場面と相性がよく、身軽な探索にも向きます。',
      beginner:'操作は分かりやすいですが、防具なしで戦う仕組みに少し慣れが必要です。'
    },
    Paladin: {
      summary:'重装備で前線に立ちながら、神聖な魔法も使う騎士タイプです。攻撃・防御・回復をまとめて担当できます。',
      play:'武器と盾で前線に立ち、必要な時に回復や強化、Smite系の魔法を使います。',
      outside:'魅力を活かした説得や威圧も得意にしやすいです。',
      beginner:'戦士として動きつつ少しずつ魔法を覚えたい人に向いています。'
    },
    Ranger: {
      summary:'探索と武器戦闘に強く、少し魔法も使う野外の専門家です。弓や二刀流のイメージと相性が良いです。',
      play:'武器で戦いながらHunter\'s Markなどを使い、狙った敵への攻撃を強めます。',
      outside:'知覚、生存、自然、動物関連など、探索で役立つ技能を使いやすいです。',
      beginner:'戦闘と探索の両方を覚えたい人向け。魔法は少なめから始められます。'
    },
    Rogue: {
      summary:'魔法使いではなく、隠密・鍵開け・罠・急所攻撃など「技能」で切り抜ける専門家です。',
      play:'正面から殴り合うより、有利な状況を作ってSneak Attack（急所攻撃）で大きな一撃を狙います。',
      outside:'隠密、手先の早業、捜査などが得意で、戦闘以外でも仕事が多いクラスです。',
      beginner:'技能判定を覚えるのにとても向いています。急所攻撃が成立する条件だけ最初に覚える必要があります。'
    },
    Sorcerer: {
      summary:'生まれつき自分の中に魔力を持つ魔法使いです。勉強ではなく、内側から魔法を引き出します。',
      play:'覚えている呪文は絞られますが、Innate Sorceryなどで自分の魔法を強く扱います。',
      outside:'魅力が高くなりやすいため、説得・威圧・ペテンなど会話系技能とも相性があります。',
      beginner:'使える呪文を絞りやすいので、ウィザードより管理は軽めです。'
    },
    Warlock: {
      summary:'強大な存在との契約によって力を得る魔法使いです。普通の魔法職とは少し違う独特な仕組みを持ちます。',
      play:'Eldritch Blastなどを安定した主力にしつつ、Pact MagicとEldritch Invocationで自分専用の能力を組み合わせます。',
      outside:'魅力を使う技能と相性がよく、契約相手との関係そのものが物語にもなりやすいです。',
      beginner:'面白いですが独自ルールが多め。普通の呪文スロットとの違いを覚える必要があります。'
    },
    Wizard: {
      summary:'勉強と研究によって魔法を身につける、典型的な魔法使いです。呪文書を使い、多くの魔法を扱えます。',
      play:'状況に合わせて呪文を選び、攻撃・防御・探索・妨害などを魔法で解決します。',
      outside:'知力が高くなりやすく、魔法学・歴史・捜査など知識系の判定が得意です。',
      beginner:'できることは非常に多いですが、呪文書と準備呪文の管理があるため覚える量は多めです。'
    }
  };

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function injectStyle(){
    if(document.getElementById('ddClassGuideStyle')) return;
    const style=document.createElement('style');
    style.id='ddClassGuideStyle';
    style.textContent=`
      #characterForm .field,
      #characterForm .lead,
      #characterForm .info-box,
      #characterForm .mini-note{font-size:17px!important;line-height:1.65!important}
      #characterForm .info-box strong{font-size:20px!important}
      #characterForm .radio-card span,#characterForm .check-card span{font-size:17px!important;line-height:1.5!important}
      #characterForm .radio-card small,#characterForm .check-card small{font-size:16px!important;line-height:1.55!important}
      .class-beginner-guide{margin:0 0 18px;padding:14px;border:1px solid #6e5d49;background:#191611;display:grid;gap:12px;font-size:17px;line-height:1.7}
      .class-beginner-guide h3{margin:0;color:#d2b684;font-size:20px;line-height:1.35}
      .class-guide-row{margin:0}
      .class-guide-row strong{display:block;margin-bottom:2px;color:#eadbc6;font-size:17px}
      @media(max-width:620px){.class-beginner-guide{padding:12px}}
    `;
    document.head.appendChild(style);
  }

  function render(){
    const select=document.getElementById('className');
    const info=document.getElementById('classInfo');
    if(!select||!info) return;
    let guide=document.getElementById('classBeginnerGuide');
    if(!guide){
      guide=document.createElement('section');
      guide.id='classBeginnerGuide';
      guide.className='class-beginner-guide';
      info.insertAdjacentElement('afterend',guide);
    }
    const data=GUIDES[select.value];
    if(!data){guide.innerHTML='';guide.hidden=true;return;}
    guide.hidden=false;
    guide.innerHTML=`
      <h3>このクラスはどんなもの？</h3>
      <p class="class-guide-row">${escapeHtml(data.summary)}</p>
      <p class="class-guide-row"><strong>戦闘では</strong>${escapeHtml(data.play)}</p>
      <p class="class-guide-row"><strong>戦闘以外では</strong>${escapeHtml(data.outside)}</p>
      <p class="class-guide-row"><strong>初心者向けメモ</strong>${escapeHtml(data.beginner)}</p>`;
  }

  function install(){
    injectStyle();
    const select=document.getElementById('className');
    if(!select){setTimeout(install,50);return;}
    select.addEventListener('change',()=>setTimeout(render,0));
    const observer=new MutationObserver(()=>render());
    const info=document.getElementById('classInfo');
    if(info) observer.observe(info,{childList:true,subtree:true});
    render();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
