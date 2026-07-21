let playerState = {
    name: '',
    level: 1,
    rank: '凡人',
    wuhun: '',
    isTwin: false,
    aptitude: '',
    training: '无',
    faction: '未加入',
    rings: [],
    boneCount: 0,
    soulPower: 10
};

let currentStageIndex = 0;
let isSpinning = false;
let currentRotation = 0;

const stages = [
    // ===== 1-10级：武魂觉醒 =====
    {
        title: "圣魂村武魂觉醒仪式",
        btnLabel: "觉醒武魂",
        getOptions: () => ["蓝银草（废武魂）", "昊天锤（顶级器武魂）", "邪眸白虎（顶级兽武魂）", "七宝琉璃塔（辅助系）", "柔骨兔（敏攻系）", "六翼天使（神级武魂）"],
        onSelect: (opt) => {
            playerState.wuhun = opt.split("（")[0];
            addLog(`✨ 【武魂觉醒】你在老村长杰克的注视下觉醒了武魂：【${playerState.wuhun}】！体内涌现出一股温热的魂力流。`);
        }
    },
    {
        title: "素云涛的先天魂力测试",
        btnLabel: "测试魂力",
        getOptions: () => ["1级（废柴资质）", "5级（普通资质）", "8级（天才资质）", "10级（先天满魂力）"],
        onSelect: (opt) => {
            playerState.aptitude = opt.split("（")[0];
            playerState.level = 10;
            playerState.rank = "魂士";
            
            if (opt.includes("10级")) {
                if (Math.random() < 0.5 && playerState.wuhun !== "六翼天使") {
                    playerState.isTwin = true;
                    playerState.wuhun += "+昊天锤（双生武魂）";
                    addLog(`🔥 【天选之子】素云涛大惊失色："先天满魂力！慢着，你的左手……竟然是【双生武魂】！！"`, "legendary");
                } else {
                    addLog(`🔮 【资质测试】素云涛狂呼："竟然是百年难遇的【先天满魂力】！天佑我武魂殿！"`, "legendary");
                }
            } else if (opt.includes("8级")) {
                addLog(`🔮 【资质测试】测得先天魂力8级，属于极佳的天才资质，各大学院争相抛出橄榄枝。`);
            } else {
                addLog(`🔮 【资质测试】测得先天魂力较平庸，你暗暗发誓要通过努力打破血统偏见。`);
            }
        }
    },

    // ===== 11-20级：学院生活 =====
    {
        title: "诺丁学院入学选择",
        btnLabel: "选择道路",
        getOptions: () => ["拜师玉小刚（学习理论）", "独自苦修（野外出猎）", "参加学院大比（崭露头角）", "闯荡星斗大森林外围（冒险）"],
        onSelect: (opt) => {
            if (opt.includes("玉小刚")) {
                playerState.training = "大师门下";
                playerState.soulPower += 5;
                addLog(`📚 【拜师学艺】你拜入理论大师玉小刚门下，系统学习了武魂与魂环的搭配理论，魂力提升5点。`);
            } else if (opt.includes("独自")) {
                playerState.training = "独自苦修";
                playerState.soulPower += 3;
                addLog(`🌲 【独自历练】你在野外不断猎杀魂兽积累实战经验，魂力提升3点。`);
            } else if (opt.includes("大比")) {
                playerState.training = "学院大比";
                playerState.soulPower += 4;
                addLog(`⚔️ 【学院扬名】你在学院大比中表现亮眼，引起各方关注，魂力提升4点。`);
            } else {
                playerState.training = "星斗历练";
                playerState.soulPower += 6;
                if (Math.random() < 0.3) {
                    playerState.boneCount += 1;
                    addLog(`🦴 【意外收获】你在星斗大森林外围遭遇险境，却意外发现一块魂骨碎片并成功融合！魂力提升6点。`, "legendary");
                } else {
                    addLog(`🌲 【星斗历练】你在星斗大森林外围与低阶魂兽搏杀，积累实战经验，魂力提升6点。`);
                }
            }
        }
    },
    {
        title: "吸收第1魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => {
            const w = playerState.wuhun;
            if (w.includes("蓝银草")) return ["十年风狒狒环", "百年曼陀罗蛇环", "十年野狼环", "百年孤竹环"];
            if (w.includes("昊天锤")) return ["十年灰熊环", "百年千钧蚁环", "十年野猪环", "百年泰坦巨猿残环"];
            if (w.includes("白虎")) return ["十年风狒狒环", "百年狂暴狼环", "十年独角仙环", "百年金刚虎环"];
            if (w.includes("七宝")) return ["十年荧光虫环", "百年幻心狐环", "十年灵猫环", "百年幽冥狼环"];
            if (w.includes("柔骨兔")) return ["十年柔骨兔环", "百年鬼藤环", "十年风狒狒环", "百年人面魔蛛环"];
            return ["十年风狒狒环", "百年狂暴狼环", "十年孤狼环", "百年金刚虎环"];
        },
        onSelect: (opt) => {
            playerState.level = 20;
            playerState.rank = "大魂师";
            if (opt.includes("百年")) {
                if (playerState.aptitude && playerState.aptitude.includes("废柴")) {
                    playerState.rings.push("白");
                    addLog(`⚠️ 【魂环反噬】你试图融合【${opt}】，先天魂力不足导致经脉剧痛！最终只吸收了退化的【白色十年魂环】。`, "critical");
                } else {
                    playerState.rings.push("黄");
                    addLog(`⚡ 【越阶吸收】你凭借资质成功融合【${opt}】！获得【黄色百年魂环】！`, "legendary");
                }
            } else {
                playerState.rings.push("白");
                addLog(`🌿 【魂环吸收】你猎杀了合适的低年限魂兽，成功吸收第一枚【白色十年魂环】。`);
            }
        }
    },

    // ===== 21-30级：斗魂场 =====
    {
        title: "索托大斗魂场挑战",
        btnLabel: "报名斗魂",
        getOptions: () => ["稳扎稳打（银斗魂）", "连胜狂飙（金斗魂）", "遭遇强敌（惨败磨砺）", "获得外附魂骨：八蛛矛（极罕见）"],
        onSelect: (opt) => {
            playerState.soulPower += 8;
            if (opt.includes("八蛛矛")) {
                playerState.boneCount += 1;
                addLog(`🦴 【神赐机缘】大魂斗场生死战中，你绝地反击，体内异种魂力凝聚成【外附魂骨·八蛛矛】！魂力提升8点！`, "legendary");
            } else if (opt.includes("惨败")) {
                playerState.soulPower += 5;
                addLog(`💥 【大挫折】你在索托大魂斗场惨遭皇斗战队重创，但在养伤中磨砺了意志，魂力提升5点。`);
            } else if (opt.includes("金斗魂")) {
                addLog(`🏅 【金斗魂】你在斗魂场连胜二十场以上，斩获金斗魂徽章，名震一方！魂力提升8点。`);
            } else {
                addLog(`⚔️ 【银斗魂】你在斗魂场稳扎稳打，获得银斗魂徽章，魂力提升8点。`);
            }
        }
    },
    {
        title: "结识史莱克七怪",
        btnLabel: "选择伙伴",
        getOptions: () => ["与唐三结拜（获得暗器指导）", "与戴沐白切磋（提升战斗技巧）", "与奥斯卡合作（学习辅助配合）", "独自行动（保持神秘）"],
        onSelect: (opt) => {
            playerState.level = 30;
            playerState.rank = "魂尊";
            playerState.soulPower += 6;
            if (opt.includes("唐三")) {
                addLog(`🤝 【结拜兄弟】你与唐三结为异姓兄弟，学习了他独创的暗器手法，战斗技巧大增！魂力提升6点。`);
            } else if (opt.includes("戴沐白")) {
                addLog(`⚔️ 【切磋成长】你与邪眸白虎戴沐白多次切磋，领悟了顶级兽武魂的战斗精髓！魂力提升6点。`);
            } else if (opt.includes("奥斯卡")) {
                addLog(`🍄 【辅助配合】你与食物系魂师奥斯卡合作，学会了如何在战斗中利用辅助魂技！魂力提升6点。`);
            } else {
                addLog(`🐺 【独狼之路】你选择独自行动，保持神秘感，在暗中观察史莱克七怪的成长。魂力提升6点。`);
            }
        }
    },
    {
        title: "吸收第2魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => {
            const w = playerState.wuhun;
            if (w.includes("蓝银草")) return ["百年鬼藤环", "百年曼陀罗蛇环", "千年地穴魔蛛环（极限）", "百年蓝银草王环"];
            if (w.includes("昊天锤")) return ["百年人面魔蛛环", "百年千钧蚁王环", "千年地穴魔蛛环（极限）", "百年暗金恐爪熊环"];
            if (w.includes("白虎")) return ["百年金刚虎环", "百年邪眸白虎残魂环", "千年幽冥豹环（极限）", "百年狂暴狼王环"];
            return ["百年幽冥狼环", "百年鬼藤环", "千年人面魔蛛环（极限）", "百年幻心狐环"];
        },
        onSelect: (opt) => {
            if (opt.includes("千年")) {
                if (playerState.aptitude && (playerState.aptitude.includes("废柴") || playerState.aptitude.includes("普通"))) {
                    playerState.rings.push("黄");
                    addLog(`⚠️ 【越阶失败】你试图吸收【${opt}】，千年魂兽的力量远超你的承受极限！最终只吸收了退化的【黄色百年魂环】。`, "critical");
                } else {
                    playerState.rings.push("紫");
                    addLog(`⚡ 【越阶成功】你凭借过人的资质强行融合【${opt}】！获得【紫色千年魂环】！`, "legendary");
                }
            } else {
                playerState.rings.push("黄");
                addLog(`🌿 【魂环吸收】你猎杀了合适的百年魂兽，成功吸收第二枚【黄色百年魂环】。`);
            }
        }
    },

    // ===== 31-40级：精英大赛 =====
    {
        title: "全大陆高级魂师精英大赛",
        btnLabel: "报名参赛",
        getOptions: () => ["史莱克七怪主力（加入史莱克）", "武魂殿战队核心（加入武魂殿）", "天斗皇家主力（加入天斗皇室）", "散修联盟黑马（保持独立）"],
        onSelect: (opt) => {
            playerState.level = 40;
            playerState.rank = "魂宗";
            playerState.faction = opt.split("（")[0];
            playerState.soulPower += 10;
            if (opt.includes("史莱克")) {
                addLog(`🏆 【精英大赛】你代表史莱克学院出战，与伙伴们一路过关斩杀，在总决赛中名震大陆！魂力提升10点。`);
            } else if (opt.includes("武魂殿")) {
                addLog(`🏆 【精英大赛】你作为武魂殿战队核心出战，展现出惊人的实力，被教皇亲自接见！魂力提升10点。`);
            } else if (opt.includes("天斗")) {
                addLog(`🏆 【精英大赛】你代表天斗皇家学院出战，虽未夺冠但表现出色，被皇室重用！魂力提升10点。`);
            } else {
                addLog(`🏆 【精英大赛】你以散修身份参赛，一路黑马杀入决赛圈，虽败犹荣！魂力提升10点。`);
            }
        }
    },
    {
        title: "星斗大森林猎杀魂兽",
        btnLabel: "猎杀魂兽",
        getOptions: () => ["猎杀人面魔蛛（获得蛛网技能）", "猎杀地穴魔蛛（获得毒属性）", "猎杀暗金恐爪熊（获得力量加成）", "猎杀十首烈阳蛇（获得火焰属性）"],
        onSelect: (opt) => {
            playerState.soulPower += 8;
            if (opt.includes("人面魔蛛")) {
                addLog(`🕷️ 【猎杀人面魔蛛】你成功猎杀千年人面魔蛛，获得蛛网束缚技能！魂力提升8点。`);
            } else if (opt.includes("地穴魔蛛")) {
                addLog(`🕸️ 【猎杀地穴魔蛛】你成功猎杀千年地穴魔蛛，获得剧毒属性攻击！魂力提升8点。`);
            } else if (opt.includes("暗金恐爪熊")) {
                addLog(`🐻 【猎杀暗金恐爪熊】你成功猎杀千年暗金恐爪熊，获得恐怖的力量加成！魂力提升8点。`);
            } else {
                addLog(`🐍 【猎杀十首烈阳蛇】你成功猎杀千年十首烈阳蛇，获得炽热火焰属性！魂力提升8点。`);
            }
        }
    },
    {
        title: "吸收第3魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => {
            const w = playerState.wuhun;
            if (w.includes("蓝银草")) return ["千年鬼藤环", "千年人面魔蛛环", "千年地穴魔蛛环", "万年千钧蚁环（极限）"];
            if (w.includes("昊天锤")) return ["千年暗金恐爪熊环", "千年人面魔蛛环", "千年地穴魔蛛环", "万年泰坦巨猿残环（极限）"];
            if (w.includes("白虎")) return ["千年幽冥豹环", "千年邪眸白虎残魂环", "千年金刚虎王环", "万年狂暴巨兽环（极限）"];
            return ["千年幻心狐环", "千年幽冥狼王环", "千年鬼藤王环", "万年人面魔蛛环（极限）"];
        },
        onSelect: (opt) => {
            if (opt.includes("万年")) {
                if (playerState.isTwin || (playerState.aptitude && playerState.aptitude.includes("先天满魂力"))) {
                    playerState.rings.push("黑");
                    addLog(`⚡ 【极限越阶】你以惊人的天赋强行融合【${opt}】！获得【黑色万年魂环】！震惊在场所有人！`, "legendary");
                } else {
                    playerState.rings.push("紫");
                    addLog(`⚠️ 【越阶失败】你试图吸收【${opt}】，万年魂兽的力量太过恐怖！最终只吸收了退化的【紫色千年魂环】。`, "critical");
                }
            } else {
                playerState.rings.push("紫");
                addLog(`🌿 【魂环吸收】你猎杀了合适的千年魂兽，成功吸收第三枚【紫色千年魂环】。`);
            }
        }
    },

    // ===== 41-50级：魂王之路 =====
    {
        title: "海神岛试炼前夕",
        btnLabel: "选择道路",
        getOptions: () => ["前往海神岛（接受神考）", "前往杀戮之都（修罗之路）", "留守大陆（守护宗门）", "远赴海外仙岛（寻仙缘）"],
        onSelect: (opt) => {
            playerState.level = 50;
            playerState.rank = "魂王";
            playerState.soulPower += 12;
            if (opt.includes("海神岛")) {
                playerState.training = "海神岛";
                addLog(`🌊 【海神岛】你远渡重洋来到海神岛，感受到浩瀚的海神之力，开启海神九考之路！魂力提升12点。`);
            } else if (opt.includes("杀戮之都")) {
                playerState.training = "杀戮之都";
                addLog(`💀 【杀戮之都】你踏入大陆最危险的禁地杀戮之都，在血腥与杀戮中磨砺意志，魂力提升12点。`);
            } else if (opt.includes("海外仙岛")) {
                playerState.training = "海外仙岛";
                addLog(`🏝️ 【海外仙岛】你远赴海外寻找传说中的仙岛，在神秘的灵气中修炼，魂力提升12点。`);
            } else {
                playerState.training = "守护宗门";
                addLog(`🛡️ 【守护宗门】你选择留守大陆守护宗门，在一次次抵御外敌的战斗中成长，魂力提升12点。`);
            }
        }
    },
    {
        title: "吸收第4魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => ["万年地穴魔蛛环", "万年人面魔蛛皇环", "万年暗金恐爪熊环", "十万年魂兽残魂环（极险）"],
        onSelect: (opt) => {
            if (opt.includes("十万年")) {
                if (playerState.isTwin) {
                    playerState.rings.push("红");
                    addLog(`🔥 【逆天改命】你以双生武魂之躯强行融合【${opt}】！获得【红色十万年魂环】！天地变色！`, "legendary");
                } else {
                    playerState.rings.push("黑");
                    addLog(`💀 【九死一生】你试图融合十万年残魂环，险些爆体而亡！最终只吸收了【黑色万年魂环】。`, "critical");
                }
            } else {
                playerState.rings.push("黑");
                addLog(`🌿 【魂环吸收】你猎杀了合适的万年魂兽，成功吸收第四枚【黑色万年魂环】。`);
            }
        }
    },

    // ===== 51-60级：极限挑战 =====
    {
        title: "海神九考/修罗试炼",
        btnLabel: "接受试炼",
        getOptions: () => {
            if (playerState.training === "海神岛") return ["海神第四考（海魂兽挑战）", "海神第五考（挑战海神封印）", "海神第六考（深海魔鲸王）", "海神三考连过（神赐机缘）"];
            if (playerState.training === "杀戮之都") return ["杀戮之都第十场（杀神领域）", "挑战地狱路（逃出杀都）", "遭遇唐晨残魂（传承指引）", "血战百场（杀戮之王）"];
            return ["深入星斗大森林（猎杀魂兽）", "挑战各大宗门（以战养战）", "探索死亡峡谷（险地求生）", "拜访隐世强者（寻求指点）"];
        },
        onSelect: (opt) => {
            playerState.level = 60;
            playerState.rank = "魂帝";
            playerState.soulPower += 15;
            if (opt.includes("神赐") || opt.includes("连过")) {
                addLog(`🌊 【神赐机缘】你连过海神三考，获得海神之力加持，觉醒武魂真身！魂力提升15点！`, "legendary");
            } else if (opt.includes("杀神领域") || opt.includes("地狱路")) {
                addLog(`💀 【杀神领域】你在杀戮之都的终极试炼中获得【杀神领域】！这是大陆最强战斗领域之一！魂力提升15点！`, "legendary");
            } else if (opt.includes("唐晨")) {
                playerState.boneCount += 1;
                addLog(`👻 【唐晨残魂】你遇到了被困在杀戮之都的唐晨残魂，他传授你昊天宗绝学并赠予魂骨！魂力提升15点！`, "legendary");
            } else {
                addLog(`⚔️ 【艰难历练】你在残酷的试炼中九死一生，最终突破瓶颈，达到60级魂帝境界。魂力提升15点。`);
            }
        }
    },
    {
        title: "吸收第5魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => ["万年魔蛛皇环", "万年天青牛蟒环", "万年泰坦巨猿环", "十万年魂兽残魂环（极险）"],
        onSelect: (opt) => {
            if (opt.includes("十万年")) {
                if (playerState.training === "海神岛" || playerState.isTwin) {
                    playerState.rings.push("红");
                    addLog(`🔥 【逆天机缘】你在特殊历练中获得【${opt}】！以惊人毅力融合成功，获得【红色十万年魂环】！`, "legendary");
                } else {
                    playerState.rings.push("黑");
                    addLog(`💀 【九死一生】十万年残魂环的力量太过恐怖，你险些陨落，最终只吸收了【黑色万年魂环】。`, "critical");
                }
            } else {
                playerState.rings.push("黑");
                addLog(`🌿 【魂环吸收】你猎杀了合适的万年魂兽，成功吸收第五枚【黑色万年魂环】。`);
            }
        }
    },

    // ===== 61-70级：武魂真身 =====
    {
        title: "武魂真身觉醒",
        btnLabel: "觉醒真身",
        getOptions: () => ["完美觉醒（魂力暴涨）", "普通觉醒（稳步提升）", "失败觉醒（魂力受损）", "意外觉醒（获得特殊能力）"],
        onSelect: (opt) => {
            playerState.level = 70;
            playerState.rank = "魂圣";
            if (opt.includes("完美")) {
                playerState.soulPower += 20;
                addLog(`✨ 【完美觉醒】你的武魂真身完美觉醒，魂力暴涨20点！获得武魂真身技能！`, "legendary");
            } else if (opt.includes("普通")) {
                playerState.soulPower += 12;
                addLog(`✨ 【普通觉醒】你的武魂真身成功觉醒，魂力提升12点。获得武魂真身技能。`);
            } else if (opt.includes("失败")) {
                playerState.soulPower += 5;
                addLog(`⚠️ 【失败觉醒】武魂真身觉醒失败，魂力仅提升5点，但仍获得了真身技能。`, "critical");
            } else {
                playerState.soulPower += 18;
                playerState.boneCount += 1;
                addLog(`🌟 【意外觉醒】武魂真身觉醒时意外获得特殊能力，并发现一块隐藏魂骨！魂力提升18点！`, "legendary");
            }
        }
    },
    {
        title: "宗门猎魂大战",
        btnLabel: "迎击浩劫",
        getOptions: () => ["奇袭武魂殿后方（缴获魂骨）", "死守天斗城（宗门献祭）", "中立避世（暗中修炼）", "单枪匹马闯敌营（孤胆英雄）"],
        onSelect: (opt) => {
            playerState.soulPower += 15;
            if (opt.includes("献祭")) {
                addLog(`💥 【宗门献祭】宗门长老以生命为代价为你凝聚魂环之力！你在悲痛中爆发，魂力提升15点！`, "critical");
            } else if (opt.includes("魂骨")) {
                playerState.boneCount += 1;
                addLog(`💎 【战利品丰厚】你奇袭敌营斩杀强敌，缴获一枚【十万年魂骨】！魂力提升15点。`, "legendary");
            } else if (opt.includes("孤胆")) {
                addLog(`⚔️ 【孤胆英雄】你单枪匹马闯入敌营，斩杀敌方多名高手，威震大陆！魂力提升15点。`);
            } else {
                addLog(`⚖️ 【暗中修炼】你未参与正面大战，在暗中默默修炼，魂力提升15点。`);
            }
        }
    },
    {
        title: "吸收第6魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => ["万年暗金恐爪熊皇环", "万年起死回生藤环", "万年十首烈阳蛇环", "十万年魂兽残魂环（极险）"],
        onSelect: (opt) => {
            if (opt.includes("十万年")) {
                if (playerState.training === "海神岛" || playerState.isTwin) {
                    playerState.rings.push("红");
                    addLog(`🔥 【逆天机缘】你在特殊历练中获得【${opt}】！以惊人毅力融合成功，获得【红色十万年魂环】！`, "legendary");
                } else {
                    playerState.rings.push("黑");
                    addLog(`💀 【九死一生】十万年残魂环的力量太过恐怖，你险些陨落，最终只吸收了【黑色万年魂环】。`, "critical");
                }
            } else {
                playerState.rings.push("黑");
                addLog(`🌿 【魂环吸收】你猎杀了合适的万年魂兽，成功吸收第六枚【黑色万年魂环】。`);
            }
        }
    },

    // ===== 71-80级：封号斗罗之路 =====
    {
        title: "封号斗罗突破",
        btnLabel: "冲击封号",
        getOptions: () => ["获得封号：昊天斗罗", "获得封号：九彩斗罗", "获得封号：天使斗罗", "获得封号：毒斗罗", "自创封号：无双斗罗"],
        onSelect: (opt) => {
            playerState.level = 80;
            playerState.rank = "封号斗罗";
            playerState.soulPower += 25;
            const title = opt.split("：")[1] || "无双斗罗";
            if (playerState.isTwin || playerState.training === "海神岛") {
                addLog(`👑 【封号斗罗】你引来天地异象，受封【${title}】！成为大陆最年轻的封号斗罗之一！魂力提升25点！`, "legendary");
            } else {
                addLog(`👑 【封号斗罗】你历经磨难，最终加冕【${title}】！站在大陆魂师界的巅峰！魂力提升25点。`);
            }
        }
    },
    {
        title: "吸收第7魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => ["十万年魂兽环（需极强资质）", "万年魔蛛皇环", "万年天青牛蟒环", "万年泰坦巨猿环"],
        onSelect: (opt) => {
            if (opt.includes("十万年")) {
                if (playerState.isTwin || playerState.training === "海神岛") {
                    playerState.rings.push("红");
                    addLog(`🔥 【十万年魂环】你以超凡实力猎杀十万年魂兽！获得【红色十万年魂环】！天地为之变色！`, "legendary");
                } else {
                    playerState.rings.push("黑");
                    addLog(`💀 【猎杀失败】十万年魂兽太过强大，你拼尽全力也只能吸收退化的【黑色万年魂环】。`, "critical");
                }
            } else {
                playerState.rings.push("黑");
                addLog(`🌿 【魂环吸收】你猎杀了合适的万年魂兽，成功吸收第七枚【黑色万年魂环】。`);
            }
        }
    },

    // ===== 81-90级：神位传承 =====
    {
        title: "神位传承试炼",
        btnLabel: "接受传承",
        getOptions: () => {
            const fac = playerState.faction;
            const train = playerState.training;
            if (fac.includes("史莱克") || train === "海神岛") return ["海神传承（神王之位）", "修罗神传承（神王之位）", "战神传承（二级神祇）", "自创神位（风险极大）"];
            if (fac.includes("武魂殿")) return ["天使神传承（一级神祇）", "罗刹神传承（一级神祇）", "自创情绪之神（叛逆之路）", "放弃神位（永留凡间）"];
            return ["自创无双神位（至尊神王）", "食神传承（逍遥神祇）", "继承远古神位（一级神祇）", "放弃成神（绝世斗罗）"];
        },
        onSelect: (opt) => {
            playerState.level = 90;
            playerState.rank = "极限斗罗";
            playerState.soulPower += 30;
            if (opt.includes("神王") || opt.includes("神传承") || opt.includes("一级神") || opt.includes("二级神") || opt.includes("自创")) {
                addLog(`🏆 【神位传承】你通过终极试炼，成功获得【${opt}】！神界的大门为你而开！魂力提升30点！`, "legendary");
            } else {
                addLog(`🥀 【凡尘终点】你选择留在凡间，以绝世斗罗之姿守护大陆，寿元千载，令人敬仰。魂力提升20点。`);
                playerState.soulPower = 80;
            }
        }
    },
    {
        title: "吸收第8魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => ["十万年魂兽环（需极强资质）", "十万年魔蛛女皇环", "万年天青牛蟒皇环", "万年深海魔鲸环"],
        onSelect: (opt) => {
            if (opt.includes("十万年") && !opt.includes("资质")) {
                playerState.rings.push("红");
                addLog(`🔥 【十万年魂环】你猎杀了十万年魂兽，成功吸收第八枚【红色十万年魂环】！`, "legendary");
            } else if (opt.includes("十万年")) {
                if (playerState.isTwin || playerState.training === "海神岛" || playerState.boneCount >= 2) {
                    playerState.rings.push("红");
                    addLog(`🔥 【逆天资质】你以超凡实力强行猎杀十万年魂兽！获得【红色十万年魂环】！`, "legendary");
                } else {
                    playerState.rings.push("黑");
                    addLog(`💀 【实力不足】你无法猎杀十万年魂兽，最终只吸收了【黑色万年魂环】。`, "critical");
                }
            } else {
                playerState.rings.push("黑");
                addLog(`🌿 【魂环吸收】你猎杀了合适的万年魂兽，成功吸收第八枚【黑色万年魂环】。`);
            }
        }
    },

    // ===== 91-100级：成神之路 =====
    {
        title: "成神之路最终试炼",
        btnLabel: "终极挑战",
        getOptions: () => ["挑战神界委员会（成为神王）", "守护大陆（成为守护神）", "探索宇宙（成为星际神祇）", "放弃神位（永留凡间）"],
        onSelect: (opt) => {
            playerState.level = 100;
            playerState.rank = "神界至尊";
            playerState.soulPower += 50;
            if (opt.includes("神王") || opt.includes("守护神") || opt.includes("星际")) {
                playerState.rings.push("金");
                addLog(`🌟 【成神之路】你通过终极试炼，成功【${opt}】！十环齐耀，你已成为超越神王的存在！斗罗大陆永远传颂着【${playerState.name}】的不朽传说！`, "legendary");
            } else {
                addLog(`🥀 【凡尘终点】你选择留在凡间，虽未成神，但已是大陆之巅。【${playerState.name}】的名字永远铭刻在斗罗历史上。`);
            }
        }
    },
    {
        title: "吸收第9魂环",
        btnLabel: "猎杀魂兽",
        getOptions: () => ["十万年魂兽环", "百万年魂兽环（神级挑战）", "十万年天青牛蟒环", "十万年泰坦巨猿环"],
        onSelect: (opt) => {
            if (opt.includes("百万年")) {
                if (playerState.isTwin && playerState.training === "海神岛") {
                    playerState.rings.push("金");
                    addLog(`🌟 【百万年魂环】你以双生武魂+海神之力的逆天资质，猎杀百万年魂兽！获得【金色百万年魂环】！前无古人！`, "legendary");
                } else {
                    playerState.rings.push("红");
                    addLog(`💀 【百万年之威】百万年魂兽的力量远超想象！你拼尽全力只吸收了【红色十万年魂环】。`, "critical");
                }
            } else {
                playerState.rings.push("红");
                addLog(`🔥 【十万年魂环】你猎杀了十万年魂兽，成功吸收第九枚【红色十万年魂环】！九环齐备！`);
            }
        }
    },
    {
        title: "吸收第10魂环·终极",
        btnLabel: "终极蜕变",
        getOptions: () => {
            if (playerState.rank === "神界至尊") return ["神环融合（双神合一）", "神环进化（百万年金环）", "神环觉醒（超越神王）", "神环归一（大道至简）"];
            return ["凡人之躯强行吸纳（爆体风险）", "以魂骨为媒凝聚神环", "放弃第十环（保持现状）", "借天地之力凝聚伪神环"];
        },
        onSelect: (opt) => {
            if (playerState.rank === "神界至尊") {
                playerState.rings.push("金");
                addLog(`🌟 🌟 🌟 【终极蜕变·大结局】你成功吸收第十枚【金色神级魂环】！十环齐耀，你已成为超越神王的存在！斗罗大陆永远传颂着【${playerState.name}】的不朽传说！`, "legendary");
            } else {
                if (opt.includes("爆体") || opt.includes("放弃")) {
                    addLog(`🥀 🍂 【凡尘终点·大结局】你【${opt}】，虽未成神，但九环封号斗罗已是大陆之巅。【${playerState.name}】的名字永远铭刻在斗罗历史上。`, "critical");
                } else {
                    playerState.rings.push("金");
                    addLog(`✨ 【奇迹诞生·大结局】你以凡人之躯创造了奇迹！成功凝聚【金色伪神环】！虽非真神，却已超越凡间极限！【${playerState.name}】的传说永不磨灭！`, "legendary");
                }
            }
            spinBtn.style.display = 'none';
            restartBtn.style.display = 'inline-block';
        }
    }
];
