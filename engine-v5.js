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
const ADVANCE={寅:"卯",巳:"午",申:"酉",亥:"子",丑:"辰",辰:"未",未:"戌",戌:"丑"};
const MONTH_BREAK=OPPOSITE;

const ESC=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const paragraph=s=>"<p>"+ESC(s)+"</p>";
const DOMAIN={
 career:{label:"工作",primary:"官鬼",secondary:["父母"],event:"工作发展",action:"看看岗位职责、可用资源和上级对成果的评价是否真正发生变化"},
 finance:{label:"钱",primary:"妻财",secondary:["子孙"],event:"收入或款项",action:"核对实际入账、付款条件和成本，不能把预期收入当到账"},
 relationship:{label:"关系",primary:"世应",secondary:["官鬼","妻财"],event:"这段关系",action:"看双方是否有明确沟通和实际行动，不凭卦象揣测对方心思"},
 property:{label:"房屋和合同",primary:"父母",secondary:["妻财"],event:"合同或房屋事务",action:"核对权属、条款、付款、审批和交付节点"},
 cooperation:{label:"合作",primary:"世应",secondary:["兄弟","父母"],event:"合作进展",action:"确认分工、合作方的实际投入，以及责任和收益怎么分"},
 social:{label:"朋友与社交",primary:"兄弟",secondary:["世应"],event:"结识新朋友",action:"关注是否结识新人及相处是否持续，不涉及商业合作的分工与收益"},
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
 const jobTenure=/(公司|单位|岗位|这份工作|目前工作|当前工作).*(待多久|呆多久|干多久|做多久|留多久|待到什么时候|呆到什么时候|还能待|还能呆|何时离开|什么时候离开)|(会在|在).*(公司|单位).*(多久|多长时间)/.test(cleaned);
 const socialFriends=/(朋友|友谊|交友|交朋友|认识新人|结识新人|朋友圈子|社交圈)/.test(cleaned)&&!/(男女朋友|男朋友|女朋友|恋人|交往对象)/.test(cleaned);
 const hiringPartTimer=/(招聘兼职|招兼职|兼职员工|兼职人员|兼职店员|兼职人手|找兼职人员)/.test(cleaned);
 const sideJob=/(兼职|副业|私活|接单|外包活|临时项目|临时工作)/.test(cleaned)&&!hiringPartTimer;
 const eventSubtype=jobTenure?"job_tenure":socialFriends?"friendship_new":promotion?"promotion":demotion?"demotion":official?"appointment":breakup?"breakup":sideJob?"side_job":hiringPartTimer?"part_time_hire":base.object?.subtype||"general";
 const recognize=[
  ["health",/健康|身体|症状|生病|疾病|病情|手术|康复|怀孕|胎儿/],
  ["legal",/官司|法院|起诉|诉讼|仲裁|法律纠纷|判决/],
  ["exam",/考试|考研|考公|录取|考证|面试|资格证/],
  ["property",/房子|买房|卖房|租房|搬家|房屋|房产|合同|协议|签约/],
  ["finance",/工资|财运|收入|回款|资金|盈利|利润|欠款|还款|投资|钱|赚钱|储值/],
  ["relationship",/男朋友|女朋友|恋爱|复合|婚姻|结婚|分手|感情|伴侣|前任/],
  ["social",/朋友|友谊|交友|交朋友|认识新人|结识新人|社交圈/],
  ["cooperation",/合作|合伙|搭档|伙伴|团队协作|共同经营|利益分配|竞争/],
  ["children",/孩子|子女|亲子|兴趣|休养|休闲|创作/],
  ["career",/工作|项目|职位|岗位|事业|职业|升职|降职|任命|领导|公司|门店|上班|兼职|副业|私活|接单|外包活/]
 ];
 const detected=recognize.find(([,reg])=>reg.test(cleaned))?.[0];
 let field=jobTenure?"career":socialFriends?"social":(promotion||demotion||official||sideJob||hiringPartTimer)?"career":detected||base.field||"general";
 if(!field){field=/(项目|岗位|职位|职场|升职|降职|任命)/.test(cleaned)?"career":null;}
 const manual={money:"finance",house:"property",friends:"cooperation",career:"career",relationship:"relationship",children:"children",health:"health"};
 if(!promotion&&!demotion&&!official&&requestedDomain&&requestedDomain!=="auto"&&manual[requestedDomain])field=manual[requestedDomain];
 if(!field)return {ok:false,error:"暂时看不出你问的是哪一类事情，请写清具体对象。"};
 const isWhen=/(什么时候|何时|哪天|几号|几月|多久|多长时间)/.test(cleaned);
 const isChoice=/(该不该|要不要|是否接受|接不接|值得不值得)/.test(cleaned);
 const isRisk=/(风险|危险|代价|阻碍在哪里)/.test(cleaned);
 const isImpact=/(对我有什么影响|对我个人.*影响|会给我带来什么)/.test(cleaned);
 const isComparison=/(哪个更|哪一个更|对比|比较|还是.*更好)/.test(cleaned);
 const isOpportunity=(socialFriends&&/(新朋友|新的朋友|认识新人|结识新人|交到朋友|交新朋友)/.test(cleaned))||(base.intent==="new_opportunity"||
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
  i.object.subtype==="job_tenure"?"在当前公司留任的时长":i.object.subtype==="friendship_new"?"结识新朋友":i.object.subtype==="promotion"?"正式升职":i.object.subtype==="demotion"?"降职或职级下调":i.object.subtype==="appointment"?"正式任命":i.object.subtype==="side_job"?"新的兼职工作":i.object.subtype==="part_time_hire"?"兼职人员到岗":
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
 if(i.object.subtype==="friendship_new"){
  const other=c.rows[c.a.ying-1],friends=c.rows.filter(r=>r.r==="兄弟"),selfMoved=mov.some(r=>r.i===self.i);
  const clues=[
   {id:"social_world",group:"self",effect:"neutral",priority:92,fact:"世爻"+self.gz+self.r+(selfMoved?"发动":"安静")+(c.empty.includes(branch(self.gz))?"，旬空":""),
    meaning:selfMoved?"你本人对应的爻有变化，交友活动或自身状态是观察焦点；但不等于已经遇见朋友。":"世爻静守，不能据此断定社交情况不变。"},
   {id:"social_change",group:"change",effect:selfMoved?"neutral":"unresolved",priority:85,
    fact:mov.length?mov.map(r=>POS[r.i]+"爻 "+r.gz+r.r+"化"+r.vgz+r.vr+"（"+back(r.gz,r.vgz)+"）").join("；"):"六爻安静",
    meaning:selfMoved?"世爻动变表明本人一侧有变化象义；需要与兄弟用神及应爻合参。":"静卦不意味着不会认识新朋友。"},
   {id:"social_other",group:"response",effect:"neutral",priority:75,fact:"应爻"+other.gz+other.r+(c.empty.includes(branch(other.gz))?"，旬空":""),
    meaning:"应爻可辅助参考外部交往，但不能据此确定会出现某个具体的人。"}
  ];
  if(friends.length)clues.push({id:"social_brothers",group:"usegod",effect:"neutral",priority:90,fact:friends.map(r=>POS[r.i]+"爻"+r.gz+r.r).join("、"),meaning:"传统六亲的兄弟爻是朋友同辈的参考用神；其动静及日月仍需校核。"});
  else clues.push({id:"social_hidden",group:"usegod",effect:"unresolved",priority:99,fact:"本卦兄弟爻没有明现",meaning:"涉及朋友的主要传统用神未在本卦显现；伏神飞神关系尚未完整校验，不能断定未来没有朋友。"});
  if(selfMoved&&c.empty.includes(branch(self.gz)))clues.push({id:"social_world_void",group:"void",effect:"unresolved",priority:96,fact:"世爻"+self.gz+"发动并逢旬空",meaning:"传统上提示本人这侧的行动或交往条件尚不稳定，须辨空亡与动爻关系。"});
  const unresolved=clues.filter(x=>x.effect==="unresolved"),contextual=clues.filter(x=>x.effect!=="unresolved");
  return {status:"insufficient_evidence",confidence:"limited",scope:"partial-traditional-signals",primary:"兄弟",selected:null,
   supporting_factors:[],restricting_factors:[],unresolved_factors:unresolved,contextual_factors:contextual,
   conflict:false,opportunity_signals:[],realization_constraints:[],limitations:["本卦兄弟爻不明现时须核验伏神，不得将其断为无朋友","旬空及动变不能当作现实中新朋友出现或不出现的证据","传统卦象不是对社交事件的科学预测"],
   question:i.question,domain:"social",subtype:"friendship_new",time_window:i.window};
 }

 const positive=[],negative=[],neutral=[],unresolved=[];
 const register=(id,group,effect,fact,meaning,priority)=>{
  const item={id,group,effect,fact,meaning,priority};
  (effect==="positive"?positive:effect==="negative"?negative:effect==="unresolved"?unresolved:neutral).push(item);
 };
 const pos=r=>POS[r.i]+"爻";
 const sourceRows=primary==="世应"?[self,c.rows[c.a.ying-1]]:primary?c.rows.filter(r=>r.r===primary):[];
 // 主用神不现，不等于应爻及相关辅助爻没有变化；只反映进程，不据此断成败。
 const indirectMoves=!sourceRows.length&&i.field!=="health"?
   mov.filter(r=>use.secondary.includes(r.r)||r.i===c.a.ying-1):[];
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
 // 所有新工作机会均需先看现有官鬼是否发动，而不能只识别“父母动化官鬼”。
 const newCareerOpportunity=i.field==="career"&&i.intent==="new_opportunity";
 if(newCareerOpportunity){
   const activeOffices=mov.filter(r=>r.r==="官鬼");
   for(const r of activeOffices){
      register("active_office_"+r.i,"new_opportunity","positive",pos(r)+" "+r.gz+"官鬼发动",
        "代表工作事项的主用神本身发生变化；属于工作机会相关的传统动象，不能直接等同于工作已落实",92);
      if(r.vr==="父母"){
        register("office_to_paper_"+r.i,"new_opportunity","neutral",pos(r)+" "+r.gz+"官鬼化"+r.vgz+"父母",
          "工作相关事项转向沟通、安排或文书条件；这里只是传统六亲象义，不代表已经拿到合同",73);
        if(c.empty.includes(branch(r.vgz))){
           register("office_paper_void_"+r.i,"new_opportunity","unresolved",pos(r)+" 官鬼化"+r.vgz+"父母，变爻旬空",
             "工作相关安排的后续条件存在尚未落实的象义，不能仅凭发动就断定一个月内成事",88);
        }
      }
   }
   if(mov.some(r=>r.i===self.i)){
     register("self_active","self","neutral",pos(self)+" "+self.gz+self.r+"持世发动化"+self.vgz+self.vr,
       "本人这边也有变化，需观察是否能承接新安排",65);
     if(c.empty.includes(branch(self.gz))){
       register("self_move_void","self","unresolved",pos(self)+" "+self.gz+self.r+"旬空且发动",
         "本人相关安排的传统条件还不够稳，不宜认作机会已落实",86);
     }
     if(ADVANCE[branch(self.gz)]===branch(self.vgz)){
       register("self_advance","self","positive",pos(self)+" "+self.gz+"化"+self.vgz+"，丑辰等同类进神关系",
         "按常见进退神规则，此变动有逐步推进的象义；但需结合旬空和日月冲克核查，不可直接作成功判断",72);
     }
     if(MONTH_BREAK[branch(c.month)]===branch(self.vgz)){
       register("self_change_month_clash","self","unresolved","变世爻"+self.vgz+"与月建"+c.month+"相冲",
         "变爻还受当月冲动的制约，进神或变化象义不能单独认定已经成功",84);
     }
   }
 }
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
 if(indirectMoves.length){
   for(const r of indirectMoves){
     const asOther=r.i===c.a.ying-1,nm=pos(r)+" "+r.gz+r.r;
     register("indirect_process_"+r.i,"process","neutral",nm+"发动化"+r.vgz+r.vr+(asOther?"（应爻）":""),
       asOther?"外界或合作方对应的事务有变化象义，不能因此断定已有邀约":
         "任务、沟通或手续对应的爻在变化，可观察是否有实际联系",85);
     if(OPPOSITE[branch(c.day)]===branch(r.gz))
       register("indirect_day_clash_"+r.i,"day","unresolved",nm+"被日辰"+c.day+"冲动",
         "传统上有日冲线索，但须结合旺衰判断是催动还是受制",87);
     if(c.empty.includes(branch(r.vgz)))
       register("indirect_changed_void_"+r.i,"void","unresolved",pos(r)+"变爻"+r.vgz+r.vr+"旬空",
         "间接变化的后续条件尚未坐实",83);
   }
 }
 const related=mov.filter(r=>use.secondary.includes(r.r) && (!used||r.i!==used.i));
 if(related.length)register("secondary_moving","secondary","neutral",related.map(r=>pos(r)+" "+r.gz+r.r).join("、")+"发动","辅助条件出现变化，但不能直接替代主用神的判断",25);
 if(mov.length>1)register("multi_motion","multi","unresolved",mov.map(r=>pos(r)).join("、")+"同时发动","完整多动爻连环作用尚未独立核验，不根据动爻数量推算吉凶",40);
 // 对问题所涉事件，“机会动象”与“是否已经落实”的证据分开记录。
 const contactSignals=positive.filter(x=>x.id.startsWith("emerging_job_")||x.id.startsWith("active_office_"));
 const timingBlockers=unresolved.filter(x=>x.id==="self_move_void"||x.id.startsWith("office_paper_void_")||x.id==="self_change_month_clash");
 const conflict=positive.length>0&&(negative.length>0||contactSignals.length>0&&timingBlockers.length>0);
 const requiresSpecialRule=i.object.subtype==="demotion"||i.object.subtype==="breakup"||i.field==="legal";
 if(requiresSpecialRule)register("unverified_goal_direction","method","unresolved","所问的结果不能直接套用一般的得利判断","这类事件需要专门的传统取用与吉凶映射规则，当前尚未独立核验",99);
 const strongUnresolved=unresolved.some(x=>["no_visible_primary","multiple_primary","health_boundary","unverified_goal_direction"].includes(x.id));
 let status="insufficient_evidence";
 if(newCareerOpportunity&&i.object.subtype==="side_job"&&sourceRows.length===0&&indirectMoves.length)
   status="process_moving_outcome_unknown";
 if(!strongUnresolved&&used){
  if(newCareerOpportunity&&contactSignals.length&&timingBlockers.length&&!negative.length)status="opportunity_unsettled";
  else if(conflict)status="mixed_signals";
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
  conflict,opportunity_signals:contactSignals.map(x=>x.id),realization_constraints:timingBlockers.map(x=>x.id),
  limitations:limit,question:i.question,domain:i.field,subtype:i.object.subtype,time_window:i.window};
}
function humanize(c,i,use,j,verified){
 const scope=use.topic, isTime=i.intent==="timing", scopeTerm=i.window!=="未明确时间范围"?i.window+"内":"";
 const verdict={
  favorable_signals:"按已核对的部分传统规则，"+scope+"有一些有利线索，但现实结果还不能凭这一卦确定。",
  restraining_signals:"目前看到的传统线索里，"+scope+"有一些明显阻力，但不等于一定失败。",
  mixed_signals:"与"+scope+"有关的线索有支持也有阻碍，这次还看不出明确方向。",
  opportunity_unsettled:"卦里有"+scope+"的变化象义，但能不能落实还有关键条件没有弄清楚。",
  process_moving_outcome_unknown:"这张卦有联系或安排变化的传统线索，但还无法判断"+scope+"是否真能接成。",
  insufficient_evidence:"这张卦关于"+scope+"的关键信息不够，暂时不能判断会不会发生。"
 }[j.status];
 let lead=verdict;
 if(i.object.subtype==="job_tenure"){
 const self=c.rows[c.a.shi-1],other=c.rows[c.a.ying-1];
 const quiet=c.totals.every(n=>n===7||n===8);
 const monthBreak=OPPOSITE[branch(c.month)]===branch(self.gz);
 return {headline:"你问的是还会在现在的公司待多久，而不是工作什么时候发展。这张卦不能支持一个可靠的离职月份，也没有充分依据断定你近期一定会离开。不能从静卦推断你会永远留下。",
 why:[quiet?"本卦六爻安静，没有动爻，不能据此直接推算什么时候离职；静卦也不等于永远留任。":"有动爻不等于必然离职，必须核查世爻与职位有关的关系。",
 "世爻"+self.gz+self.r+(monthBreak?"遇月建"+c.month+"冲，属于传统上的制约线索；不能把月冲直接换算为离职日期。":"的日月作用需要综合旺衰判断，不能直接确定留任长度。"),
 "官鬼可辅助参考工作职位；应爻"+other.gz+other.r+"可观察外部工作关系，但这些都不足以证明具体去留时间。"],
 brief:"本卦"+c.a.name+"，变"+c.b.name+"。",action:"关注现实中的劳动合同、岗位调整、实际求职行动和明确的离职决定，才能判断在职时长。",
 scope:"",technicalNote:"六爻仅用于传统民俗解读，无法可靠预测实际离职时间；没有传统规则依据时不编造月份。"};
 }
 if(i.object.subtype==="friendship_new"){
  const world=c.rows[c.a.shi-1],other=c.rows[c.a.ying-1];
  const siblings=c.rows.filter(r=>r.r==="兄弟");
  const wmove=[6,9].includes(c.totals[world.i]);
  const reasons=[
   "这次实际发动的是"+(wmove?"世爻"+world.gz+world.r:"其他爻")+"，"+(wmove?"你自己的交往状态或行动是卦内变化焦点，但这不等于已经结识新朋友。":"这条动变不直接证明会有新的朋友出现。"),
   siblings.length?"兄弟爻是传统上观察朋友、同辈的参考位置，仍需结合日月动变判断。":"本卦没有明现兄弟爻，传统上需继续查伏神；不能据此说你未来没有新朋友。",
   "应爻"+other.gz+other.r+"可辅助观察外部交往。"+(c.empty.includes(branch(world.gz))?"世爻又逢旬空，当前无法判断未来三个月结识新朋友的结果。":"目前没有足够的条件证明新朋友会在期限内出现。")
  ];
  return {headline:"关于"+i.window+"会不会认识新朋友：这张卦存在你本人交往状态变化的传统线索，但不足以判断一定会或一定不会交到新朋友。不能从本卦推断具体人数或日期。",
   why:reasons,brief:"本卦"+c.a.name+"，变"+c.b.name+"；仅用传统六爻作为民俗文化参考。",
   action:"可以关注现实中是否有新的社交接触、主动交流及持续联系。结识新朋友取决于真实相处，不需要用商业合作的分工或收益标准衡量。",
   scope:scopeTerm,technicalNote:"六爻为民俗文化解释，不可靠预测现实交友结果；伏神及旬空的综合分析仍有规则限制。"};
 }

 let scenarioWhy=null;
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
    const activeOffice=j.supporting_factors.some(x=>x.id.startsWith("active_office_"));
    const paperworkVoid=j.unresolved_factors.some(x=>x.id.startsWith("office_paper_void_"));
    const selfVoid=j.unresolved_factors.some(x=>x.id==="self_move_void");
    const selfAdvance=j.supporting_factors.some(x=>x.id==="self_advance");
    const selfChangeClash=j.unresolved_factors.some(x=>x.id==="self_change_month_clash");
    const hasClash=j.restricting_factors.some(x=>x.id==="self_month_clash");
    const span=i.window!=="未明确时间范围"?i.window:"接下来";
    const originalLines=verified.origin.lines;
    const delayed=c.rows.some(r=>[6,9].includes(c.totals[r.i])&&/愆期|迟归|延期|未至|有待/.test(originalLines[r.i]));
    const lineExample=c.rows.find(r=>[6,9].includes(c.totals[r.i])&&/愆期|迟归|延期|未至|有待/.test(originalLines[r.i]));
    if(activeOffice){
      lead="按这张卦的传统象义，"+span+"有兼职相关的变化线索，但能否真正谈成、开工还看不稳。"+
        (paperworkVoid?"工作相关的动爻转向安排事项，但变爻逢空，暂不能当作工作已经确定。":"")+
        (delayed?"动爻原文也有等待、延期之意，不支持断定期限内必能落地。":"");
    }else if(hasEmerging){
      lead="按这张卦的传统象义，"+span+"可能出现兼职接洽，但能不能谈成、真正开始做还不好确定。"+
        (hasClash?"你这边的承接时间或条件也可能需要协调。":"")+
        (c.b.name.includes("屯")?"变卦「屯」有刚起步、推进不易的传统象义。":"");
    }else{
      const indirect=j.contextual_factors.filter(x=>x.id.startsWith("indirect_process_"));
      const dayClash=j.unresolved_factors.filter(x=>x.id.startsWith("indirect_day_clash_"));
      if(indirect.length){
        const first=indirect[0], movingIndex=c.rows.find(r=>first.id==="indirect_process_"+r.i)?.i;
        const original=movingIndex===undefined?"":String(verified.origin.lines[movingIndex]||"");
        const clue=/小有言/.test(original)?"动爻有“小有言，终吉”一类字句，传统上有短暂分歧后逐步缓和的象义；但不是兼职签成的保证。":
                   /愆期|迟归/.test(original)?"动爻原文也有等待、延期的传统象义。":"";
        lead="按这卦的传统象义，"+span+"有联系或安排变化的线索，但还看不出兼职一定能在期限内真正接成。"+
          (dayClash.length?"相关动爻受日冲，推进过程并不稳定。":"")+clue+
          "本卦「"+c.a.name+"」偏向"+(old.themeOf?.(c.a.name)||"观察当前状况")+"，变卦「"+c.b.name+"」强调"+(old.themeOf?.(c.b.name)||"留意后续变化")+"。卦象描述的是传统过程象义，不能当作兼职成交保证。";
        scenarioWhy=[
          first.fact+"：外部或任务相关事务有所变化，可观察是否出现兼职沟通，但不是已经拿到工作。",
          ...(dayClash.length?[dayClash[0].fact+"：这属于传统上的冲动信息，不能机械地当作必败或必成。"]:[]),
          "本卦没有明现"+use.primary+"，伏神等规则还没完成验证，因此仅凭这些间接线索无法确定结果。"
        ].slice(0,3);
      }else{
        lead="从这张卦当前已核验的传统规则看，"+span+
          "暂缺明确的工作机会变化依据，不能判断期限内是否接得成兼职。";
      }
    }
    if(activeOffice){
      const office=c.rows.find(r=>j.supporting_factors.some(x=>x.id==="active_office_"+r.i));
      const officer=office?POS[office.i]+"爻"+office.gz+office.r:"工作相关爻";
      const reasons=[officer+"发动，卦里并非没有工作机会的变化线索；但发动不等于兼职已到手。"];
      if(paperworkVoid)reasons.push("工作相关的一爻变为安排、文书一类的象义，但对应变爻旬空，不能当作已经敲定。");
      if(selfVoid||selfAdvance||selfChangeClash){
         reasons.push("你本人对应的爻"+(selfVoid?"旬空且发动":"发生变化")+
           (selfAdvance?"，化进神有逐步推进的象义":"")+
           (selfChangeClash?"，但变爻又与月建相冲":"")+"，因此仍需看条件能否落实。");
      }
      if(delayed&&lineExample)reasons.push("动爻原文「"+originalLines[lineExample.i]+"」，传统上有延迟、等待的意味，不是一个月内必然成功的日期判断。");
      scenarioWhy=reasons.slice(0,3);
    }
    if(hasEmerging||activeOffice)j.opportunity_stage=(paperworkVoid||selfVoid||selfChangeClash||hasClash)?"movement_with_unsettled_conditions":"movement_unconfirmed";
    j.reading_basis=activeOffice?"工作爻直接发动":hasEmerging?"父母等爻动化工作相关爻":"未见足够直接的新工作动象";
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
  if(x.id.startsWith("active_office_"))return "工作相关的一爻自己发动了：这说明卦象里确实出现工作变化线索，不是毫无动静；但兼职是否到手仍要另看。";
  if(x.id.startsWith("office_paper_void_"))return "这条工作相关动爻变化后的安排条件逢空，还不能按已经落实来理解。";
  if(x.id==="self_move_void")return "代表你自己的一爻既发动又旬空，传统上提示本人承接条件还有不确定因素。";
  if(x.id==="self_advance")return "代表你自己的一爻化进神，有推进的象义，但要跟其他条件一起判断。";
  if(x.id==="self_change_month_clash")return "世爻变成的地支与当月相冲，这会限制仅凭进神就断定事情顺利。";
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
  if(scenarioWhy)why=scenarioWhy;
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
 return '<div class="focus-report yiyan-v5" data-engine="5.3.0">'+
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
  judgment,intent:i,conclusion:answer.headline,interpretationVersion:"5.3.0"};
}
g.YiYaoEngineV5={load:()=>old.load(),identify:question,selectUse,evaluate,interpret,version:"5.3.0"};
})(window);
