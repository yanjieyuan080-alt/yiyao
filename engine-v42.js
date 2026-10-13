/* 易爻 V4.2：卦盘事实驱动的解读层。传统象义参考，不预测真实未来。 */
(function(g){"use strict";
const core=g.YiYaoEngineV4;
if(!core)throw Error("请先加载 engine-v4.js");
const POS=["初","二","三","四","五","上"];
const ZEL={子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
const SHENG={木:"火",火:"土",土:"金",金:"水",水:"木"}, KE={木:"土",土:"水",水:"火",火:"金",金:"木"};
const THEMES={
乾:"主动进取，但需把握节奏",坤:"承载配合，重在积累",屯:"起步艰难，宜先整理条件",蒙:"信息未明，先求理解",需:"等待时机，准备条件",讼:"意见分歧，避免争执升级",师:"组织纪律与团队行动",比:"结盟协作、择人而近",小畜:"小幅积累、条件尚待成熟",履:"谨慎行事、尊重边界",泰:"交流通畅、阶段相对顺遂",否:"上下不通、推进受阻",同人:"重视共同目标与协作",大有:"资源较丰、注意合理运用",谦:"克制审慎、以退为进",豫:"积极筹划、警惕松懈",随:"顺应变化、保持原则",蛊:"纠正积弊、处理旧问题",临:"接近事务、承担管理责任",观:"观察全局、审视现状",噬嗑:"处理阻碍、明确规则",贲:"注重呈现，也要看实质",剥:"基础被削弱、宜守住根本",复:"回到正轨、逐步恢复",无妄:"守正行事、不妄动",大畜:"蓄积能力和资源",颐:"滋养与资源供给，注意长期维持",大过:"负担偏重、结构需要调整",坎:"险阻反复、需要谨慎",离:"明辨依附、厘清重点",咸:"感应互动、关系牵引",恒:"持续经营、贵在有恒",遁:"审时退避、保留余地",大壮:"力量增长、忌冒进",晋:"逐渐向前、争取认可",明夷:"光明受抑、宜保护实力",家人:"内部角色与秩序",睽:"分歧各异、求同存异",蹇:"前行受阻、宜借助协作",解:"阻碍舒缓、及时解结",损:"减少消耗、有所取舍",益:"增益资源、把握受益条件",夬:"公开决断、明确取舍",姤:"突遇机会、注意边界",萃:"聚集资源、组织协调",升:"循序渐进、积累向上",困:"资源受限、在压力中寻找出路",井:"长期供给与基础建设",革:"改革旧制、改变方法",鼎:"更新秩序、形成新结构",震:"突发变化、先稳住节奏",艮:"适时止步、厘清边界",渐:"循序推进、逐步形成结果",归妹:"角色与关系安排需合宜",丰:"事项繁盛、注意盛极转变",旅:"处于过渡、保持灵活",巽:"循序渗透、借助沟通",兑:"交流协商、留意言语",涣:"疏解阻隔、重新聚合",节:"节制资源、建立规则",中孚:"互信诚信、兑现承诺",小过:"宜做小范围推进、忌求大成",既济:"阶段完成后仍需维护",未济:"尚未完成、仍待协调"
};
const CONTEXT={
career:{label:"事业与项目",topic:"职责、项目安排与职业方向",roles:{"官鬼":"职位、工作责任与考核","父母":"任务、制度、文书及工作安排","妻财":"报酬与资源兑现","兄弟":"同事、竞争和协作","子孙":"缓解压力、执行产出"},primary:["官鬼","父母"],risk:"核实任务责任、决策权限和执行资源是否同步匹配"},
finance:{label:"收入与财务",topic:"财务机会与资金兑现",roles:{"妻财":"收入与款项","子孙":"生财来源或业务产出","兄弟":"竞争与资源消耗","父母":"合同与支付凭证","官鬼":"风险和约束"},primary:["妻财","子孙"],risk:"核对真实支付条件、现金流与成本"},
relationship:{label:"感情关系",topic:"双方的关系变化",roles:{"官鬼":"传统感情取用线索之一","妻财":"传统感情取用线索之一","父母":"沟通、承诺及外部条件","兄弟":"同辈关系和竞争线索","子孙":"相处状态与情绪缓和"},primary:["官鬼","妻财"],risk:"不能从卦象推断第三人的真实心理；关注实际沟通与双向投入"},
property:{label:"房屋与合同",topic:"房屋、手续或合同进程",roles:{"父母":"房屋、文书与合同","妻财":"交易金额和费用","官鬼":"手续约束与纠纷风险","兄弟":"竞争或共同利益","子孙":"推进与交付"},primary:["父母","妻财"],risk:"核实权属、付款、违约与交付条款"},
cooperation:{label:"合作与竞争",topic:"协作关系与利益安排",roles:{"兄弟":"同伴、竞争与利益关系","妻财":"利益分配和回报","父母":"合同和合作安排","官鬼":"责任、约束与管理","子孙":"实际交付与协作产出"},primary:["兄弟","妻财"],risk:"核实双方资源、权责、收益与退出条件"},
children:{label:"子女与生活",topic:"家庭、兴趣或休养事项",roles:{"子孙":"子女、兴趣及休养象义","父母":"照顾与责任","妻财":"物质条件","兄弟":"同伴支持","官鬼":"压力与阻碍"},primary:["子孙","父母"],risk:"以实际生活情况和参与者的需求为准"},
exam:{label:"考试与录取",topic:"备考、文书与名额",roles:{"父母":"文书、考试资料与录取通知","官鬼":"资格、名位与考核","子孙":"应试状态","兄弟":"竞争者","妻财":"费用和资源"},primary:["父母","官鬼"],risk:"依考试成绩、资格标准与官方通知判断"},
legal:{label:"纠纷与法律",topic:"证据、程序与结果",roles:{"官鬼":"官非、争议与法律约束","父母":"证据和法律文书","妻财":"涉案财产","兄弟":"对方或利益冲突","子孙":"争议缓和"},primary:["官鬼","父母"],risk:"以证据、时效和专业法律意见为准"},
health:{label:"健康（民俗）",topic:"健康话题的传统象义",roles:{"官鬼":"传统病象","子孙":"传统缓解病象","父母":"照护","兄弟":"消耗","妻财":"资源"},primary:["官鬼","子孙"],risk:"不通过卦象诊断病情或推测康复；身体不适应寻求专业医疗评估"},
general:{label:"综合事项",topic:"所问事项的发展",roles:{"官鬼":"责任与约束","父母":"条件和文书","妻财":"资源与收益","兄弟":"协作与消耗","子孙":"产出与舒缓"},primary:["官鬼","父母","妻财"],risk:"补充具体对象和评价标准有助于辨别现实问题"}
};
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const p=s=>"<p>"+esc(s)+"</p>";
function relation(from,to){
 const a=ZEL[from],b=ZEL[to];
 if(!a||!b)return "未知";
 if(a===b)return "同气";
 if(SHENG[a]===b)return "生出";
 if(SHENG[b]===a)return "受生";
 if(KE[a]===b)return "克出";
 if(KE[b]===a)return "受克";
 return "未识别";
}
function backRelation(src,dst){
 const type=relation(dst,src);
 return type==="生出"?"回头生":type==="克出"?"回头克":
 type==="受生"?"动生变":type==="受克"?"动克变":"同气";
}
const position=i=>POS[i]+"爻";
function collect(c,base){
 const intent=base.intent,config=CONTEXT[intent.field]||CONTEXT.general;
 const rows=c.rows,si=c.a.shi-1,ei=c.a.ying-1,self=rows[si],other=rows[ei];
 const moved=rows.filter((r,i)=>c.totals[i]===6||c.totals[i]===9);
 const relevant=rows.filter(r=>config.primary.includes(r.r));
 const signals=[],add=(priority,title,fact,rule,meaning,kind)=>signals.push({priority,title,fact,rule,meaning,kind});
 const selfMove=moved.some(r=>r.i===si),otherMove=moved.some(r=>r.i===ei);
 if(selfMove){
  const back=backRelation(self.gz[1],self.vgz[1]);
  const flavor=back==="回头克"?"变化对原有状态构成制约，需防压力或牵制":
   back==="回头生"?"变化对原有状态形成生扶，可关注资源与支持":
   back==="动生变"?"原有投入转向新状态，需留意精力与资源消耗":
   back==="动克变"?"原有行动对后续变化产生克制，需要审视推进方式":"本人处境存在变化信号";
  add(100,"世爻发动",position(si)+" "+self.gz+self.r+" → "+self.vgz+self.vr+"（"+back+"）","世爻代表占问者；动变与回头生克合参","本人处境是变化焦点；"+flavor,"self_move");
 }else{
  add(35,"世爻静守",position(si)+" "+self.gz+self.r+"持世，未发动","观察本人及其日月条件","当前没有世爻发动信号，不应据此认定本人职位必然改变","self_static");
 }
 for(const r of moved){
  if(r.i===si)continue;
  const back=backRelation(r.gz[1],r.vgz[1]);
  const linked=config.primary.includes(r.r)||config.primary.includes(r.vr);
  const role=config.roles[r.r]||"相关事务";
  const relatedToSelf=relation(r.gz[1],self.gz[1]);
  const effect=back==="回头克"?"有反向制约的象义":back==="回头生"?"有变化反馈生扶的象义":back==="动生变"?"本爻力量向变爻输出":back==="动克变"?"动爻与变化存在制约":"变化前后同气";
  add(linked?85:r.i===ei?78:48,(r.i===ei?"应爻变化":"相关爻发动"),position(r.i)+" "+r.gz+r.r+" → "+r.vgz+r.vr+"（"+back+"；与世爻"+relatedToSelf+"）","以实际动爻、变爻及主用神相关性决定重要程度",role+"出现变化，"+effect+(r.i===ei?"；合作方或外部条件也是变化焦点":""),"moving");
 }
 if(!moved.length)add(70,"六爻安静","六次摇卦均无老阴、老阳","静卦无动爻，不等于事件必不发生","卦内未呈现直接发动的变化；应结合有关用神的静态条件理解","static");
 for(const r of relevant){
  if(c.empty.includes(r.gz[1]))add(66,"有关用神逢空",position(r.i)+" "+r.gz+r.r+"旬空","旬空属于传统条件信息，不等于现实不存在",(config.roles[r.r]||"相关事项")+"有待落实的传统象义，不能据此断言事情一定落空","void");
 }
 for(const r of moved){
  if(r.i===si)continue;
  if(c.empty.includes(r.vgz[1]))add(63,"变爻逢空",position(r.i)+"变"+r.vgz+r.vr+"旬空","变爻空亡需结合动静及日月","变化后条件的兑现尚难确定","void_change");
 }
 const opposing=rows[ei].gz[1],month=c.month.slice(-1),day=c.day.slice(-1);
 const srMonth=relation(month,self.gz[1]),srDay=relation(day,self.gz[1]);
 add(40,"世爻与日月",self.gz+"；月建"+c.month+"（"+srMonth+"），日辰"+c.day+"（"+srDay+"）","方向按月日作用于世爻计算","应同时观察阶段环境和当前条件，不以单一生克决定吉凶","calendar");
 if(c.a.shi!==c.a.ying&&otherMove) add(69,"世应互动",self.gz+"世、"+other.gz+"应；应爻发动","世应代表自身和对方/外部条件","合作关系中的条件可能出现调整，不能据此猜测某个人的想法","relation");
 if(moved.length>1)add(57,"多动爻同时作用",moved.map(r=>position(r.i)+" "+r.gz).join("、"),"多动爻不按个数计分，也不机械映射月份","需要把本人、相关用神与各动爻联系起来，暂不推定连环生克必然结果","multi");
 signals.sort((a,b)=>b.priority-a.priority);
 return {config,self,other,moved,relevant,signals,si,ei,srMonth,srDay};
}
function summarize(c,base,info){
 const {self,moved,relevant,signals,config,si}=info,intent=base.intent;
 const old=c.a.name,changed=c.b.name,theme=THEMES[old]||"需参考卦辞和具体爻位",toTheme=THEMES[changed]||"新的变化仍需结合实际条件";
 const state=moved.length?"从「"+old+"」（"+theme+"）转向「"+changed+"」（"+toTheme+"）":"本卦「"+old+"」六爻安静，传统象义侧重"+theme;
 const key=signals.filter(s=>["self_move","moving","static","void"].includes(s.kind)).slice(0,3);
 const main=key.map(s=>s.meaning).join("；");
 const unfilled=relevant.filter(r=>c.empty.includes(r.gz[1]));
 const momentum=relevant.some(r=>moved.some(m=>m.i===r.i))?"有关用神出现发动信号":"与所问相关的主要六亲未直接发动";
 const restraint=moved.some(r=>r.i===si&&backRelation(r.gz[1],r.vgz[1])==="回头克");
 const opportunity=moved.length===0?"静卦不能推出机会必无":momentum;
 const evidence="关键依据："+key.map(s=>s.fact).join("；")+"。";
 let opening="";
 switch(intent.intent){
  case "new_opportunity":opening="对于是否会出现新机会，"+state+"。"+opportunity+"。"+(unfilled.length?"有关用神逢旬空，传统上有条件暂未坐实的提示。":"")+"卦内信号不足以确定新机会一定出现或具体出现时间。";break;
  case "timing":opening="就你问的发生时间，"+state+"。"+momentum+"，但现有经过校验的规则不足以推出具体日期。不能把爻位当月份。";break;
  case "personal_impact":opening="对你个人的影响，首先看世爻："+position(si)+" "+self.gz+self.r+(moved.some(r=>r.i===si)?"发动化"+self.vgz+self.vr+"（"+backRelation(self.gz[1],self.vgz[1])+"）":"保持静态")+"。"+state+"。重点观察这些变化是否会增加你在"+config.topic+"上的责任、资源或牵制。";break;
  case "accept_decision":opening="对于是否接受或承接，"+state+"。"+momentum+"，需要同时区分事情本身的推进条件与本人承担的代价；不能仅凭此卦宣布必须接或必须拒绝。";break;
  case "comparison":opening="你询问多个对象的比较，"+state+"。当前未为每个对象确立可靠的对应爻位及独立证据，不能仅凭这一卦决定哪个必然更好。";break;
  case "outcome":opening="对所问事项能否达成结果，"+state+"。"+momentum+"；是否成功仍取决于具体条件，卦象不足以给出现实结果的保证。";break;
  case "risk":opening="关于风险，"+state+"。本卦值得重点审视的是："+(main||"动变条件及世应关系")+"。";break;
  case "trend":
  default:opening="关于"+(intent.window&&intent.window!=="未明确时间范围"?intent.window+"内":"接下来")+config.topic+"的走向，"+state+"。"+(main||"仍需留意世应和有关用神的状态")+"。";break;
 }
 if(restraint&&!opening.includes("回头克"))opening+="世爻动化回头克，是对本人所承受的约束和变化成本的提示。";
 const fixed="这是按传统纳甲与《周易》象义作出的条件性解释，不构成对未来事件的可靠预测。";
 const highlight=signals.filter(s=>["self_move","moving"].includes(s.kind)).slice(0,2).map(s=>s.fact+"："+s.meaning).join("；");
 const aux=base.lineTexts.map(t=>position(t.position-1)+"「"+t.text+"」").join("；");
 const paragraph=highlight?highlight+"。":moved.length?"本卦有动爻，但需要核对其与世爻及具体用神的联系。":"静卦无直接动爻线索，不能据此断言机会或变化必定没有。";
 const answer=opening+(paragraph? "\n"+paragraph:"")+"\n"+(aux?"动爻爻辞："+aux+"。":"")+"现实上建议："+config.risk+"。";
 return {answer,state,evidence,heading:opening,conclusion:opening,limit:fixed};
}
function interpret(c){
 const base=core.interpret(c);
 const info=collect(c,base),story=summarize(c,base,info),intent=base.intent;
 const detail=info.signals.map(x=>'<div class="v42-evidence"><strong>'+esc(x.title)+'</strong>'+p("卦盘事实："+x.fact)+p("传统规则："+x.rule)+p("解释："+x.meaning)+'</div>').join("");
 const lineText=base.lineTexts.length?base.lineTexts.map(l=>p(position(l.position-1)+"："+l.text)).join(""):p("无动爻。本卦不据此断定事件必不发生。");
 const html='<div class="focus-report" data-engine="4.2"><div class="section-title">问题与分析范围</div>'+p(intent.question+"｜"+intent.fieldName+"｜"+intent.intent+"｜"+intent.window)+
 '<div class="section-title">直接回答</div>'+story.answer.split("\n").map(p).join("")+
 '<div class="section-title">本卦、变卦与卦辞</div>'+p(c.a.name+" → "+c.b.name+"；动爻："+(info.moved.map(r=>position(r.i)).join("、")||"无")+"；卦辞："+core.verify(c).origin.judgment)+
 '<div class="section-title">决定分析重点的卦盘依据</div>'+detail+
 '<div class="section-title">动爻经文（原文）</div>'+lineText+
 ((intent.intent==="timing"||intent.intent==="trend")?'<div class="section-title">时间判断边界</div>'+p("暂无经独立验证的传统应期依据，不能据此推断某月某日必然发生相关事件。"):"")+
 '<div class="section-title">现实核验与风险</div>'+p(info.config.risk)+
 '<p class="sub">易爻 V4.2：规则可追溯的传统文化辅助解读。伏神飞神、复杂旺衰、墓绝及多动连环作用尚未达到专业完整验收；健康、法律和重大财务问题以现实证据和专业意见为准。本工具不提供可靠的未来预测。</p></div>';
 const result={...base,html,answer:story.answer,signals:info.signals,conclusion:story.conclusion,interpretationVersion:"4.2.0"};
 if(info.self.r!=="官鬼"&&/官鬼持世/.test(result.answer+result.html))throw Error("结论与卦盘冲突：并非官鬼持世");
 if(info.self.r!=="兄弟"&&/兄弟持世/.test(result.answer+result.html))throw Error("结论与卦盘冲突：并非兄弟持世");
 return result;
}
g.YiYaoEngineV42={load:()=>core.load(),verify:c=>core.verify(c),identify:q=>core.identify(q),interpret,version:"4.2.0"};
})(window);
