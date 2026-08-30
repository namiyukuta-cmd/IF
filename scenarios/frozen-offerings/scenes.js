window.DDScenarioData = window.DDScenarioData || {};
window.DDScenarioData['frozen-offerings'] = window.DDScenarioData['frozen-offerings'] || {};

window.DDScenarioData['frozen-offerings'].scenes = [
  {
    id:'intro', title:'Frozen Offerings', location:'Targos', mapId:'LOC_TARGOS',
    text:'雪の舞うTargosで、あなたは戦士Thalgarと出会う。弟MalgarはBrukka族に捕らえられ、白竜への生贄として連れ去られたという。Thalgarは救出への同行を頼み、報酬として500 gpを約束する。',
    next:'1'
  },
  {
    id:'1', sourceEntry:1, title:'Shopping Expedition', location:'Targos・商店街', mapId:'LOC_SHOP',
    text:'出発前に寒冷地用の特別な装備を買える。ただし時間はなく、確認・購入できる品は通常3種類まで。Thalgarは港へ急ぐよう促している。',
    shop:{max:3,items:['ITEM_SNOWSHOES','ITEM_CLIMBER_KIT','ITEM_SNOW_GLASSES','ITEM_LLAMA_SHIRT','ITEM_KNUCKLEHEAD_OIL']},
    choices:[
      {label:'値切ってから出発する',next:'30'},
      {label:'すぐ港へ向かう',next:'15'}
    ]
  },
  {id:'2',sourceEntry:2,title:'Reluctant Mounts',location:'Brukka Village',mapId:'LOC_BRUKKA',text:'馬はどうしても言うことを聞かない。乗馬は諦め、徒歩で村を出る。',next:'65'},
  {
    id:'3',sourceEntry:3,title:'Cold Comfort',location:'Frozen Plain・薄氷',mapId:'LOC_THINICE',
    text:'氷が割れ、Thalgarが冷水へ落ちる。引き上げることには成功したが、急いで体を温めなければ危険だ。',
    itemBranch:{any:['ITEM_KNUCKLEHEAD_OIL','ITEM_LLAMA_SHIRT'],yes:'26',no:'49'}
  },
  {
    id:'4',sourceEntry:4,title:'Unexpected Aid',location:'Brukka Longhouse',mapId:'LOC_LONGHOUSE',
    text:'Brukkaの戦士の一人が密かに協力してくれる。竜の巣は牙のようなWhitetooth Peakにあり、三峰のTrident Peakは誤りだと教えられる。',
    enter:{set:{knowsWhitetooth:true}},
    choices:[{label:'夜まで待って出発する',next:'69'},{label:'一晩休んで朝に出発する',next:'14'}]
  },
  {
    id:'5',sourceEntry:5,title:'Mystery Figure',location:'Aurora',mapId:'LOC_AURORA',
    text:'漂流船の生存者を見た船員が、数年前に溺死したはずのThraynに似ていると言う。',
    choices:[{label:'Utrirr船長へ知らせる',next:'63'},{label:'そのまま漂流船へ呼びかける',next:'31'}]
  },
  {
    id:'6',sourceEntry:6,title:"Thalgar's Legacy",location:"Dragon's Lair → Targos",mapId:'LOC_LAIR',
    text:'Thalgarは戦いで命を落とした。Malgarを救出し、竜の財宝と約束の500 gpを受け取ってTargosへ帰還する。',
    end:true,complete:true,rewardIds:['REWARD_CONTRACT','REWARD_HOARD_COINS','REWARD_HOARD_GEMS','REWARD_STONE_GIANT_POTION','REWARD_NECKLACE_FIREBALLS','REWARD_XP']
  },
  {
    id:'7',sourceEntry:7,title:'Storm Watch',location:'Frozen Plain',mapId:'LOC_TUNDRA',
    text:'巨大な吹雪が迫り、すぐに白一色の世界へ包まれる。雪眼鏡があるかどうかで目への被害が変わる。',
    itemBranch:{all:['ITEM_SNOW_GLASSES'],yes:'28',no:'43'}
  },
  {
    id:'8',sourceEntry:8,title:'Dark Trophies',location:'凍結トロフィー地帯',mapId:'LOC_TROPHIES',
    text:'remorhazや獣、Brukka戦士たちは竜によって氷漬けにされたトロフィーだった。Malgarの姿はなく、竜の巣へ連れて行かれた可能性が高い。南には二つの山が見える。',
    choices:[{label:'牙のような山へ向かう',next:'66'},{label:'三つ峰の山へ向かう',next:'42'}]
  },
  {id:'9',sourceEntry:9,title:'False Friends',location:'漂流漁船',mapId:'BATTLE_MAER',text:'UtrirrもThraynの姿を確認し、罠を警戒する。漂流者はDeep Scionへ姿を変え、戦闘が始まる。',enter:{set:{PREPARED:true}},combat:{encounter:'deep-scion',monsterIds:['MON_DEEP_SCION'],onWin:'53'}},
  {
    id:'10',sourceEntry:10,title:'Succession',location:"Dragon's Lair入口",mapId:'LOC_LAIR',
    text:'洞窟の中から若い白竜XakkrathとMalgarの声が聞こえる。母Angnathは死に、Xakkrathが巣を継いでいた。Malgarはまだ生きている。',
    choices:[{label:'隠密で侵入する',next:'13'},{label:'囮で竜を外へ誘う',next:'39'},{label:'正面から入る',next:'73'}]
  },
  {
    id:'11',sourceEntry:11,title:'The Dragon Slayers',location:'Brukka Longhouse',mapId:'LOC_LONGHOUSE',
    text:'Chief GhudvilはMalgarがすでに竜の巣へ送られたと告げる。村で休むことは許された。追跡のため、いつ出発するか、協力者を探すかを決める。',
    choices:[{label:'夜に出発する',next:'69'},{label:'一晩休む',next:'14'},{label:'協力者を探す',next:'54'}]
  },
  {id:'12',sourceEntry:12,title:'Making for Shore',location:'Maer Dualdon',mapId:'LOC_AURORA',text:'漂流船を見捨て、Auroraは西岸へ急ぐ。Brukka村の煙が見え、嵐も迫っている。',next:'70'},
  {
    id:'13',sourceEntry:13,title:'Stealthy Approach',location:"Dragon's Lair",mapId:'LOC_LAIR',
    text:'Malgarの会話に紛れて洞窟へ忍び込み、竜の位置を探る。',
    check:{label:'隠密判定',ability:'dex',skill:'Stealth',dc:12,success:'60',failure:'22'}
  },
  {id:'14',sourceEntry:14,title:'Troubled Rest',location:'Brukka Village',mapId:'LOC_LONGHOUSE',text:'Brukkaの長屋で一晩休み、夜明け前に村を抜ける。馬を盗める状況ではなく、そのまま徒歩で雪原へ出る。',enter:{set:{longRestTaken:true}},next:'65'},
  {
    id:'15',sourceEntry:15,title:'On Board',location:'Aurora / Maer Dualdon',mapId:'LOC_AURORA',
    text:'Targos港からAuroraに乗り込み、Maer Dualdonを北西へ進む。出発が遅れたかどうかで、この後の天候が変わる。',
    stateBranch:{key:'TARDY',truthy:'58',falsy:'36'}
  },
  {id:'16',sourceEntry:16,title:'Safe and Sound',location:'Aurora・嵐',mapId:'LOC_AURORA',text:'落下するマストをかわし、船の作業に戻る。危機への素早い対応でInspirationを得る。',enter:{set:{inspiration:true}},next:'37'},
  {
    id:'17',sourceEntry:17,title:'Well-Timed Attack',location:"Dragon's Lair入口",mapId:'LOC_LAIR',
    text:'囮に食いついたXakkrathが洞窟から飛び出す。姿を見せた一瞬に遠隔攻撃またはセーヴを要求する効果を放つ。',
    attackOutcome:{label:'AC17への遠隔攻撃／竜のセーヴ',hit:'32',miss:'41'}
  },
  {id:'18',sourceEntry:18,title:'Icy Escape',location:'薄氷の湖面',mapId:'LOC_THINICE',text:'Thalgarは割れる氷から逃れ、二人は慎重に雪の厚い場所まで退避する。',next:'72'},
  {
    id:'19',sourceEntry:19,title:'Cold Pursuit',location:'Frozen Plain',mapId:'LOC_TUNDRA',
    text:'Brukkaの護送隊を追って雪原を急ぐ。ここまでに稼いだ時間と馬の有無が追跡結果へ影響する。',
    roll:{die:20,label:'追跡 d20',stateModifiers:[{key:'HASTE',value:4},{key:'MOUNT',value:8}],ranges:[{max:8,next:'52'},{min:9,max:16,next:'40'},{min:17,next:'7'}]}
  },
  {id:'20',sourceEntry:20,title:'Knocked Down',location:'Aurora・嵐',mapId:'LOC_AURORA',text:'折れたマストが背中を直撃する。2d6の殴打ダメージを受けるが、船はやがて入り江へ逃げ込む。',damage:'2d6',next:'37'},
  {id:'21',sourceEntry:21,title:'Ocean Ambush',location:'漂流漁船',mapId:'BATTLE_MAER',text:'救助しようと近づいた瞬間、漂流者がDeep Scionへ変貌して襲いかかる。',combat:{encounter:'deep-scion',monsterIds:['MON_DEEP_SCION'],onWin:'53'}},
  {id:'22',sourceEntry:22,title:'Revealed',location:"Dragon's Lair",mapId:'BATTLE_DRAGON',text:'足を滑らせた音で潜入が露見する。Xakkrathが飛びかかり、戦闘が始まる。',combat:{encounter:'xakkrath',monsterIds:['MON_XAKKRATH'],onWin:'75'}},
  {id:'23',sourceEntry:23,title:'Thalgar Weakened',location:'Frozen Plain',mapId:'LOC_TUNDRA',text:'焚き火でThalgarを温めることには成功したが、後遺症が残る。以後、Thalgarは疲労2段階として扱う。',enter:{set:{thalgarExhaustion:2}},next:'72'},
  {id:'24',sourceEntry:24,title:'Final Fight',location:"Dragon's Lair",mapId:'BATTLE_DRAGON',text:'狙撃がXakkrathを捉え、竜は洞窟内へ降下する。決戦が始まる。',combat:{encounter:'xakkrath',monsterIds:['MON_XAKKRATH'],onWin:'75'}},
  {
    id:'25',sourceEntry:25,title:'Jump to It',location:'Aurora・嵐',mapId:'LOC_AURORA',
    text:'嵐の中、折れたマストが頭上から倒れてくる。',
    save:{label:'DEXセーヴ',ability:'dex',dc:16,success:'16',failure:'20'}
  },
  {
    id:'26',sourceEntry:26,title:'Warmth of Life',location:'Frozen Plain',mapId:'LOC_TUNDRA',
    text:'油やラマ毛の下着を使ってThalgarを温める。ThalgarはDC12のCONセーヴを3回行う。両方の防寒品があれば各判定に有利。',
    multiSave:{label:'Thalgar CONセーヴ ×3',count:3,dc:12,modifier:5,advantageIfItems:['ITEM_KNUCKLEHEAD_OIL','ITEM_LLAMA_SHIRT'],successNeeded:2,success:'67',failure:'46',store:'warmthSaveSuccessCount'}
  },
  {
    id:'27',sourceEntry:27,title:'Fallen Yeti',location:'Yeti戦後',mapId:'BATTLE_YETI',
    text:'二体のYetiを倒した。死体の臭いが狼を呼ぶ恐れがあるが、毛皮には価値がある。',
    choices:[{label:'Yetiの毛皮を採取する',next:'48'},{label:'すぐ南へ進む',next:'72'}]
  },
  {id:'28',sourceEntry:28,title:'Glasses On',location:'Frozen Plain・吹雪',mapId:'LOC_TUNDRA',text:'雪眼鏡で目を守り、吹雪が去るまで耐える。視界を失わずに南へ進める。',next:'72'},
  {
    id:'29',sourceEntry:29,title:'Easy Climb',location:'Whitetooth Peak',mapId:'LOC_WHITETOOTH',
    text:'登攀用具を使う。PCはAthletics DC10を3回、ThalgarはAthletics DC14を1回。WANDEREDならPCの判定は不利。失敗時には転落ダメージの判定がある。',
    procedure:{type:'climb',withKit:true,pcDc:10,pcCount:3,thalgarDc:14,fallSaveDc:16,fallSuccessDamage:'2d6',fallFailureDamage:'4d6',thalgarFailureDamage:'8d6'},next:'10'
  },
  {
    id:'30',sourceEntry:30,title:'Haggling',location:'Targos・商店街',mapId:'LOC_SHOP',
    text:'値切りを試みる。成功すれば購入品を20%引きにするか、通常価格で4品目まで購入する選択肢が得られる。時間を使ったため、結果に関係なく出航は遅れる。',
    enter:{set:{TARDY:true}},check:{label:'説得判定',ability:'cha',skill:'Persuasion',dc:15,success:'15',failure:'15',store:'haggleSuccess'}
  },
  {
    id:'31',sourceEntry:31,title:'Timely Rescue',location:'漂流漁船',mapId:'LOC_AURORA',
    text:'漂流者はBrukkaに襲われたと訴えるが、状況には違和感がある。',
    check:{label:'看破判定',ability:'wis',skill:'Insight',dc:14,success:'59',failure:'21'}
  },
  {id:'32',sourceEntry:32,title:'Successful Feint',location:"Dragon's Lair",mapId:'BATTLE_DRAGON',text:'囮と攻撃が成功し、二人は洞窟内へ駆け込んでXakkrathとの決戦に備える。',combat:{encounter:'xakkrath',monsterIds:['MON_XAKKRATH'],onWin:'75'}},
  {id:'33',sourceEntry:33,title:'On Horseback',location:'Brukka Village → Frozen Plain',mapId:'LOC_TUNDRA',text:'馬を静かに連れ出すことに成功し、雪原へ乗り出す。',enter:{set:{MOUNT:true}},next:'65'},
  {
    id:'34',sourceEntry:34,title:'Ice Breaker',location:'薄氷の湖面',mapId:'LOC_THINICE',
    text:'足元の氷が割れ始め、Thalgarが転落を避けようとする。馬に乗っている場合、このセーヴは自動失敗する。',
    save:{label:'Thalgar DEXセーヴ',dc:16,modifier:3,autoFailIfState:'MOUNT',success:'18',failure:'71'}
  },
  {id:'35',sourceEntry:35,title:'Dragon in the Dark',location:"Dragon's Lair",mapId:'LOC_LAIR',text:'暗い上部を探しても竜を見つけられない。別の手段を選ぶ必要がある。',choices:[{label:'囮を作る',next:'39'},{label:'姿を現して正面から挑む',next:'73'}]},
  {id:'36',sourceEntry:36,title:'Distress Call',location:'Maer Dualdon',mapId:'LOC_AURORA',text:'損傷した小型漁船を発見する。死者と生存者らしき姿があり、Utrirrは救助するかをあなたに委ねる。',choices:[{label:'救助へ向かう',next:'51'},{label:'先を急ぐ',next:'12'}]},
  {id:'37',sourceEntry:37,title:"Warriors' Welcome",location:'Knucklehook Cove → Brukka Village',mapId:'LOC_COVE',text:'西岸へ上陸するとBrukka村が見える。三人の騎馬戦士が現れ、Chief Ghudvilの長屋へ同行するよう求める。',next:'11'},
  {id:'38',sourceEntry:38,title:'Arrival',location:'Knucklehook Cove',mapId:'LOC_COVE',text:'Utrirrの操船で嵐を切り抜け、AuroraはKnucklehook Coveへ到着する。',next:'37'},
  {
    id:'39',sourceEntry:39,title:'Deceiving the Dragon',location:"Dragon's Lair入口",mapId:'LOC_LAIR',
    text:'Thalgarが洞窟の外からXakkrathを挑発し、あなたは出口脇で待ち伏せする。',
    check:{label:'Thalgar 説得判定',dc:11,modifier:0,success:'17',failure:'56'}
  },
  {id:'40',sourceEntry:40,title:'Warming Up',location:'Frozen Plain・薄氷',mapId:'LOC_THINICE',text:'日差しで雪原の表面が緩み始める。危険を見抜けるかを判定する。',check:{label:'生存判定',ability:'wis',skill:'Survival',dc:14,success:'34',failure:'3'}},
  {id:'41',sourceEntry:41,title:'Failed Feint',location:"Dragon's Lair",mapId:'BATTLE_DRAGON',text:'攻撃は外れたが、Xakkrathを洞窟の外へ誘い出すことには成功した。二人は洞窟内へ戻り決戦に入る。',combat:{encounter:'xakkrath',monsterIds:['MON_XAKKRATH'],onWin:'75'}},
  {id:'42',sourceEntry:42,title:'Wrong Destination',location:'Trident Peak',mapId:'LOC_TRIDENT',text:'三つ峰へ近づいたところで、別の山から竜の咆哮が響く。目的地を間違えたため時間を失い、Whitetoothへ進路を変える。',enter:{set:{WANDERED:true}},next:'66'},
  {id:'43',sourceEntry:43,title:'Snow Blind',location:'Frozen Plain・吹雪',mapId:'LOC_TUNDRA',text:'雪と氷が目を傷め、以後この冒険中、視覚に依存するPerception判定が不利になる。',enter:{set:{snowBlind:true}},next:'72'},
  {
    id:'44',sourceEntry:44,title:'Hard Climb',location:'Whitetooth Peak',mapId:'LOC_WHITETOOTH',
    text:'登攀用具なしで登る。PCはAthletics DC14を3回、ThalgarはAthletics DC16を1回。WANDEREDならPCの判定は不利。失敗時には転落ダメージがある。',
    procedure:{type:'climb',withKit:false,pcDc:14,pcCount:3,thalgarDc:16,fallSaveDc:16,fallSuccessDamage:'2d6',fallFailureDamage:'4d6',thalgarFailureDamage:'8d6'},next:'10'
  },
  {id:'45',sourceEntry:45,title:'No Aid',location:'Brukka Longhouse',mapId:'LOC_LONGHOUSE',text:'協力してくれそうなBrukka戦士を見つけられない。情報なしで出発時刻を決める。',choices:[{label:'夜に出発する',next:'69'},{label:'一晩休む',next:'14'}]},
  {id:'46',sourceEntry:46,title:'Thalgar Exhausted',location:'Frozen Plain',mapId:'LOC_TUNDRA',text:'Thalgarは命を取り留めたが疲労が残る。3回のCONセーヴで1回だけ成功なら疲労1、全失敗なら疲労2。',enter:{setFromStored:{target:'thalgarExhaustion',source:'warmthSaveSuccessCount',map:{'1':1,'0':2}}},next:'72'},
  {id:'47',sourceEntry:47,title:'Rushed Escape',location:'Frozen Plain',mapId:'LOC_TUNDRA',text:'Yetiの追跡から離れるため全力で雪原を進み、やがて咆哮が遠ざかる。',next:'72'},
  {
    id:'48',sourceEntry:48,title:'Fur Trader',location:'Yeti戦後',mapId:'BATTLE_YETI',
    text:'Yetiの毛皮を傷つけず剥ぐ。NatureまたはSurvival DC16を2回行い、成功1回につき毛皮1枚を得る。',
    multiCheck:{label:'毛皮採取 ×2',count:2,dc:16,options:[{ability:'int',skill:'Nature'},{ability:'wis',skill:'Survival'}],rewardPerSuccess:{itemId:'ITEM_YETI_PELT',quantity:1},next:'72'}
  },
  {
    id:'49',sourceEntry:49,title:'Fire Starter',location:'Frozen Plain',mapId:'LOC_TUNDRA',
    text:'特別な防寒品がなく、Thalgarの体温が急速に下がる。木製品と火口箱があれば焚き火を試せる。本文では、必要品そのものを持たない場合の次のEntryは明記されていない。',
    itemCheck:{all:['ITEM_WOOD','ITEM_TINDERBOX'],label:'焚き火を起こす',ability:'wis',skill:'Survival',dc:16,success:'23',failure:'64',missing:null}
  },
  {id:'50',sourceEntry:50,title:'On the Run',location:'Frozen Plain',mapId:'LOC_TUNDRA',text:'馬を使わず、徒歩で凍った平原を南へ急ぐ。',next:'65'},
  {id:'51',sourceEntry:51,title:'To the Rescue',location:'Maer Dualdon',mapId:'LOC_AURORA',text:'Auroraは漂流船へ近づく。近くの船員が生存者の一人を見て「Thrayn？」とつぶやく。',choices:[{label:'船員に事情を聞く',next:'5'},{label:'漂流船へ呼びかける',next:'31'}]},
  {
    id:'52',sourceEntry:52,title:'Foreboding Tracks',location:'Frozen Plain',mapId:'LOC_TUNDRA',
    text:'巨大なYetiの足跡と咆哮に気づく。見つからずに離れられるかを試す。かんじきがあれば有利、馬に乗っていれば不利。',
    check:{label:'Yetiから離れる',dc:18,options:[{ability:'dex',skill:'Stealth'},{ability:'wis',skill:'Survival'}],advantageIfItem:'ITEM_SNOWSHOES',disadvantageIfState:'MOUNT',success:'47',failure:'74'}
  },
  {id:'53',sourceEntry:53,title:'Getting Underway',location:'Aurora / Maer Dualdon',mapId:'LOC_AURORA',text:'Deep Scionを倒し、漂流船から釣り道具とライト・クロスボウを回収する。嵐が迫るため西岸へ急ぐ。',enter:{addItems:[{id:'ITEM_TACKLE',quantity:1},{id:'ITEM_LIGHT_CROSSBOW',quantity:1}]},next:'70'},
  {
    id:'54',sourceEntry:54,title:'Seeking Allies',location:'Brukka Longhouse',mapId:'LOC_LONGHOUSE',
    text:'Ghudvilの周囲を観察し、密かに協力してくれそうな人物を探す。',
    check:{label:'協力者を探す',dc:14,options:[{ability:'int',skill:'Investigation'},{ability:'wis',skill:'Insight'}],success:'4',failure:'45'}
  },
  {id:'55',sourceEntry:55,title:'Perfect Shot',location:"Dragon's Lair",mapId:'LOC_LAIR',text:'高い岩棚に潜むXakkrathを発見し、遠距離から先制を狙える。',attackOutcome:{label:'AC17への遠隔攻撃／竜のセーヴ',hit:'24',miss:'62'}},
  {id:'56',sourceEntry:56,title:'Dismissive Dragon',location:"Dragon's Lair入口",mapId:'LOC_LAIR',text:'Xakkrathは挑発に乗らず、洞窟の中から嘲笑する。正面から入るしかない。',next:'73'},
  {
    id:'57',sourceEntry:57,title:'Restless Horses',location:'Brukka Village',mapId:'LOC_BRUKKA',
    text:'馬を静かに連れ出せるか試す。PCかThalgarのどちらかがAnimal Handling DC12を行う。',
    check:{label:'馬を落ち着かせる',dc:12,options:[{label:'自分で判定',ability:'wis',skill:'Animal Handling'},{label:'Thalgarに任せる',modifier:1}],success:'33',failure:'2'}
  },
  {
    id:'58',sourceEntry:58,title:'Storm Warning',location:'Aurora・嵐',mapId:'LOC_AURORA',
    text:'出航が遅れたためAuroraは嵐に捕まる。オールを漕ぎながら、次に起きる危機をd20で決める。',
    roll:{die:20,label:'嵐 d20',ranges:[{max:7,next:'25'},{min:8,max:15,next:'61'},{min:16,next:'38'}]}
  },
  {id:'59',sourceEntry:59,title:'Something Fishy',location:'漂流漁船',mapId:'BATTLE_MAER',text:'漂流者の様子が不自然だと見抜き、Thalgarへ警戒を促す。直後にDeep Scionの襲撃が始まる。',enter:{set:{WARNED:true}},combat:{encounter:'deep-scion',monsterIds:['MON_DEEP_SCION'],onWin:'53'}},
  {
    id:'60',sourceEntry:60,title:'Entering the Cavern',location:"Dragon's Lair",mapId:'LOC_LAIR',
    text:'静かに洞窟内部へ入り、暗い上部の岩棚からXakkrathを探す。darkvisionがあれば有利、snow blindなら不利。',
    check:{label:'知覚判定',ability:'wis',skill:'Perception',dc:14,disadvantageIfState:'snowBlind',success:'55',failure:'35'}
  },
  {
    id:'61',sourceEntry:61,title:'Rogue Wave',location:'Aurora・嵐',mapId:'LOC_AURORA',
    text:'巨大な波がAuroraを斜めから襲い、甲板へ投げ出される。成功なら1d6、失敗なら2d6の殴打ダメージ。',
    save:{label:'DEXセーヴ',ability:'dex',dc:18,success:'37',failure:'37',successDamage:'1d6',failureDamage:'2d6'}
  },
  {id:'62',sourceEntry:62,title:'Dragon Defiant',location:"Dragon's Lair",mapId:'BATTLE_DRAGON',text:'先制攻撃は外れ、Xakkrathが岩棚から降下して戦闘へ入る。',combat:{encounter:'xakkrath',monsterIds:['MON_XAKKRATH'],onWin:'75'}},
  {id:'63',sourceEntry:63,title:'Message for the Captain',location:'Aurora',mapId:'LOC_AURORA',text:'持ち場を離れてUtrirrにThraynらしき人物のことを警告する。怒る船長を説得できるか。',check:{label:'説得判定',ability:'cha',skill:'Persuasion',dc:12,success:'9',failure:'68'}},
  {id:'64',sourceEntry:64,title:'Thalgar Holds On',location:'Frozen Plain',mapId:'LOC_TUNDRA',text:'焚き火に失敗するが、Thalgarは意志の力でどうにか持ちこたえる。以後、疲労3段階として扱う。',enter:{set:{thalgarExhaustion:3}},next:'72'},
  {id:'65',sourceEntry:65,title:'Signs of Struggle',location:'Frozen Plain',mapId:'LOC_TUNDRA',text:'南へ追跡する途中、Brukka戦士とYetiの死体、そして血痕を発見する。護送隊は損害を受け、速度が落ちている。',next:'19'},
  {
    id:'66',sourceEntry:66,title:'Whitetooth Peak',location:'Whitetooth Peak',mapId:'LOC_WHITETOOTH',
    text:'牙のようなWhitetooth Peakへ到着し、山腹に竜の巣らしき洞窟を見つける。登攀用具の有無で難易度が変わる。',
    itemBranch:{all:['ITEM_CLIMBER_KIT'],yes:'29',no:'44'}
  },
  {id:'67',sourceEntry:67,title:'Recovered Warrior',location:'Frozen Plain',mapId:'LOC_TUNDRA',text:'処置が奏功し、Thalgarは十分に回復する。食事を取り、再び南へ進む。',enter:{set:{thalgarExhaustion:0}},next:'72'},
  {id:'68',sourceEntry:68,title:'Ready and Waiting',location:'漂流漁船',mapId:'BATTLE_MAER',text:'Utrirrの説得には失敗したが、あなたとThalgarは警戒したまま漂流船へ接近する。Deep Scionの襲撃が始まる。',enter:{set:{WARNED:true}},combat:{encounter:'deep-scion',monsterIds:['MON_DEEP_SCION'],onWin:'53'}},
  {
    id:'69',sourceEntry:69,title:'Late-Night Departure',location:'Brukka Village',mapId:'LOC_BRUKKA',
    text:'村が静まった夜のうちに出発する。時間を稼ぎ、HASTEを得る。途中、厩舎に二頭の馬を見つける。',
    enter:{set:{HASTE:true}},choices:[{label:'馬を盗む',next:'57'},{label:'徒歩で出る',next:'50'}]
  },
  {id:'70',sourceEntry:70,title:'Arrival',location:'Knucklehook Cove',mapId:'LOC_COVE',text:'AuroraはKnucklehook Coveの穏やかな水域へ入り、西岸へ到着する。',next:'37'},
  {
    id:'71',sourceEntry:71,title:'Going Under',location:'薄氷の湖面',mapId:'LOC_THINICE',
    text:'Thalgarは割れた氷を避けきれず、冷水へ落ちる。引き上げた後、手持ちの防寒品で処置できるか確認する。',
    itemBranch:{any:['ITEM_KNUCKLEHEAD_OIL','ITEM_LLAMA_SHIRT'],yes:'26',no:'49'}
  },
  {
    id:'72',sourceEntry:72,title:'Icy Ambush',location:'二峰手前',mapId:'LOC_TWOPEAKS',
    text:'深雪のため馬はここで放棄する。二つの山が目前に迫り、休憩できる場所で短休憩を取ることもできる。その先には奇妙な氷の塊が並ぶ。',
    enter:{set:{MOUNT:false}},choices:[{label:'短休憩してから進む',set:{shortRestTaken:true},next:'8'},{label:'そのまま進む',next:'8'}]
  },
  {id:'73',sourceEntry:73,title:'Facing the Dragon',location:"Dragon's Lair",mapId:'BATTLE_DRAGON',text:'Thalgarと共に洞窟へ踏み込み、Xakkrathへ正面から挑む。Malgarの前で決戦が始まる。',combat:{encounter:'xakkrath',monsterIds:['MON_XAKKRATH'],onWin:'75'}},
  {id:'74',sourceEntry:74,title:'Yeti Attack',location:'Frozen Plain',mapId:'BATTLE_YETI',text:'逃げ切れず、二体のYetiが雪原から迫る。Thalgarは火を恐れることを教える。',combat:{encounter:'yeti',monsterIds:['MON_YETI'],onWin:'27'}},
  {
    id:'75',sourceEntry:75,title:'Victory?',location:"Dragon's Lair",mapId:'LOC_LAIR',
    text:'Xakkrathは倒れた。Thalgarが戦闘を生き延びたかどうかで結末が変わる。',
    stateBranch:{key:'thalgarDead',truthy:'6',falsy:'76'}
  },
  {
    id:'76',sourceEntry:76,title:'Malgar Saved',location:"Dragon's Lair → Targos",mapId:'LOC_LAIR',
    text:'Malgarを救出し、兄弟は再会する。竜の財宝を回収し、二日かけてTargosへ戻る。Thalgarから約束の500 gpを受け取り、冒険は完了する。',
    end:true,complete:true,rewardIds:['REWARD_CONTRACT','REWARD_HOARD_COINS','REWARD_HOARD_GEMS','REWARD_STONE_GIANT_POTION','REWARD_NECKLACE_FIREBALLS','REWARD_XP']
  }
];
