window.DD_JA_LABELS={
skills:{'Acrobatics':'軽業','Animal Handling':'動物使い','Arcana':'魔法学','Athletics':'運動','Deception':'ペテン','History':'歴史','Insight':'看破','Intimidation':'威圧','Investigation':'捜査','Medicine':'医術','Nature':'自然','Perception':'知覚','Performance':'芸能','Persuasion':'説得','Religion':'宗教','Sleight of Hand':'手先の早業','Stealth':'隠密','Survival':'生存'},
languages:{'Common Sign Language':'共通手話','Draconic':'竜語','Dwarvish':'ドワーフ語','Elvish':'エルフ語','Giant':'巨人語','Gnomish':'ノーム語','Goblin':'ゴブリン語','Halfling':'ハーフリング語','Orc':'オーク語'},
alignments:{'Lawful Good':'秩序にして善','Neutral Good':'中立にして善','Chaotic Good':'混沌にして善','Lawful Neutral':'秩序にして中立','Neutral':'真なる中立','Chaotic Neutral':'混沌にして中立','Lawful Evil':'秩序にして悪','Neutral Evil':'中立にして悪','Chaotic Evil':'混沌にして悪'},
feats:{'Alert':'警戒','Crafter':'製作者','Healer':'治療師','Lucky':'幸運','Magic Initiate':'魔法のたしなみ','Musician':'音楽家','Savage Attacker':'猛攻','Skilled':'技能習熟','Tavern Brawler':'酒場流喧嘩殺法','Tough':'頑健'},
species:{Dragonborn:'ドラゴンボーン',Dwarf:'ドワーフ',Elf:'エルフ',Gnome:'ノーム',Goliath:'ゴライアス',Halfling:'ハーフリング',Human:'ヒューマン',Orc:'オーク',Tiefling:'ティーフリング'},
terms:{'Cantrip':'キャントリップ（初級呪文）','Skill Proficiency':'技能習熟','Origin Feat':'オリジン特技','Background':'背景・出自','Species':'種族','Language':'言語','Common':'共通語'},
label(value,group){const m=this[group]||{};return m[value]?`${value}（${m[value]}）`:value;}
};