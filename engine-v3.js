/* 易爻规则解读引擎 V3-preview: deterministic facts, no AI calls, no fabricated events */
(function(g){
"use strict";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const topics=[
['health',/身体|健康|生病|症状|疾病|手术|肿瘤|怀孕|胎儿|流产|寿命/],
['legal',/诉讼|官司|起诉|法院|仲裁|纠纷|法律/],
['exam',/考试|面试|录取|考证|资格证|考研|考公|通过考试/],
['property',/买房|租房|装修|搬家|房子|房屋|房产|签合同|合同|协议|证件|审批/],
['finance',/收入|工资|回款|货款|赚钱|资金|投资|利润|分红|债务|还款|财运|薪酬|到账/],
['relationship',/恋爱|复合|感情|婚姻|结婚|分手|前任|伴侣|对象|男朋友|女朋友/],
['cooperation',/朋友|合作伙伴|合伙|竞争|团队协作|同事关系|利益分配|信任/],
['children',/子女|孩子|亲子|兴趣|休养|休闲|创作|娱乐/],
['career',/工作|事业|职业|岗位|上班|升职|跳槽|离职|项目|门店|领导|团队|发展|成果|考试/]];
const names={career:"事业与项目",finance:"收入与财务",relationship:"感情关系",property:"房屋与文书",cooperation:"合作与竞争",children:"子女与生活",health:"健康（民俗）",legal:"诉讼与纠纷",exam:"考试与录取"};
const uses={career:["官鬼","父母","妻财"],finance:["妻财","子孙","兄弟"],relationship:["应爻","妻财","官鬼"],property:["父母","妻财","官鬼"],cooperation:["世应","兄弟","妻财"],children:["子孙","父母"],health:["世爻","官鬼","子孙"],legal:["官鬼","父母","世应"],exam:["父母","官鬼","世爻"]};
const intentions=[
["compare",/哪个更|哪一个|比较|对比|A项目.*B项目|两个.*哪个|还是.*更好/],
["refuse",/不接|拒绝|放弃|推掉|不做|退出|不去|不签/],
["accept",/如果.*接|接了|接手|接这个|要不要接|承接|接受|接下|该不该接/],
["leave",/离职|辞职|跳槽|换工作|留任/],
["timing",/什么时候|何时|几号|多久|多长时间|什么时候能|多久能/],
["trend",/发展|走向|趋势|未来|接下来|后续|三个月|半年|一年|会怎样变化/],
["impact",/对我有什么影响|对我|影响|后果|代价|收获/],
["result",/能否|会不会|可以吗|是否|结果|有没有机会|能不能|顺利|成功|通过|适不适合|值得信任/],
["why",/为什么|原因|哪里出了问题|为何/],
["improve",/怎么做|如何改善|怎么解决|怎么办/]];
function identify(question){
const q=String(question||"").trim();
if(!q)return {ok:false,error:"请先写出一个具体的问题。"};
let field=/(整体发展|整体趋势|整体运势)/.test(q)&&!/工作|职业|事业|岗位|项目/.test(q)?"general":topics.find(([k,re])=>re.test(q))?.[0];
if(!field){
if(/整体|运势|近况|人生|个人/.test(q))field="general";
else return {ok:false,error:"暂时无法确认所问领域。请补充具体对象，例如“当前这份工作未来三个月的发展”或“某笔货款何时到账”。"};
}
const found=intentions.filter(([k,re])=>re.test(q)).map(x=>x[0]);
const primary=found.find(x=>x!=="impact")||"result";
const t=q.match(/(?:未来|接下来|今后|后续|近)(?:的)?(\d+|一|两|三|六|十|半)(个)?(天|周|月|年)/);
return {ok:true,field,fieldName:names[field]||"整体事务",intent:primary,intents:[...new Set(found.length?found:[primary])],window:t?t[0]:"未明确时间范围",question:q};
}
const sheng={木:"火",火:"土",土:"金",金:"水",水:"木"};
const ke={木:"土",土:"水",水:"火",火:"金",金:"木"};
const z={子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
const opposite={子:"午",丑:"未",寅:"申",卯:"酉",辰:"戌",巳:"亥",午:"子",未:"丑",申:"寅",酉:"卯",戌:"辰",亥:"巳"};
const combine={子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午"};
function interaction(a,b){
if(a===b)return "临";
if(opposite[a]===b)return "冲";
if(combine[a]===b)return "合";
if(sheng[z[a]]===z[b])return "生";
if(ke[z[a]]===z[b])return "克";
if(sheng[z[b]]===z[a])return "泄";
if(ke[z[b]]===z[a])return "耗";
return "比和";
}
function motion(r,empty){
const old=z[r.gz[1]],later=z[r.vgz[1]],label=sheng[later]===old?"回头生":ke[later]===old?"回头克":sheng[old]===later?"动爻生变爻":ke[old]===later?"动爻克变爻":"比和";
return {label,emptyChange:empty.includes(r.vgz[1])};
}
function analyze(c){
const {question,t,throwing,totals,bits,moves,changed,a,b,rows,empty,k,world,respond,month,day}=c;
const i=identify(question);if(!i.ok)return {ok:false,error:i.error};
if(!Array.isArray(totals)||totals.length!==6||!totals.every(n=>[6,7,8,9].includes(n)))return {ok:false,error:"摇卦和数不合法，停止解卦。"};
if(!totals.every((n,j)=>n%2===bits[j] && ((n===6||n===9)===moves[j]) && changed[j]===(moves[j]?1-bits[j]:bits[j])))return {ok:false,error:"阴阳、动爻与变卦不一致，停止解卦。"};
if(!rows||rows.length!==6||rows.some((r,j)=>r.i!==j||!r.gz||!r.vgz))return {ok:false,error:"纳甲盘缺失或爻序错误，停止解卦。"};
if(!a||!b||!a.name||!b.name||!a.palace||!Array.isArray(empty)||empty.length!==2||a.shi===a.ying)return {ok:false,error:"八宫、旬空、世应信息不完整，停止解卦。"};
if(!a.name||!b.name)return {ok:false,error:"卦名无法校验，停止解卦。"};
const active=rows.filter(r=>moves[r.i]),self=rows[a.shi-1],other=rows[a.ying-1],usable=rows.filter(r=>(uses[i.field]||[]).includes(r.r));
const primary=usable.find(r=>r.i===a.shi-1)||usable.find(r=>moves[r.i])||usable[0];
const elementRelation=interaction(other.gz[1],self.gz[1]);
const confidence=(!primary?"low":active.length>=4?"limited":"qualified");
const findings=[];
const put=(type,fact,rule,meaning)=>findings.push({type,fact,rule,meaning});
put("structure",a.name+" → "+b.name+"；动爻"+(active.map(r=>["初","二","三","四","五","上"][r.i]).join("、")||"无"),"老阴变阳、老阳变阴；动爻优先观察","本卦与变卦描述传统象义的起点和变化方向；钱面不代表独立吉凶分值。");
put("world",["初","二","三","四","五","上"][self.i]+"爻 "+self.gz+self.r+"持世；月建"+month+" "+interaction(month,self.gz[1])+"、日辰"+day+" "+interaction(day,self.gz[1]),"世爻代表本人；日月与世爻共同观察","你本人的责任、行动空间与目前环境需要同时分析，单个“生”或“克”不能判定成败。");
put("response",other.gz+other.r+"为应，与世爻地支关系："+elementRelation,"应爻代表另一方或外部情境","这反映传统卦内关系，不证明对方的实际心理或承诺。");
put("use",primary?primary.gz+primary.r+"；月建"+interaction(month,primary.gz[1])+"，日辰"+interaction(day,primary.gz[1])+(empty.includes(primary.gz[1])?"，旬空":""):"显性用神不现","根据问题类型取主用并兼看世应与相关六亲",primary?"关键用神的月日关系需与动变一起看，不能机械加分。":"未完成伏神飞神的校验，此项不足以给出可靠方向。");
active.forEach(r=>{const m=motion(r,empty);put("moving",["初","二","三","四","五","上"][r.i]+"爻 "+r.gz+r.r+" → "+r.vgz+r.vr+(empty.includes(r.gz[1])?"（本爻空）":"")+(m.emptyChange?"（变爻空）":""),"动爻变化："+m.label,m.emptyChange?"变化后相关条件可能尚未落实，但不能直接断为必然落空。":m.label==="回头克"?"变化反馈在传统规则中有反向制约的含义。":"需同时观察它与世、应、用神的生克关系。");});
if(active.length>1)put("multi",active.map(r=>r.r+"（"+r.gz+"）").join("、"),"多爻不独立计分；须辨同类合力、空亡及连环生克","多个变化共同出现，现阶段不能按数量推算吉凶或把三爻自动对应三个月。");
const categories={
career:{trend:"这份工作可能进入职责、项目安排或协作方式变化的阶段；需要观察变化最终是扩大你的实际影响力，还是只增加执行负担。",result:"工作成果的象义要同时看官鬼职责、父母文书及财爻回报，不能只用官鬼旺弱认定成果。",risk:"职责增加但授权、执行人手与考核口径不匹配。",action:"跟踪岗位职责变化、实际授权、交付成果和反馈机制。"},
finance:{trend:"财务变化要区分出现收入机会、钱是否落实，以及成本与兑现条件；不能把财爻出现等同于已经到账。",result:"尚不足以断定具体收益数字和到账时间；需核对财爻是否发动、旬空以及阻滞。",risk:"回款条件未满足、成本遗漏或承担超过预算的损失。",action:"对照合同核实付款节点、已到账金额、欠款账期与风险上限。"},
relationship:{trend:"关系变化要同时看世应状态与双方实际互动，不能根据一处冲合断定分合。",result:"卦盘不能证明对方心意，也不能断言必然复合或分手。",risk:"单方面付出、沟通不清、把象义误认为对方的真实行为。",action:"观察是否存在持续的沟通、双方实际投入和明确的关系期待。"},
property:{trend:"房屋本身、文书手续、交易资金和交付进度应当分别判断。",result:"合同或交易结果尚不能从父母爻单独确定。",risk:"付款、产权、验收及违约条款不清楚。",action:"核实权属、合同关键条款、付款安排和履约保障。"},
cooperation:{trend:"合作既涉及人员相处，也涉及利益分配和实际执行，不宜把兄弟爻直接看成破财。",result:"世应关系只提供象义线索，不能判断对方是否诚信。",risk:"双方责任不清或成果归属不明。",action:"明确分工、资源投入、分红规则与退出条件。"},
children:{trend:"子孙爻可用于子女、兴趣与休养类象义，但必须依具体所问解释。",result:"不能凭子孙爻推断生育、胎儿或医学结果。",risk:"现实安排与精力不足。",action:"结合实际生活资源和参与者需要调整安排。"},
health:{trend:"可作传统民俗文化象义理解，不能据此判断病情发展。",result:"不能根据卦象诊断疾病、判断检查结果或预测康复。",risk:"因占卜结果延误及时医疗评估。",action:"如有真实症状或检查疑问，应依据专业医疗建议处理。"},
legal:{trend:"传统象义可观察冲突或文书，但不能代替案件证据与程序分析。",result:"不能由卦象判断法院裁决或具体胜诉概率。",risk:"错过期限、证据不足或未理解合同义务。",action:"保留证据，核对期限，并咨询合格法律专业人士。"},
exam:{trend:"考试类同时参考父母文书、官鬼名位与世爻自身状态。",result:"卦象不能断言一定录取或通过。",risk:"忽略客观考试成绩和资格要求。",action:"核实考试安排、分数标准、材料与备考状态。"},
general:{trend:"问题范围过大，卦内存在的变化不能无依据归到具体生活事件。",result:"需要明确最关心的事业、感情或生活领域才适合细断。",risk:"用模糊问题得出过于具体的断言。",action:"将问题收束到一个具体事件及时间范围。"}
};
const ctext=categories[i.field]||categories.general;
let answer=ctext.trend;
if(i.intent==="timing")answer=ctext.result+" 当前规则不足以从此卦推算出可靠的具体日期，不能将爻位当月份。";
if(i.intent==="accept")answer="你询问的是接手后的结果，而非是否申请新岗位。"+ctext.result+" 接手后的责任、资源与个人回报应分别考虑。";
if(i.intent==="refuse")answer="你问的是不做的后果，不能把“适合做”反推成“不做就会倒霉”。"+ctext.result;
if(i.intent==="compare")answer="问题涉及多个备选对象，但尚未提供确定的各对象对应爻位规则，因此不能根据本卦给出A与B的可靠排序。";
if(i.intent==="leave")answer="你问的是去留选择，不能直接套用新工作是否值得尝试的模板。"+ctext.trend;
if(i.intent==="result")answer=ctext.result;
if(/适不适合|该不该|值得不值得/.test(question)&&i.intent==="result")answer="你问的是是否值得做，不是简单的成败问题。"+ctext.risk+" "+ctext.action;
if(/信任|靠谱吗|可靠吗/.test(question))answer="传统卦盘不能核实一个人的诚实程度或主观意图。"+ctext.risk+" "+ctext.action;
if(i.intent==="impact")answer=ctext.trend+" "+ctext.result;
if(i.intent==="why")answer="需要先看用神与世应的受制位置。"+ctext.trend;
if(i.intent==="improve")answer=ctext.action;
if(i.intents.includes("impact")&&i.intent!=="impact")answer+=" 对你自身的影响还需单独核查责任、资源及回报，不能只谈项目能否成事。";
if(i.field==="health")answer=ctext.result;
const limits=["纳甲主要规则采用页面当前八宫表；未完成独立六十四卦金标准交叉核验。","伏神飞神、墓绝、刑害、进退神及多动连锁作用尚未全部经过标准例题验证。","不把卦辞爻辞与纳甲规则混成同一种生克算法；当前不提供未经完整校验的384条爻辞。"];
function para(x){return "<p>"+esc(x)+"</p>";}
const html='<div class="focus-report" data-yiyan-engine="v3"><div class="section-title">01 · 所问与判断范围</div>'+
para("问题："+question+"；领域："+i.fieldName+"；意图："+i.intents.join("、")+"；时间："+i.window+"。取用线索："+(uses[i.field]||["世应"]).join("、")+"。")+
'<div class="section-title">02 · 卦象总览与摇卦核验</div>'+para("本卦 "+a.name+"，变卦 "+b.name+"。六次和数（初至上）："+totals.join("、")+"；动爻："+(active.map(r=>r.i+1).join("、")||"无")+"。这些和数决定卦象，不是吉凶分数。")+
'<div class="section-title">03 · 核心判断：直接回应你的问题</div>'+para(answer)+
'<div class="section-title">04 · 推演依据：事实 → 规则 → 解释</div>'+
findings.map(x=>"<p><strong>"+esc(x.fact)+"</strong><br>规则："+esc(x.rule)+"<br>解释："+esc(x.meaning)+"</p>").join("")+
'<div class="section-title">05 · 多动爻整体关系</div>'+
para(active.length>1?"本次共 "+active.length+" 个动爻，需要同时观察变爻与世、应、用神之间的关系。"+(active.filter(r=>empty.includes(r.gz[1])).length?"其中有动爻逢空，变化的兑现与时机更需审慎判断。":"不能因动爻多就认定有大事。")+" 当前缺少完整多动连锁规则，暂不据此断言必成或必败。":"本次 "+active.length+" 个动爻；以已核验的实际动变关系作为分析依据。")+
((i.intent==="trend"||i.intent==="timing")?'<div class="section-title">06 · 发展与时间线索</div>'+para(i.window+"：可以根据工作/事项进展观察实际变化，但当前没有足够的传统应期证据推导具体日期，更不能把每条动爻机械映射成每个月。"):"")+
'<div class="section-title">07 · 风险与现实验证</div>'+para(ctext.risk+" 建议："+ctext.action)+
'<div class="section-title">08 · 综合回答</div>'+para(answer+" "+(confidence==="low"?"关键用神信息不足，暂时不能给出可靠的卦内方向。":"以上只说明传统规则下值得观察的方向，不能保证真实结果。"))+
'<p class="sub">易爻为传统民俗文化体验，不是可靠的现实预测。'+esc(limits.join(" "))+'</p></div>';
return {ok:true,intent:i,findings,html,answer,limits,confidence};
}
g.YiYaoEngineV3={identify,analyze,interaction,motion,version:"v3-preview"};
})(window);