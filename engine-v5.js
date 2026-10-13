/* 易爻 V5：可审计的有限规则判断 + 白话解读，民俗文化用途。
   方向词仅描述本程序实际核验的传统规则信号，绝非预测概率。 */
(function(g){"use strict";
const old=g.YiYaoEngineV42, core=g.YiYaoEngineV4;
if(!old||!core)throw Error("先加载易爻 V4.2.3");
const BRANCH={子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
const GENERATES={木:"火",火:"土",土:"金",金:"水",水:"木"};
const CONTROLS={木:"土",土:"水",水:"火",火:"金",金:"木"};
const OPPOSITE={子:"午",丑:"未",寅:"申",卯:"酉",辰:"戌",巳:"亥",午:"子",未:"丑",申:"寅",酉:"卯",戌:"辰",亥:"巳"};
const POS=["初","二","三","四","五","上"];
const ESC=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const paragraph=s=>"<p>"+ESC(s)+"</p>";
const DOMAIN={
 career:{label:"工作",primary:"官鬼",secondary:["父母"],event:"工作发展",action:"看看岗位职责、可用资源和上级对成果的评价是否真正发生变化"},
 finance:{label:"钱",primary:"妻财",secondary:["子孙"],event:"收入或款项",action:"核对实际入账、付款条件和成本，不能把预期收入当到账"},
 relationship:{label:"关系",primary:"世应",secondary:["官鬼","妻财"],event:"这段关系",action:"看双方是否有明确沟通和实际行动，不凭卦象揣测对方心思"},
 property:{label:"房屋和合同",primary:"父母",secondary:["妻财"],event:"合同或房屋事务",action:"核对权属、条款、付款、审批和交付节点"},
 cooperation:{label:"合作",primary:"世应",secondary:["兄弟","父母"],event:"合作进展",action:"确认分工、合作方的实际投入，以及责任和收益怎么分"},
 children:{label:"生活和子女",primary:"子孙",secondary:["父母"],event:"所问的生活事项",action:"以实际生活安排、当事人需要和资源状况作判断"},
 exam:{label:"考试",primary:"父母",secondary:["官鬼"],event:"考试或录取",action:"核对考试成绩、资格、录取安排和官方通知"},
 legal:{label:"法律",primary:"官鬼",secondary:["父母"],event:"纠纷处理",action:"核对证据、程序和时效；重大事项咨询专业法律人士"},
 health:{label:"健康",primary:null,secondary:[],event:"健康状况",action:"身体症状和检查结果请交由专业医疗人员判断，占卜不能用于诊断"},
 general:{label:"事情",primary:null,secondary:[],event:"所问事项",action:"把问题明确成一件可以观察结果的具体事情"}
};
function question(q,requestedDomain){
 const text=String(q||"").trim();
 const base=core.identify(text);
 if(!text)return {ok:false,error:"请先输入一个问题。"};
 const cleaned=text.replace(/\s+/g,"");
 const promotion=/(升职|晋升|提拔|升迁|升一级|职级提升|升为|升到)/.test(cleaned);
 const demotion=/(降职|降级|被贬|下调职级|被撤职|免职)/.test(cleaned);
 const official=/(正式任命|职位任命|职务任命|被任命为|得到任命)/.test(cleaned);
 const breakup=/(分手|离婚|断联|彻底分开)/.test(cleaned);
 const hiringPartTimer=/(招聘兼职|招兼职|兼职员工|兼职人员|兼职店员|兼职人手|找兼职人员)/.test(cleaned);
 const sideJob=/(兼职|副业|私活|接单|外包活|临时项目|临时工作)/.test(cleaned)&&!hiringPartTimer;
 const eventSubtype=promotion?"promotion":demotion?"demotion":official?"appointment":breakup?"breakup":sideJob?"side_job":hiringPartTimer?"part_time_hire":base.object?.subtype||"general";
 const recognize=[
  ["health",/健康|身体|症状|生病|疾病|病情|手术|康复|怀孕|胎儿/],
  ["legal",/官司|法院|起诉|诉讼|仲裁|法律纠纷|判决/],
  ["exam",/考试|考研|考公|录取|考证|面试|资格证/],
  ["property",/房子|买房|卖房|租房|搬家|房屋|房产|合同|协议|签约/],
  ["finance",/工资|财运|收入|回款|资金|盈利|利润|欠款|还款|投资|钱|赚钱|储值/],
  ["relationship",/男朋友|女朋友|恋爱|复合|婚姻|结婚|分手|感情|伴侣|前任/],
  ["cooperation",/合作|合伙|搭档|伙伴|团队协作|共同经营|利益分配|竞争/],
  ["children",/孩子|子女|亲子|兴趣|休养|休闲|创作/],
  ["career",/工作|项目|职位|岗位|事业|职业|升职|降职|任命|领导|公司|门店|上班|兼职|副业|私活|接单|外包活/]
 ];
 const detected=recognize.find(([,reg])=>reg.test(cleaned))?.[0];
 let field=(promotion||demotion||official||sideJob||hiringPartTimer)?"career":detected||base.field||"general";
 if(!field){field=/(项目|岗位|职位|职场|升职|降职|任命)/.test(cleaned)?"career":null;}
 const manual={money:"finance",house:"property",friends:"cooperation",career:"career",relationship:"relationship",children:"children",health:"health"};
 if(!promotion&&!demotion&&!official&&requestedDomain&&requestedDomain!=="auto"&&manual[requestedDomain])field=manual[requestedDomain];
 if(!field)return {ok:false,error:"暂时看不出你问的是哪一类事情，请写清具体对象。"};
 const isWhen=/(什么时候|何时|哪天|几号|几月|多久|多长时间)/.test(cleaned);
 const isChoice=/(该不该|要不要|是否接受|接不接|值得不值得)/.test(cleaned);
 const isRisk=/(风险|危险|代价|阻碍在哪里)/.test(cleaned);
 const isImpact=/(对我有什么影响|对我个人.*影响|会给我带来什么)/.test(cleaned);
 const isComparison=/(哪个更|哪一个更|对比|比较|还是.*更好)/.test(cleaned);
 const isOpportunity=(base.intent==="new_opportunity"||
    ((sideJob||hiringPartTimer)&&/(会有|还有|进来|出现|找上|来找|有没有|找到|能不能|能否|机会|新增|未来|接下来|近期)/.test(cleaned)&&
     !/(已经|目前正在做|做了之后|应该接|该不该接|要不要接)/.test(cleaned)))&&!promotion&&!demotion;
 const isOutcome=/(会不会|是否|能不能|能否|能否在|能.*吗|会.*吗)/.test(cleaned);
 const isTrend=/(未来|接下来|后续|发展|走向|趋势|会怎么样)/.test(cleaned);
 const intent=isWhen?"timing":isChoice?"accept_decision":isComparison?"comparison":isRisk?"risk":isImpact?"personal_impact":isOpportunity?"new_opportunity":isOutcome?"outcome":isTrend?"trend":base.intent||"outcome";
 const parsedWindow=cleaned.match(/(?:未来|接下来|今后|后续|近)(?:的)?(?:[0-9]+|[零〇一二两三四五六七八九十百半]+)(?:个)?(?:天|周|月|年)/)?.[0];
 const window=parsedWindow||base.window||"未明确时间范围";
 return {ok:true,question:text,field,fieldName:DOMAIN[field]?.label||"事情",intent,
  window,object:{domain:field,subtype:eventSubtype,primary_intent:intent,time_window:window,original_question:text}};
}
function selectUse(i){
 const b=DOMAIN[i.field]||DOMAIN.general;
 return {primary:b.primary,secondary:b.secondary.slice(),label:b.label,topic:
  i.object.subtype==="promotion"?"正式升职":i.object.subtype==="demotion"?"降职或职级下调":i.object.subtype==="appointment"?"正式任命":i.object.subtype==="side_job"?"新的兼职工作":i.object.subtype==="part_time_hire"?"兼职人员到岗":
  i.field==="career"&&i.intent==="new_opportunity"?"新工作或项目":b.event};
}
function branch(r){return String(r||"").slice(-1)}
function back(a,b){
 const x=BRANCH[branch(a)],y=BRANCH[branch(b)];
 if(!x||!y)return "unknown";
 if(GENERATES[y]===x)return "back_generate";
 if(CONTROLS[y]===x)return "back_control";
 if(GENERATES[x]===y)return "move_generate";
 if(CONTROLS[x]===y)return "move_control";
 return "neutral";
}
function add(list,id,group,effect,fact,meaning,priority=30){
 list.push({id,group,effect,fact,meaning,priority});
}
function evaluate(c,i,use){
 const primary=use.primary,self=c.rows[c.a.shi-1],mov=c.rows.filter((r,k)=>[6,9].includes(c.totals[k]));
 const positive=[],negative=[],neutral=[],unresolved=[];
 const register=(id,group,effect,fact,meaning,priority)=>{
  const item={id,group,effect,fact,meaning,priority};
  (effect==="positive"?positive:effect==="negative"?negative:effect==="unresolved"?unresolved:neutral).push(item);
 };
 const pos=r=>POS[r.i]+"爻";
 const sourceRows=primary==="世应"?[self,c.rows[c.a.ying-1]]:primary?c.rows.filter(r=>r.r===primary):[];
 let used=null,selectionReason="",coverage="partial";
 if(i.field==="health"){
  register("health_boundary","boundary","unresolved","所问涉及身体或疾病","不能从卦象判断健康状况、疾病性质、病程或康复时间",100);
 }else if(!sourceRows.length){
  register("no_visible_primary","usegod","unresolved","本卦六爻中没有明现的"+(primary||"对应")+"用神","需要继续核对伏神和传统取用法，现有规则不能判断方向",100);
 }else if(primary==="世应"){
  const other=c.rows[c.a.ying-1], a=BRANCH[branch(self.gz)],b=BRANCH[branch(other.gz)];
  register("both_sides","usegod","neutral","世爻"+self.gz+"、应爻"+other.gz,"世应可以作为双方在传统卦中的位置，但不能代表真实想法",90);
  if(c.empty.includes(branch(other.gz)))register("other_void","void","unresolved","应爻"+other.gz+"逢空","对方或外部条件的传统信息仍不充分",88);
  if(CONTROLS[b]===a)register("other_controls_self","pair","negative",other.gz+"克"+self.gz,"传统上有外部条件制约本人一方的线索，现实含义仍需验证",80);
  else if(GENERATES[b]===a)register("other_support_self","pair","positive",other.gz+"生"+self.gz,"传统上有外部条件支持本人一方的线索，但不代表对方一定愿意合作",78);
  else register("self_other_context","pair","neutral","世应五行需要结合动静、月日和实际占问对象","不能直接用一组生克推断关系能否维系",45);
  if(mov.some(r=>r.i===other.i))register("other_moved","change","neutral",POS[other.i]+"爻为应爻且发动","外部条件有变化象义，并不证明对方会作出某种决定",55);
  // 世应类的细断缺少专门关系/合作取用体系，故标记为有限。
  register("context_limit","method","unresolved","世应不是完整的对象取用规则","双方关系、身份和事件性质尚需结合具体流派独立复核",35);
  used=self;
 }else{
  const movers=sourceRows.filter(r=>mov.some(m=>m.i===r.i));
  if(sourceRows.length===1){used=sourceRows[0];selectionReason="唯一明现的主用神";}
  else if(movers.length===1){used=movers[0];selectionReason="多个同类爻中只有一处发动；暂以动爻作主要观察对象";}
  else{
   register("multiple_primary","usegod","unresolved","出现"+sourceRows.length+"处"+primary+"，未能确定唯一主用神","不同爻可能代表不同对象，当前还缺少进一步取用标准",95);
  }
  if(used){
   const b=branch(used.gz), label=pos(used)+" "+used.gz+used.r;
   register("primary_identified","usegod","neutral",label,selectionReason,65);
   if(c.empty.includes(b))register("primary_void","void","unresolved",label+"旬空","按传统规则需核对何时出空、日月能否填实；不能当作已经兑现",85);
   for(const [tag,stem] of [["month",c.month],["day",c.day]]){
    const e=branch(stem),f=BRANCH[e],t=BRANCH[b];
    const key=tag==="month"?"月建":"日辰";
    if(OPPOSITE[e]===b)register(tag+"_clash",tag,"negative",key+e+"冲"+b+"（"+label+"）","传统上存在冲动或受制信号；还要结合动静和旺衰判断性质",tag==="day"?95:93);
    else if(CONTROLS[f]===t)register(tag+"_control",tag,"negative",key+e+"克"+b+"（"+label+"）","用神受制，属于需要关注的限制因素",tag==="day"?70:75);
    else if(GENERATES[f]===t)register(tag+"_generate",tag,"positive",key+e+"生"+b+"（"+label+"）","用神得到来自"+key+"的生扶",tag==="day"?70:75);
    else if(f===t)register(tag+"_same",tag,"positive",key+e+"与"+b+"同五行","用神与"+key+"同气，这是传统上的支持线索",tag==="day"?65:70);
    else register(tag+"_unclear",tag,"neutral",key+e+"与"+b+"的关系","这组关系不足以单独决定事情好坏",20);
   }
   if(mov.some(r=>r.i===used.i)){
     const change=back(used.gz,used.vgz);
     if(change==="back_control")register("back_control","change","negative",label+"发动化"+used.vgz+used.vr+"，回头克","变化后的力量反过来制约原来的用神",96);
     else if(change==="back_generate")register("back_generate","change","positive",label+"发动化"+used.vgz+used.vr+"，回头生","变化后的力量对原来的用神形成生扶",96);
     else register("primary_moving","change","neutral",label+"发动化"+used.vgz+used.vr,"有变化并不等于一定有好结果，还需结合生克和日月",60);
     if(c.empty.includes(branch(used.vgz)))register("changed_void","void","unresolved","变爻"+used.vgz+used.vr+"逢空","变化后的条件尚不能视为已经兑现",82);
   }else register("primary_static","change","neutral",label+"没有发动","静爻不等于一定不能成事，但目前没有直接用神发动的信号",45);
  }
 }
 if(self){
  register("self_state","self","neutral",POS[self.i]+"爻 "+self.gz+self.r+"持世"+(mov.some(r=>r.i===self.i)?"并发动":"，未发动"),"代表本人处境，应与所问用神分开观察",30);
 }
 // 新工作、新兼职：观察“任务/联系/文书一爻发动，化为职位/工作一爻”。
 // 该象义与正式录用或实际到岗不同，不能单独推导必成。
 const newCareerOpportunity=i.field==="career"&&i.intent==="new_opportunity";
 if(newCareerOpportunity){
   const emerging=mov.filter(r=>r.vr==="官鬼"&&r.r!=="官鬼");
   for(const r of emerging){
     const phase=back(r.gz,r.vgz);
     register("emerging_job_"+r.i,"new_opportunity","positive",POS[r.i]+"爻 "+r.gz+r.r+"发动化"+r.vgz+r.vr+"（"+phase+"）",
       "已有沟通、安排或资源线索发生变化，传统上可联系到新的工作机会；这不等于已经签约或开工",94);
     if(phase==="back_generate")register("emerging_support_"+r.i,"new_opportunity","positive",r.vgz+"生"+r.gz+"（回头生）",
       "变化后的因素对原爻形成支持，属于机会推进的辅助象义",76);
     if(c.empty.includes(branch(r.vgz)))register("emerging_void_"+r.i,"new_opportunity","unresolved",r.vgz+"旬空","变化后的岗位线索尚未落实",88);
   }
   if(i.object.subtype==="side_job"){
      const monthBranch=branch(c.month),selfBranch=branch(self.gz);
      if(OPPOSITE[monthBranch]===selfBranch)register("self_month_clash","self","negative",
        "世爻"+self.gz+self.r+"受到月建"+monthBranch+"冲动",
        "本人安排或承接条件存在需要协调的传统象义，不能把新机会直接等同于已经入手的兼职",84);
      const moneyRows=c.rows.filter(r=>r.r==="妻财");
      if(moneyRows.length && !moneyRows.some(r=>mov.some(m=>m.i===r.i))){
        register("earnings_not_moving","deliverability","unresolved","本卦财爻未发动",
          "收入兑现没有直接动爻依据，不能从有兼职机会直接推断已经拿到报酬",45);
      }
   }
 }
 const related=mov.filter(r=>use.secondary.includes(r.r) && (!used||r.i!==used.i));
 if(related.length)register("secondary_moving","secondary","neutral",related.map(r=>pos(r)+" "+r.gz+r.r).join("、")+"发动","辅助条件出现变化，但不能直接替代主用神的判断",25);
 if(mov.length>1)register("multi_motion","multi","unresolved",mov.map(r=>pos(r)).join("、")+"同时发动","完整多动爻连环作用尚未独立核验，不根据动爻数量推算吉凶",40);
 const conflict=positive.length>0&&negative.length>0;
 const requiresSpecialRule=i.object.subtype==="demotion"||i.object.subtype==="breakup"||i.field==="legal";
 if(requiresSpecialRule)register("unverified_goal_direction","method","unresolved","所问的结果不能直接套用一般的得利判断","这类事件需要专门的传统取用与吉凶映射规则，当前尚未独立核验",99);
 const strongUnresolved=unresolved.some(x=>["no_visible_primary","multiple_primary","health_boundary","unverified_goal_direction"].includes(x.id));
 let status="insufficient_evidence";
 if(!strongUnresolved&&used){
  if(conflict)status="mixed_signals";
  else if(negative.length)status="restraining_signals";
  else if(positive.length)status="favorable_signals";
 }
 const limit=["尚未独立验收的完整旺衰、伏神飞神和多动爻连锁，不能据此预测真实结果"];
 if(used&&sourceRows.length>1)limit.push("多个同类六亲的完整取用仍需复核");
 if(i.intent==="timing"||i.window!=="未明确时间范围")limit.push("目前没有通过独立验收的应期算法，不能可靠判断哪天发生");
 return {status,confidence:"limited",scope:"partial-traditional-signals",primary,
  selected:used?{position:used.i+1,branch:branch(used.gz),kin:used.r,gz:used.gz}:null,
  supporting_factors:positive.sort((a,b)=>b.priority-a.priority),
  restricting_factors:negative.sort((a,b)=>b.priority-a.priority),
  unresolved_factors:unresolved.sort((a,b)=>b.priority-a.priority),
  contextual_factors:neutral.sort((a,b)=>b.priority-a.priority),
  conflict,limitations:limit,question:i.question,domain:i.field,subtype:i.object.subtype,time_window:i.window};
}
function humanize(c,i,use,j,verified){
 const scope=use.topic, isTime=i.intent==="timing", scopeTerm=i.window!=="未明确时间范围"?i.window+"内":"";
 const verdict={
  favorable_signals:"按已核对的部分传统规则，"+scope+"有一些有利线索，但现实结果还不能凭这一卦确定。",
  restraining_signals:"目前看到的传统线索里，"+scope+"有一些明显阻力，但不等于一定失败。",
  mixed_signals:"与"+scope+"有关的线索有支持也有阻碍，这次还看不出明确方向。",
  insufficient_evidence:"这张卦关于"+scope+"的关键信息不够，暂时不能判断会不会发生。"
 }[j.status];
 let lead=verdict;
 if(isTime){
  const who=i.object.subtype==="promotion"?"你什么时候能升职":i.object.subtype==="appointment"?"你什么时候会得到正式任命":scope+"什么时候发生";
  lead="现在没有可靠依据判断"+who+"，不能给你编一个月份。"+
    (j.status==="insufficient_evidence"?"卦里还有关键条件没核实清楚。":verdict);
 }else if(i.object.subtype==="promotion"&&i.intent==="outcome"){
  lead=(scopeTerm?"关于"+scopeTerm+"能不能升职，":"关于能不能升职，")+
    (j.status==="insufficient_evidence"?"目前这卦还给不出有依据的肯定或否定答案。":verdict);
 }else if(i.intent==="new_opportunity"){
  lead="关于还会不会出现"+scope+"，"+verdict;
 }else if(i.intent==="trend"){
  lead="看"+(scopeTerm||"接下来")+scope+"的走向，"+verdict;
 }else if(i.intent==="comparison"){
  lead="这张卦还不足以公平比较两个选择，不能凭它直接说哪个好。需要先确定各对象对应的判断依据。";
 }
 if(i.intent==="new_opportunity"&&i.object.subtype==="side_job"){
    const hasEmerging=j.supporting_factors.some(x=>x.id.startsWith("emerging_job_"));
    const hasClash=j.restricting_factors.some(x=>x.id==="self_month_clash");
    const time=i.window!=="未明确时间范围"?i.window+"，":"接下来，";
    const formation=hasEmerging?"卦里有从任务安排变化到工作机会的传统象义线索，说明可以关注有没有人来谈兼职。":"目前缺少直接指向新兼职的变化线索。";
    const obstacle=hasClash?"不过也有承接条件不稳的象义，":"";
    const startObstacle=c.b.name.includes("屯")?"变卦「屯」也有事情刚起步、推进不易的传统含义。":"";
    lead=hasEmerging?
      "按这卦的传统象义，"+time+"可能有人来找你谈兼职，但一个月内能不能谈成、真正开始做，还看不稳。"+
       (hasClash?"你这边的承接条件也有变化或阻力的象义。":"")+
       startObstacle+"有机会来聊，不等于活已经确定。":
      "按这卦目前能核对的传统规则，"+time+"还看不出足够明确的新兼职线索，不能因此断定一定有或一定没有。";
    // 与模板化“工作发展较有利”不同，区分接洽、确认、开工、到账四个阶段。
    if(hasEmerging)j.opportunity_stage="contact_possible_unconfirmed";
    j.reading_basis=formation;
 }
  if(i.field==="health")lead="这类健康问题不能用卦象判断诊断、治疗或康复结果。可以查看传统文化象义，但具体健康问题应依据医学信息。";
 const mainEvidence=[...j.restricting_factors,...j.supporting_factors,...j.unresolved_factors]
  .sort((a,b)=>b.priority-a.priority).slice(0,3);
 if(!mainEvidence.length)mainEvidence.push(...j.contextual_factors.slice(0,2));
 const plain=x=>{
  if(x.id==="no_visible_primary")return "这件事最关键的传统线索没有直接出现在本卦中，而隐藏线索的规则尚未完善，因此暂时没法判断方向。";
  if(x.id==="multiple_primary")return "同一种关键线索出现了不止一次，程序还无法可靠确定哪一个才代表你问的这件事。";
  if(x.id==="health_boundary")return "卦象没有医学判断能力，不能靠它推测病情。";
  if(x.id==="unverified_goal_direction")return "这类问题的好坏方向不能照搬普通求成问题的规则，相关的专业判断还没有验证完成。";
  if(x.id==="multi_motion")return "这张卦同时有多处变化，程序还没有完成它们相互作用的判断，不能按变化数量定结果。";
  if(x.id.startsWith("emerging_job_"))return "有一条动爻从沟通、安排一类事务转成工作相关的象义，像是先有人来接洽，再谈具体兼职，并不表示已经拿到了工作。";
  if(x.id.startsWith("emerging_support_"))return "这次变化有相互支持的传统线索，可作为机会推进的辅助依据。";
  if(x.id==="self_month_clash")return "代表你本人处境的爻受到当月冲动，传统上提示时间、安排等承接条件还可能有变数。";
  if(x.id==="earnings_not_moving")return "涉及报酬的爻没有发动，不能从有人联系就推断兼职已经成交。";
  if(x.id==="primary_void")return "与这件事直接相关的一爻出现了“旬空”，在传统说法中意味着某些条件还要继续核实。";
  if(x.id==="back_control")return "关键一爻变化后，反而形成制约，这是需要注意的传统阻力信号。";
  if(x.id==="back_generate")return "关键一爻变化后得到生扶，在目前实现的传统规则中属于支持线索。";
  if(x.id.endsWith("_clash"))return "与这件事直接相关的一爻受到当日或当月干支冲动；这不是必败，但属于不能忽略的制约。";
  if(x.id.endsWith("_generate")||x.id.endsWith("_same"))return "与这件事相关的一爻得到日月支持，但还不足以保证事情会成功。";
  if(x.id.endsWith("_control"))return "与这件事相关的一爻受到日月克制，属于阻力线索。";
  if(x.id==="other_controls_self")return "在传统的世应关系中，外部一方有制约本人的象义，但不能据此猜测对方的真实心思。";
  if(x.id==="other_support_self")return "世应关系中有生扶本人的象义，但这不代表现实中对方已经答应。";
  return x.meaning.replace(/官鬼|父母|妻财|子孙|兄弟/g,"相关爻");
 };
 let why=mainEvidence.map(plain);
 if(j.conflict)why.push("既有支持也有制约，现有规则还不足以分出主次。");
 if(!why.length)why=["当前没有足够的、可以直接核查的核心用神信息。"];
 if(i.intent==="new_opportunity"&&i.object.subtype==="side_job"&&c.b.name.includes("屯")){
    why.push("变卦是「屯」，传统象义提示事情刚起步时可能需要反复协调；不能当成一个月内已能上岗的证据。");
 }
  why=[...new Set(why)].slice(0,3);
 const brief="本卦"+c.a.name+(c.a.name!==c.b.name?"，变"+c.b.name:"（静卦）")+"。卦名和变卦只作传统象义参考，不能单凭卦名断成败。";
 const config=DOMAIN[i.field]||DOMAIN.general;
 const action=i.object.subtype==="side_job"?"留意是否有人明确询问你的档期、报价或合作范围；只有确定工作内容、报酬和开始时间，才算真正接到兼职":
  i.object.subtype==="part_time_hire"?"留意有没有实际应聘者到店/到岗，确认排班、薪资和录用时间":
  i.object.subtype==="promotion"?"观察是否已有明确晋升名额、上级提名、评审标准和正式任命安排":
  i.object.subtype==="demotion"?"以正式岗位变更、绩效谈话、组织通知为准，不凭卦象猜测":
  i.object.subtype==="appointment"?"核对组织是否已有任命文件、决策流程和执行节点":config.action;
 return {headline:lead,why,brief,action,scope:scopeTerm,technicalNote:"以下只是在所声明传统规则下对卦盘做的有限分析，不能据此预测真实未来。"};
}
function render(c,i,use,j,h,verified){
 const lines=verified.origin.lines;
 const movers=c.rows.filter(r=>[6,9].includes(c.totals[r.i]));
 const movedText=movers.length?movers.map(r=>POS[r.i]+"爻「"+lines[r.i]+"」").join("；"):"本次没有动爻。";
 const sub=(label,arr)=>arr.length?"<h4>"+ESC(label)+"</h4><ul>"+arr.map(x=>"<li>"+ESC(x.fact)+" — "+ESC(x.meaning)+" <small>["+ESC(x.id)+"]</small></li>").join("")+"</ul>":"";
 return '<div class="focus-report yiyan-v5" data-engine="5.1.0">'+
 '<div class="section-title">先说结论</div><p class="v5-lead"><strong>'+ESC(h.headline)+'</strong></p>'+
 '<div class="section-title">为什么这样说</div><ol class="v5-why">'+h.why.map(x=>"<li>"+ESC(x)+"</li>").join("")+"</ol>"+
 '<div class="section-title">接下来最值得关注什么</div>'+paragraph(h.action)+
 '<p class="sub">'+ESC(h.technicalNote)+'</p>'+
 '<details class="v5-details"><summary>查看专业排盘依据、原文与规则限制</summary>'+
 paragraph("问题："+i.question+"；类别："+i.field+" / "+i.object.subtype+" / "+i.intent+"；时间："+i.window)+
 paragraph("卦象："+c.a.name+" → "+c.b.name+"；主用神："+(use.primary||"不适用")+"；综合状态："+j.status+"（仅表示传统规则信号）")+
 paragraph(h.brief)+
 sub("支持线索",j.supporting_factors)+sub("制约线索",j.restricting_factors)+
 sub("暂时无法核验",j.unresolved_factors)+sub("辅助观察",j.contextual_factors)+
 '<h4>本次动爻原文</h4>'+paragraph(movedText)+
 '<h4>规则局限</h4><ul>'+j.limitations.map(x=>"<li>"+ESC(x)+"</li>").join("")+"</ul></details></div>";
}
function interpret(c){
 // 先通过 V4.2 已有的八宫、变卦、爻序、六亲、六兽及原始钱面检查。
 const verified=old.verify(c);
 const i=question(c.question,c.requestedDomain);if(!i.ok)throw Error(i.error);
 const use=selectUse(i),judgment=evaluate(c,i,use),answer=humanize(c,i,use,judgment,verified),html=render(c,i,use,judgment,answer,verified);
 return {ok:true,html,answer:answer.headline,explanation:answer.why,
  judgment,intent:i,conclusion:answer.headline,interpretationVersion:"5.1.0"};
}
g.YiYaoEngineV5={load:()=>old.load(),identify:question,selectUse,evaluate,interpret,version:"5.1.0"};
})(window);
