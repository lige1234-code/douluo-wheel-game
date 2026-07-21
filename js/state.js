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
    boneCount: 0
};

let currentStageIndex = 0;
let isSpinning = false;
let currentRotation = 0;

const stages = [
    {
        title: "1-10级：圣魂村武魂觉醒",
        btnLabel: "觉醒武魂",
        getOptions: () => ["蓝银草", "昊天锤", "邪眸白虎", "七宝琉璃塔", "柔骨兔", "六翼天使"],
        onSelect: (opt) => {
            playerState.wuhun = opt;
            playerState.level = 10;
            playerState.rank = "准魂士";
            updateStatusUI();
            addLog(`✨ 【武魂觉醒】你在老村长杰克的注视下觉醒了武魂：【${opt}】！体内涌现出一股温热的魂力流。`);
        }
    },
    {
        title: "10级：素云涛的资质测试",
        btnLabel: "测试先天魂力",
        getOptions: () => ["1级 (废柴资质)", "5级 (普通资质)", "8级 (天才资质)", "10级 (先天满魂力)"],
        onSelect: (opt) => {
            playerState.aptitude = opt;
            if (opt.includes("10级")) {
                if (Math.random() < 0.45) {
                    playerState.isTwin = true;
                    playerState.wuhun += " + 昊天锤 (双生武魂)";
                    addLog(`🔥 【天选之子】素云涛大惊失色：“先天满魂力！慢着，你的左手……竟然是【双生武魂】！！”`, "legendary");
                } else {
                    addLog(`🔮 【资质测试】素云涛狂呼：“竟然是百年难遇的【先天满魂力】！天佑我武魂殿！”`);
                }
            } else if (opt.includes("8级")) {
                addLog(`🔮 【资质测试】测得先天魂力8级，属于极佳的天才资质，各大学院争相抛出橄榄枝。`);
            } else {
                addLog(`🔮 【资质测试】测得先天魂力较平庸，你暗暗发誓要通过努力打破血统偏见。`);
            }
            updateStatusUI();
        }
    },
    {
        title: "11-20级：获取第一二魂环",
        btnLabel: "猎杀首批魂环",
        getOptions: () => {
            const w = playerState.wuhun;
            if (w.includes("蓝银草")) return ["百年曼陀罗蛇环", "百年孤竹环", "千年鬼藤环(冒险吸纳)", "十年风狒狒环"];
            if (w.includes("昊天锤")) return ["百年千钧蚁环", "百年人面魔蛛环", "千年地穴魔蛛环(爆体风险)", "百年泰坦残环"];
            return ["百年狂暴狼环", "百年金刚虎环", "千年幽冥豹环(危险)", "十年孤狼环"];
        },
        onSelect: (opt) => {
            playerState.level = 20;
            playerState.rank = "大魂师";
            
            let isDanger = opt.includes("千年");
            let innatePower = playerState.aptitude;

            if (isDanger) {
                if (innatePower.includes("1级") || innatePower.includes("5级")) {
                    playerState.rings.push("黄", "黄"); 
                    addLog(`⚠️ 【魂环越阶反噬】你试图强行融合【${opt}】，因先天魂力不足导致经脉断裂！最终在濒死之际侥幸吸收了退化的两枚【黄色百年魂环】。`, "critical");
                } else {
                    playerState.rings.push("黄", "紫");
                    addLog(`⚡ 【越阶成功】凭着优秀的先天资质，你成功跨越极限，吸收了一黄一紫【${opt}】！`, "legendary");
                }
            } else if (opt.includes("十年")) {
                playerState.rings.push("白", "黄");
                addLog(`🌿 【稳健吸收】你选择保守路线，吸纳了一白一黄魂环，魂力顺利巩固到20级大魂师。`);
            } else {
                playerState.rings.push("黄", "黄");
                addLog(`🌿 【顺利吸收】你猎杀了合适的魂兽，成功吸收两枚百年【黄色魂环】，晋升20级大魂师。`);
            }
            updateStatusUI();
        }
    },
    {
        title: "21-30级：魂尊之路与大魂斗场",
        btnLabel: "挑战大魂斗场",
        getOptions: () => ["获得银斗魂徽章 (平稳晋升)", "连胜狂飙：金斗魂徽章", "遭遇重创：败给皇斗战队", "获得外附魂骨：八蛛矛(极罕见)"],
        onSelect: (opt) => {
            playerState.level = 30;
            playerState.rank = "魂尊";
            playerState.rings.push("紫");

            if (opt.includes("八蛛矛")) {
                playerState.boneCount += 1;
                addLog(`🦴 【神赐机缘】大魂斗场生死战中，你绝地反击爆出【外附魂骨·八蛛矛】！并吸收了第三枚【紫色千年魂环】！`, "legendary");
            } else if (opt.includes("重创")) {
                addLog(`💥 【大挫折】你在索托大魂斗场惨遭强敌重创，但在养伤中磨砺了意志，吸收千年【紫色魂环】晋升30级魂尊。`);
            } else {
                addLog(`⚔️ 【魂场扬名】你在斗魂场表现出色，斩获徽章，并成功猎杀魂兽吸收第三枚【紫色千年魂环】。`);
            }
            updateStatusUI();
        }
    },
    {
        title: "31-50级：高级魂师精英大赛",
        btnLabel: "报名精英大赛",
        getOptions: () => ["史莱克七怪主力 (加入史莱克)", "武魂殿战队核心 (加入武魂殿)", "天斗皇家主力 (加入天斗皇室)", "散修联盟黑马 (保持散修)"],
        onSelect: (opt) => {
            playerState.level = 50;
            playerState.rank = "魂王";
            playerState.faction = opt.split(" (")[0];
            
            if (playerState.isTwin) {
                playerState.rings.push("紫", "红");
                addLog(`🏆 【精英大赛】你代表【${playerState.faction}】出战，决赛中展现出【双生武魂】震惊全场，荣获冠军并斩获一紫一红【十万年红色魂环】！`, "legendary");
            } else {
                playerState.rings.push("紫", "黑");
                addLog(`🏆 【精英大赛】你作为【${playerState.faction}】的核心战力，在总决赛大放异彩，战后顺利吸收一紫一黑两枚魂环，突破至50级魂王！`);
            }
            updateStatusUI();
        }
    },
    {
        title: "51-70级：三大圣地历练",
        btnLabel: "选择历练之地",
        getOptions: () => ["前往：海神岛 (神之九考)", "前往：杀戮之都 (杀神领域)", "前往：星斗大森林 (极限猎杀)"],
        onSelect: (opt) => {
            playerState.level = 70;
            playerState.rank = "魂圣";
            
            if (opt.includes("海神岛")) {
                playerState.training = "海神岛";
                playerState.rings.push("黑", "红");
                addLog(`🌊 【海神考核】你远渡重洋来到海神岛，开启海神九考，获得神赐魂环，成功吸收一黑一红【十万年魂环】，觉醒武魂真身！`, "legendary");
            } else if (opt.includes("杀戮之都")) {
                playerState.training = "杀戮之都";
                playerState.rings.push("黑", "黑");
                addLog(`💀 【地狱修罗】你闯过地狱路，斩杀十首烈阳蛇，获得【杀神领域】，吸收两枚万年【黑色魂环】突破至70级！`);
            } else {
                playerState.training = "星斗深处";
                playerState.rings.push("黑", "黑");
                addLog(`🌲 【森林潜修】你在星斗大森林深处苦修，与十万年魂兽搏杀，吸收两枚万年【黑色魂环】，达到70级魂圣境界。`);
            }
            updateStatusUI();
        }
    },
    {
        title: "71-80级：宗门猎魂大战爆发",
        btnLabel: "迎击宗门浩劫",
        getOptions: () => ["奇袭敌后 (缴获十万年魂骨)", "死守宗门 (吸收宗门献祭魂环)", "中立避世 (错失机缘)"],
        onSelect: (opt) => {
            playerState.level = 80;
            playerState.rank = "魂斗罗";

            if (opt.includes("献祭") || playerState.training === "海神岛") {
                playerState.rings.push("红");
                addLog(`💥 【惨烈大战】大陆宗门浩劫爆发！你在血与火中涅槃，融合了誓死守护者的十万年【红色魂环】，晋升80级魂斗罗。`, "critical");
            } else if (opt.includes("魂骨")) {
                playerState.boneCount += 1;
                playerState.rings.push("黑");
                addLog(`💎 【战利品丰厚】你奇袭敌营斩杀强敌，缴获一枚【十万年魂骨】，并吸纳第八枚【黑色万年魂环】突破。`);
            } else {
                playerState.rings.push("黑");
                addLog(`⚖️ 【避世退隐】你未参与旷世大战，在暗中默默修炼，吸收了一枚【黑色万年魂环】，突破至80级。`);
            }
            updateStatusUI();
        }
    },
    {
        title: "81-90级：封号斗罗的九重天劫",
        btnLabel: "冲击封号之境",
        getOptions: () => ["获得封号：昊天/啸天", "获得封号：九彩/琉璃", "获得封号：天使/罗刹", "获得封号：毒/独孤", "自创封号：无双斗罗"],
        onSelect: (opt) => {
            playerState.level = 95;
            playerState.rank = "超级斗罗";
            
            if (playerState.isTwin || playerState.training === "海神岛") {
                playerState.rings.push("金");
                addLog(`👑 【封号斗罗】你成功跨入大陆金字塔尖，受封【${opt.split("：")[1] || "无双斗罗"}】！第九魂环竟蜕变为百万年【金色神级魂环】！`, "legendary");
            } else {
                playerState.rings.push("红");
                addLog(`👑 【封号斗罗】你引来天地异象，最终加冕【${opt.split("：")[1] || "无双斗罗"}】！吸纳了梦寐以求的第九枚【红色十万年魂环】。`);
            }
            updateStatusUI();
        }
    },
    {
        title: "91-100级：神祇继承与百级飞升",
        btnLabel: "踏上成神之路",
        getOptions: () => {
            const fac = playerState.faction;
            const train = playerState.training;

            if (fac.includes("史莱克") || train === "海神岛") {
                return ["飞升神界：海神 (神王)", "飞升神界：修罗神 (神王)", "神界神官：战神 (二级神)", "传承失败：陨落在神祇考核中"];
            }
            if (fac.includes("武魂殿")) {
                return ["飞升神界：天使之神 (一级神)", "飞升神界：罗刹之神 (一级神)", "叛出天门：自创情绪之神", "末代教皇：决战落败香消玉殒"];
            }
            return ["自创神位：无双至尊神王", "逍遥神祇：食神/九彩神女", "大荒散修：成就绝世斗罗 (未成神)", "神魂俱灭：被神劫天雷劈碎"];
        },
        onSelect: (opt) => {
            if (opt.includes("飞升") || opt.includes("自创") || opt.includes("神祇") || opt.includes("神官")) {
                playerState.level = 100;
                playerState.rank = "神界至尊";
                playerState.rings.push("金");
                addLog(`🏆 🌌 【传世神话 · 大结局】你最终突破百级桎梏，成功【${opt}】！神界的大门为你而开，凡尘间永久留存着属于你的不朽传说！`, "legendary");
            } else {
                playerState.level = 99;
                playerState.rank = "绝世斗罗(半神)";
                addLog(`🥀 🍂 【凡尘终点 · 大结局】在神祇的终极考核中，你【${opt}】。虽未成神，但你已是大陆实力最强的极限斗罗，寿元千载，令人敬仰。`, "critical");
            }
            updateStatusUI();

            spinBtn.style.display = 'none';
            restartBtn.style.display = 'inline-block';
        }
    }
];