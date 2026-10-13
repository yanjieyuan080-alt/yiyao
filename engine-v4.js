(function(g){"use strict";
const Z="子丑寅卯辰巳午未申酉戌亥".split(""), N=["初","二","三","四","五","上"];
const trigrams={乾:[1,1,1],兑:[1,1,0],离:[1,0,1],震:[1,0,0],巽:[0,1,1],坎:[0,1,0],艮:[0,0,1],坤:[0,0,0]};
const order=["乾","兑","离","震","巽","坎","艮","坤"];
const five={子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
const sheng={木:"火",火:"土",土:"金",金:"水",水:"木"},ke={木:"土",土:"水",水:"火",火:"金",金:"木"};
const clash={子:"午",丑:"未",寅:"申",卯:"酉",辰:"戌",巳:"亥",午:"子",未:"丑",申:"寅",酉:"卯",戌:"辰",亥:"巳"};
const join={子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午"};
const harm={子:"未",未:"子",丑:"午",午:"丑",寅:"巳",巳:"寅",卯:"辰",辰:"卯",申:"亥",亥:"申",酉:"戌",戌:"酉"};
const advance={"寅":"卯","巳":"午","申":"酉","亥":"子","丑":"辰","辰":"未","未":"戌","戌":"丑"};
const graves={木:"未",火:"戌",土:"辰",金:"丑",水:"辰"};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let corpus=null, maps=null;
function fromBits(bits){let low=order.find(k=>trigrams[k].every((v,i)=>v===bits[i]));let high=order.find(k=>trigrams[k].every((v,i)=>v===bits[i+3]));return [high,low]}
async function load(){if(corpus)return corpus;const response=await fetch("./data/classics.json?v=4.0.0",{cache:"no-store"});if(!response.ok)throw Error("卦辞数据库未加载（HTTP "+response.status+"）");const j=await response.json();if(Object.keys(j.hexagrams||{}).length!==64||Object.values(j.hexagrams).some(x=>!Array.isArray(x.lines)||x.lines.length!==6||!x.judgment))throw Error("64卦或384条爻辞校验失败");corpus=j.hexagrams;maps=new Map(Object.entries(corpus).map(([id,x])=>[x.name,{id,...x}]));if(maps.size!==64)throw Error("出现重复卦名");return corpus}
function verify(c){
if(!corpus)throw Error("经典数据库尚未加载");
const bits=c.bits, changed=c.changed;
if(!bits||bits.length!==6||!changed||changed.length!==6)throw Error("六爻长度错误");
const key=parts=>parts.map(k=>order.indexOf(k)+1).join(",");
const origin=corpus[key(fromBits(bits))],dest=corpus[key(fromBits(changed))];
if(!origin||!dest||origin.name!==c.a.name||dest.name!==c.b.name)throw Error("本卦/变卦与独立64卦表冲突");
const t=c.totals;if(t.length!==6||t.some((n,i)=>n<6||n>9||(n%2)!==bits[i]||changed[i]!==([6,9].includes(n)?1-bits[i]:bits[i])))throw Error("钱面、动爻、阴阳或变卦校验失败");
if(c.throwing.length!==6||c.throwing.some((row,i)=>row.length!==3||row.some(n=>n!==2&&n!==3)||row.reduce((a,b)=>a+b,0)!==t[i]))throw Error("三钱六摇原始记录与和数不符");
if(!c.rows||c.rows.length!==6||c.rows.some((r,i)=>r.i!==i))throw Error("装卦爻序不一致");
const palace=c.a.palace;
if(!palace||!c.a.home||!c.a.shi||!c.a.ying||c.a.shi===c.a.ying)throw Error("本宫与世应信息异常");
const kin=(a,b)=>a===b?"兄弟":sheng[a]===b?"子孙":sheng[b]===a?"父母":ke[a]===b?"妻财":"官鬼";
const dayGan=c.t.day[0],beg={甲:0,乙:0,丙:1,丁:1,戊:2,己:3,庚:4,辛:4,壬:5,癸:5}[dayGan],beasts=["青龙","朱雀","勾陈","螣蛇","白虎","玄武"];
for(let i=0;i<6;i++){const r=c.rows[i];if(r.r!==kin(c.a.home,five[r.gz[1]])||r.vr!==kin(c.a.home,five[r.vgz[1]]))throw Error(N[i]+"爻六亲校验失败");if(r.animal!==beasts[(beg+i)%6])throw Error(N[i]+"爻六兽校验失败");if(r.empty!==c.empty.includes(r.gz[1]))throw Error(N[i]+"爻旬空标记失败");}
return {origin,dest};
}
function getRelation(a,b){if(a===b)return "临";if(clash[a]===b)return "冲";if(join[a]===b)return "合";if(harm[a]===b)return "害";if(sheng[five[a]]===five[b])return "生";if(ke[five[a]]===five[b])return "克";if(sheng[five[b]]===five[a])return "泄";if(ke[five[b]]===five[a])return "耗";return "同气"}
function fields(q){
const raw=String(q||"").trim();if(!raw)return {ok:false,error:"请先输入一个具体问题"};
const clean=raw.replace(/\s+/g,"");
const base=g.YiYaoEngineV3.identify(raw);
if(/合作机会|商业合作|合作方/.test(raw)){base.ok=true;base.field="cooperation";base.fieldName="合作与竞争";}
if(!base.ok)return base;
const opportunity=/(还会|会不会|是否|有没有|能不能|能否|将会|未来|接下来|接着|之后|近期|最近|有机会|出现|迎来|获得|分配|安排|来|进)/.test(clean)&&/(新的?|其他|更多|下一[个份次]?)/.test(clean)&&/(项目|工作|机会|合作|客户|业务|订单|岗位|职位|面试|房源|感情|对象|收入|财源)/.test(clean)&&!/(该不该接|要不要接|接了|接手后|如果我接|拒绝|不接)/.test(clean);
const accept=/(该不该接|要不要接|是否接受|接不接|如果.*接(了|手|下)?|接了(这个|它)?|接手(这个|后)?|值得接)/.test(clean)&&!opportunity;
const compare=/(哪个更|哪一个更|比较|对比|哪个值得|A项目.*B项目|还是.*更好)/i.test(clean);
const timing=/(什么时候|多久|何时|几天|几月|几号|多长时间)/.test(clean);
const impact=/(对我|个人|我自己).*(影响|变化|收益|压力|损失|后果)|影响.*(我|自己)/.test(clean);
const risk=/(风险|隐患|阻碍|危险|损失|代价|问题是什么)/.test(clean);
const outcome=/(能否|是否|会不会|能不能|会有|成果|结果|成功|达成|通过|签成|回款)/.test(clean);
const trend=/(未来|接下来|后续|发展|变化|走向|趋势)/.test(clean);
let primary=compare?"comparison":opportunity?"new_opportunity":accept?"accept_decision":timing?"timing":impact?"personal_impact":risk?"risk":trend?"trend":outcome?"outcome":"outcome";
const intents=[primary];
for(const [name,value] of [["new_opportunity",opportunity],["accept_decision",accept],["outcome",outcome],["trend",trend],["timing",timing],["personal_impact",impact],["risk",risk],["comparison",compare]])if(value&&!intents.includes(name))intents.push(name);
if(primary==="new_opportunity"){const bad=intents.indexOf("accept_decision");if(bad>=0)intents.splice(bad,1);}
return {...base,question:raw,intent:primary,intents,object:{domain:base.field,subtype:opportunity?"future_new_allocation":accept?"existing_offer_choice":trend?"ongoing_development":"specific_question",primary_intent:primary,intents,time_window:base.window,original_question:raw}};
}
function interpret(c){
const v=verify(c),intent=fields(c.question);if(!intent.ok)throw Error(intent.error);
const moved=c.rows.filter((r,i)=>[6,9].includes(c.totals[i])),self=c.rows[c.a.shi-1],other=c.rows[c.a.ying-1];
const relevant={
career:["官鬼","父母","妻财"],exam:["父母","官鬼"],legal:["官鬼","父母"],finance:["妻财","子孙","兄弟"],relationship:["妻财","官鬼"],property:["父母","妻财"],cooperation:["兄弟","妻财"],children:["子孙","父母"],health:["官鬼","子孙"],general:["官鬼","妻财","父母"]}[intent.field]||["官鬼","妻财"];
const selected=c.rows.filter(r=>relevant.includes(r.r));
const facts=[];
const record=(title,evidence,rule,meaning)=>facts.push({title,evidence,rule,meaning});
record("自己的处境",self.gz+self.r+"持世，月建"+c.month+"对其"+getRelation(c.month,self.gz[1])+"，日辰"+c.day+"对其"+getRelation(c.day,self.gz[1]),"世爻与日月共同考量；冲合不机械视作吉凶","此事对你本人是否有利，不能只用项目整体是否有利替代。");
record("对方及环境",other.gz+other.r+"临应，五行方向："+(function(){const aa=five[self.gz[1]],bb=five[other.gz[1]];return aa===bb?"同气":sheng[aa]===bb?"世生应":sheng[bb]===aa?"应生世":ke[aa]===bb?"世克应":"应克世";})(),"应爻须结合动静、旺衰及生克","对方真实态度、支持是否兑现，不能从单一生世关系确认。");
record("所问关键爻",selected.map(r=>N[r.i]+"爻"+r.gz+r.r+(r.empty?"（旬空）":"")).join("；")||"显性用神不现","根据领域兼看多个六亲；伏神未见须另行确认","取用是分析线索，不能把“相关六亲”都当同一主用神。");
moved.forEach(r=>{const o=five[r.gz[1]],n=five[r.vgz[1]];const back=sheng[n]===o?"回头生":ke[n]===o?"回头克":sheng[o]===n?"动生变":ke[o]===n?"动克变":"比和";const progress=advance[r.gz[1]]===r.vgz[1]?"进神":advance[r.vgz[1]]===r.gz[1]?"退神":"不构成进退神";record(N[r.i]+"爻动变",r.gz+r.r+" → "+r.vgz+r.vr+"；"+back+"；"+progress+"；"+(r.empty?"本爻旬空；":"")+(c.empty.includes(r.vgz[1])?"变爻旬空；":""), "回头生克取变爻五行作用于本动爻；进退神使用四长生与土支序列规则","变化的推动与反馈需与世、应、用神结合，不可将爻辞视作发生过的现实事件。");});
if(moved.length>1)record("多爻联动",moved.map(r=>N[r.i]+r.gz).join("、"),"多动爻并看，空亡动爻和非空动爻不能简单同权累加","这张卦有多处同时变化，不能给每条爻分配一个月份。");
const lineTexts=moved.map(r=>({position:r.i+1,text:v.origin.lines[r.i]}));
const directional=(a,b)=>{const ael=five[a.slice(-1)],bel=five[b.slice(-1)];if(ael===bel)return a+"与"+b+"同五行";if(sheng[ael]===bel)return a+"生"+b+"（"+a+"向"+b+"泄气；"+b+"受生）";if(sheng[bel]===ael)return b+"生"+a+"（"+a+"受"+b+"生扶）";if(ke[ael]===bel)return a+"克"+b+"（"+b+"受制）";if(ke[bel]===ael)return b+"克"+a+"（"+a+"受制）";return "无直接关系";};
record("世爻与日辰的明确方向",directional(self.gz,c.day),"明确标示生克的施受方向，不以“耗”等模糊字样代替","这说明哪一方付出、哪一方受制，但不能直接推导具体事件。");
record("世爻与应爻的明确方向",directional(self.gz,other.gz),"世应五行须标记主动与被动","不将世克应误称为应克世。");
const domain=intent.field,goal=intent.intent;
const summary={
career:"本卦所示的工作变化应重点观察职责、权力及成果归属是否同步变化，不能由官鬼持世直接认定升职或离职。",
finance:"涉及钱的结果必须区分财源、成本与实际兑现；当前卦盘不支持推断具体金额或到账日期。",
relationship:"感情发展须结合彼此实际互动，卦盘不能确认对方心理或保证复合、结婚。",
property:"房屋或合同问题要分开核对标的、资金、手续和对方履约，不能仅凭父母爻判断签成。",
cooperation:"合作能否持续需检验责任、利益和双方执行条件；卦象不能确定谁有恶意。",
exam:"可参考父母文书与官鬼名位及世爻，但无法代替考试成绩、录取规则。",
health:"只可用于传统文化解释，不能据此诊断疾病、推断康复或替代医疗检查。",
children:"应区分子女事务与休闲创造等具体语境；不能由子孙爻推断医疗或生育结果。",
legal:"传统象义不能代替证据、诉讼程序或法律专业建议。",
general:"占问范围偏宽，不能将卦内变化任意对应到工作或关系的具体事件。"
}[domain]||"应结合真实问题核对用神及世应";
let answer=summary;
if(goal==="new_opportunity"){
const job=(domain==="career"||domain==="cooperation"), still=moved.length===0;
const related=c.rows.filter(r=>job?["官鬼","父母"].includes(r.r):domain==="finance"?r.r==="妻财":domain==="relationship"?["官鬼","妻财"].includes(r.r):domain==="property"?r.r==="父母":r.r===selected[0]?.r);
const activeRelated=related.filter(r=>moved.some(m=>m.i===r.i));
const unfilled=related.filter(r=>c.empty.includes(r.gz[1]));
const topic=domain==="career"?"新的工作或项目":domain==="cooperation"?"新的合作机会":domain==="finance"?"新的财务机会":domain==="relationship"?"新的关系机会":domain==="property"?"新的房产或合同机会":"新的相关机会";
answer="你问的是接下来是否还会出现"+topic+"，并非该不该接受已出现的项目。"+(still?"此卦六爻安静，暂时没有直接的动爻触发信号；这只能表示当前卦内变化不显著，不能因此断定未来绝无新增机会。":activeRelated.length?"相关六亲中有"+activeRelated.map(r=>["初","二","三","四","五","上"][r.i]+"爻"+r.gz+r.r).join("、")+"发动，可视为新增机会相关的传统变化线索，但不保证机会实际发生。":"虽有动爻，但相关用神没有直接发动，现有信号不足以确定新增机会是否会落实。")+(unfilled.length?"相关爻中有旬空，需要留意条件是否尚未落实。":"")+(intent.intents.includes("timing")?"尚无充分应期依据，不能推断具体到来的日子。":"")+"现实中可以观察实际分配通知、用人需求或新机会的沟通。";
}
if(goal==="timing")answer="你问的是发生时间。此卦虽有"+moved.length+"处动爻，但目前不能通过已经验证的应期规则推出具体日期；以下只能展示潜在影响因素。"+summary;
if(goal==="compare")answer="你要求比较多个对象。当前没有各对象预设对应爻位及独立数据，不能凭一卦给出对象排序。";
if(goal==="refuse")answer="你问的是不接受之后的后果，不应直接反转“接受有利”的判断。"+summary;
if(goal==="accept")answer="你问的是承接之后的成果和个人影响，需要分开核对结果、本人责任与财爻兑现。"+summary;
if(goal==="trend")answer="你问的是未来发展方向而不是要不要开始。"+summary;
if(goal==="result"&&domain==="relationship")answer="你问的是关系能否达成目标；卦象不能给出对方决定的可靠保证。"+summary;
if(goal==="result"&&domain==="finance")answer="你问的是财务结果而不只是机会。"+summary;
const titleLines=lineTexts.map(x=>"<p><strong>"+N[x.position-1]+"爻：</strong>"+esc(x.text)+"</p>").join("");
const evidence=facts.map(x=>"<p><b>"+esc(x.title)+"</b><br>卦盘事实："+esc(x.evidence)+"<br>依据："+esc(x.rule)+"<br>解释："+esc(x.meaning)+"</p>").join("");
const risks={career:"核实职责是否增加、授权是否同步、交付成果能否归属于自己。",finance:"核实资金、损失上限、回款义务和支付凭证。",relationship:"实际沟通、边界与双方投入比卦象更能反映关系。",property:"检查产权、合同、付款与交付安排。",cooperation:"确认分工、利益分配及退出规则。",exam:"以成绩要求、资格审核和考试日期为准。",health:"如有症状，及时接受专业医疗评估。",legal:"保存证据并就时限与权利咨询法律专业人士。",children:"依据现实家庭、生活与照护安排作决定。",general:"先确定真正关心的具体生活领域。"}[domain]||"核对现实证据。";
const html='<div class="focus-report" data-engine="4"><div class="section-title">所问问题与意图</div><p>'+esc(intent.question)+'｜'+esc(intent.fieldName)+'｜'+esc(intent.intents.join("、"))+'｜'+esc(intent.window)+'</p><div class="section-title">核心回答</div><p>'+esc(answer)+'</p><div class="section-title">独立卦象核验与卦辞</div><p>'+esc(v.origin.name)+' → '+esc(v.dest.name)+'；动爻 '+(moved.map(r=>N[r.i]).join("、")||"无")+'。卦辞：'+esc(v.origin.judgment)+'</p><div class="section-title">可追溯的装卦推理链</div>'+evidence+'<div class="section-title">动爻原文与传统象义</div>'+ (titleLines||'<p>无动爻。</p>')+'<p>爻辞与纳甲的吉凶生克采用两套解释层，不将象义直接当作纳甲计分。当前无经校验的统一现代爻辞解释，不伪称已完成逐爻释义。</p>' +((goal==="timing"||goal==="trend")?'<div class="section-title">发展及时间依据</div><p>没有得到经过独立验证的应期证据，不能推断某个月或某天一定发生什么。</p>':"")+'<div class="section-title">风险与现实条件</div><p>'+esc(risks)+'</p><div class="section-title">最终结论</div><p><strong>'+esc(answer)+'</strong></p><p class="sub">易爻仅提供传统纳甲文化辅助分析。当前尚未完成独立验证的完整墓绝、伏神飞神、多动连锁旺衰权重及传统应期断法；这些缺口会限制具体吉凶判断。健康、法律与重大财务决策依赖专业事实与意见。</p></div>';
return {html,intent,answer,facts,lineTexts,verified:v.origin.name+"→"+v.dest.name};
}
g.YiYaoEngineV4={load,verify,interpret,fromBits,getRelation,version:"4.1.1-intent-fix",identify:fields};
})(window);