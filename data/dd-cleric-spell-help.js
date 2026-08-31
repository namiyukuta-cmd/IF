(() => {
  const descriptions = {
    'Guidance': '対象：自分または触れたクリーチャー1体。能力判定を助ける基本魔法。',
    'Light': '対象：物体1つ。物を光らせて周囲を照らす。自分自身にかける呪文ではないが、自分の持ち物を光らせて使える。',
    'Mending': '対象：触れた壊れた物体。小さな破損や裂け目を魔法で修理する。生き物のHPを回復する魔法ではない。',
    'Resistance': '対象：自分または触れたクリーチャー1体。セーヴィング・スロー（抵抗判定）を助ける基本魔法。',
    'Sacred Flame': '対象：範囲内で見えるクリーチャー1体。聖なる炎で攻撃する。通常は敵に使う攻撃魔法。',
    'Spare the Dying': '対象：HPが0になっているクリーチャー1体。死亡しかけている相手を安定化させる。自分がHP0のときは通常この呪文を唱えられない。',
    'Thaumaturgy': '対象：主に自分の周囲や指定した小さな現象。声を響かせる、炎を変化させるなどの神聖な小技を起こす。',
    'Bane': '対象：範囲内で見えるクリーチャー最大3体。攻撃ロールやセーヴィング・スローを妨害する。通常は敵に使う。',
    'Bless': '対象：自分を含め、範囲内のクリーチャー最大3体。攻撃ロールとセーヴィング・スローを助ける。自分にも使える。',
    'Command': '対象：範囲内で見えるクリーチャー1体。短い命令を魔法で相手に実行させる。通常は敵や従わせたい相手に使う。',
    'Create or Destroy Water': '対象：容器の中の水、または範囲内の水・雨・霧。水を作る、または消すための魔法。キャラクター自身を対象にする魔法ではない。',
    'Cure Wounds': '対象：自分または触れたクリーチャー1体。HPを回復する。自分自身にも使える。',
    'Detect Evil and Good': '対象：自分。自分の周囲にいる特定の超自然的存在や、聖別・冒涜された場所などを感知する。',
    'Detect Magic': '対象：自分。自分の周囲にある魔法の気配を感知する。',
    'Detect Poison and Disease': '対象：自分。自分の周囲にある毒・毒性の生物・病気などを感知する。',
    'Guiding Bolt': '対象：範囲内のクリーチャー1体。光の矢で攻撃し、その相手への次の攻撃を当てやすくする。通常は敵に使う。',
    'Healing Word': '対象：自分を含め、範囲内で見えるクリーチャー1体。離れた場所からHPを回復できる。自分自身にも使える。',
    'Inflict Wounds': '対象：触れたクリーチャー1体。壊死の力でダメージを与える攻撃魔法。通常は敵に使う。',
    'Protection from Evil and Good': '対象：自分または触れた同意するクリーチャー1体。特定の超自然的な存在から攻撃や支配を受けにくくする。自分にも使える。',
    'Purify Food and Drink': '対象：範囲内の食べ物と飲み物。毒や腐敗などを取り除いて安全にする。キャラクター自身を対象にする魔法ではない。',
    'Sanctuary': '対象：自分を含め、範囲内のクリーチャー1体。その対象を攻撃しにくくする防御魔法。自分にも使える。',
    'Shield of Faith': '対象：自分を含め、範囲内のクリーチャー1体。ACを上げて守る防御魔法。自分にも使える。'
  };

  function refreshRenderedChoices() {
    setTimeout(() => {
      const background = document.getElementById('background');
      if (background) background.dispatchEvent(new Event('change', { bubbles: true }));
    }, 0);
  }

  function patch(labels) {
    if (!labels?.spells) return labels;
    for (const [name, description] of Object.entries(descriptions)) {
      if (labels.spells[name]) labels.spells[name][1] = description;
    }
    if (typeof document !== 'undefined') refreshRenderedChoices();
    return labels;
  }

  if (window.DD_JA_LABELS) {
    patch(window.DD_JA_LABELS);
    return;
  }

  Object.defineProperty(window, 'DD_JA_LABELS', {
    configurable: true,
    enumerable: true,
    get() { return undefined; },
    set(value) {
      Object.defineProperty(window, 'DD_JA_LABELS', {
        value: patch(value),
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  });
})();
