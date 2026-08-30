window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['mill-at-dawn'] = window.DDScenarioData['mill-at-dawn'] || {};

window.DDScenarioData['mill-at-dawn'].scenes = [
  {id:'intro',title:'夜明けの水車小屋',location:'Brackenford',mapId:'LOC_BRACKENFORD',text:'朝になっても、町外れの水車が動いていない。粉屋のHaleも戻ってこないため、パン屋の主人Miraが様子を見てきてほしいと頼んでくる。水車が止まったままでは、今日の粉を挽けないという。',choices:[{label:'依頼を受けて水車小屋へ向かう',next:'1'},{label:'もう少し事情を聞く',next:'2'}]},
  {id:'2',title:'昨夜のこと',location:'Brackenford',mapId:'LOC_BRACKENFORD',text:'Miraによれば、Haleは昨夜遅くまで水車を点検していた。雨で川が増水していたため、水門を見に行くと言っていたらしい。朝になっても戻らず、水車も止まったままだ。',next:'1'},
  {id:'1',title:'町外れへの道',location:'Brackenford郊外',mapId:'LOC_MILL_ROAD',text:'水車小屋までは二つの道がある。川沿いの細道なら近いが、昨夜の雨でぬかるんでいる。荷車道は遠回りだが歩きやすい。',choices:[{label:'川沿いの細道を急ぐ',next:'3'},{label:'荷車道を使う',next:'5'}]},
  {id:'3',title:'増水した川沿い',location:'川沿いの細道',mapId:'LOC_RIVER_PATH',text:'泥で足場が悪い。川は茶色く濁り、ところどころ道の端まで水が来ている。滑らずに進める場所を選ぶ必要がある。',check:{label:'Survival判定',ability:'wis',skill:'Survival',dc:10,success:'4',failure:'6'}},
  {id:'4',title:'流された足跡',location:'川沿いの細道',mapId:'LOC_RIVER_PATH',text:'泥の中に新しい靴跡を見つける。水車小屋から川下へ数歩続き、途中で引き返したように見える。Haleが昨夜ここを通った可能性が高い。',enter:{set:{foundTracks:true}},next:'7'},
  {id:'6',title:'ぬかるみ',location:'川沿いの細道',mapId:'LOC_RIVER_PATH',text:'足を取られて斜面を滑り、石に肩をぶつける。1d4の殴打ダメージを受ける。立ち上がると、水車小屋はもう目の前だ。',damage:'1d4',next:'7'},
  {id:'5',title:'荷車道',location:'水車小屋への荷車道',mapId:'LOC_CART_ROAD',text:'道は歩きやすい。水車小屋に近づくと、昨夜の雨でついた泥の跡が何本も見える。',check:{label:'Perception判定',ability:'wis',skill:'Perception',dc:10,success:'8',failure:'7'}},
  {id:'8',title:'靴跡',location:'水車小屋への荷車道',mapId:'LOC_CART_ROAD',text:'荷車の轍とは別に、一人分の靴跡が水車小屋の裏へ回り込んでいる。足跡は水路の方へ続いている。',enter:{set:{foundTracks:true}},next:'7'},
  {id:'7',title:'止まった水車',location:'水車小屋',mapId:'LOC_MILL',text:'水車は完全に止まっている。小屋の正面扉は閉まり、裏では水が水路から溢れている。水車の羽根には折れた枝や草が絡みついている。',choices:[{label:'正面扉を調べる',next:'9'},{label:'裏の水路を調べる',next:'10'}]},
  {id:'9',title:'閉じた扉',location:'水車小屋・正面',mapId:'LOC_MILL',text:'扉には鍵がかかっているが、古い木製で立て付けも悪い。強く押せば開けられそうだ。',check:{label:'Athletics判定',ability:'str',skill:'Athletics',dc:10,success:'11',failure:'10'}},
  {id:'11',title:'小屋の中',location:'水車小屋・内部',mapId:'LOC_MILL_INTERIOR',text:'中は無人だ。床には濡れた泥が点々と残り、工具箱が開いたままになっている。壁際には長い鉄のてこ棒が立てかけられている。',enter:{set:{foundTool:true}},next:'10'},
  {id:'10',title:'溢れた水路',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'水門の手前に倒木と枝が詰まり、水が横へ溢れている。その向こうからHaleの声が聞こえる。木材の隙間に片脚を挟まれている。さらに、濡れた穀物袋の陰から大型のネズミが二匹現れ、Haleの周囲をうろついている。',enter:{set:{sawBrokenSluice:true}},choices:[{label:'武器を構えてネズミを排除する',next:'18'},{label:'大きな音で追い払ってみる',next:'19'}]},
  {id:'19',title:'ネズミを追い払う',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'板を叩き、声を上げてネズミを水路から遠ざけようとする。',check:{label:'Animal Handling判定',ability:'wis',skill:'Animal Handling',dc:11,success:'20',failure:'18'}},
  {id:'18',title:'水路のネズミ',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'二匹のジャイアント・ラットが歯を鳴らして飛びかかってくる。Haleを助けるには、まずここを安全にしなければならない。',combat:{engine:'solo',encounter:'mill-rats',monsterIds:['MON_MILL_GIANT_RAT'],onWin:'20'}},
  {id:'20',title:'静かになった水路',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'ネズミの姿はなくなった。Haleは倒木に脚を挟まれたままだが、意識ははっきりしている。今なら救出に集中できる。',enter:{set:{ratsDrivenOff:true}},choices:[{label:'倒木を持ち上げてHaleを引き出す',next:'12'},{label:'水門を少し開いて水圧を逃がす',next:'13'}]},
  {id:'12',title:'力ずくの救出',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'足場を固め、倒木を持ち上げる。鉄のてこ棒を見つけていれば、かなり楽に動かせそうだ。',check:{label:'Athletics判定',ability:'str',skill:'Athletics',dc:12,advantageIfState:'foundTool',success:'15',failure:'14'}},
  {id:'13',title:'水門の操作',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'壊れかけた水門を少しだけ動かし、詰まりにかかる水圧を弱める。仕組みを間違えると一気に水が流れ込む。',check:{label:'Investigation判定',ability:'int',skill:'Investigation',dc:11,success:'15',failure:'14'}},
  {id:'14',title:'崩れる枝',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'枝の塊が崩れ、水しぶきと一緒に足元へ流れ込む。1d4の殴打ダメージを受けるが、詰まりは少し緩んだ。',damage:'1d4',choices:[{label:'今度こそ倒木を持ち上げる',next:'12'},{label:'水門を操作する',next:'13'}]},
  {id:'15',title:'救出',location:'水車小屋・水路',mapId:'LOC_MILL_CHANNEL',text:'倒木が動き、Haleを引き出すことができた。脚はひどく打っているが、自力で立てる。二人で枝を取り除くと、水が再び水路を流れ始め、水車の羽根がゆっくり回り出す。',enter:{set:{millerRescued:true}},next:'16'},
  {id:'16',title:'町へ帰る',location:'Brackenford',mapId:'LOC_BRACKENFORD',text:'Haleを連れて町へ戻る。水車が再び動いたことで、その日の粉挽きにも間に合った。Miraは礼として、店に置いてあった治癒のポーションを一本渡してくれる。',enter:{addItems:[{id:'ITEM_MILL_HEALING_POTION',quantity:1}]},next:'17'},
  {id:'17',title:'夜明けの水車小屋・完了',location:'Brackenford',mapId:'LOC_BRACKENFORD',text:'止まっていた水車は再び回り始めた。Haleも無事に戻り、町はいつもの朝を取り戻した。',end:true,complete:true,rewardIds:['REWARD_MILL_HEALING_POTION']}
];
