
'use strict';
const $=id=>document.getElementById(id), GAN='甲乙丙丁戊己庚辛壬癸'.split(''), ZHI='子丑寅卯辰巳午未申酉戌亥'.split('');
const els={木:'木',火:'火',土:'土',金:'金',水:'水'}, zEl={子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
const sheng={木:'火',火:'土',土:'金',金:'水',水:'木'}, ke={木:'土',土:'水',水:'火',火:'金',金:'木'};
const trig={乾:{b:[1,1,1],el:'金',gan:['甲','壬'],zhi:['子','寅','辰','午','申','戌']},兑:{b:[1,1,0],el:'金',gan:['丁','丁'],zhi:['巳','卯','丑','亥','酉','未']},离:{b:[1,0,1],el:'火',gan:['己','己'],zhi:['卯','丑','亥','酉','未','巳']},震:{b:[1,0,0],el:'木',gan:['庚','庚'],zhi:['子','寅','辰','午','申','戌']},巽:{b:[0,1,1],el:'木',gan:['辛','辛'],zhi:['丑','亥','酉','未','巳','卯']},坎:{b:[0,1,0],el:'水',gan:['戊','戊'],zhi:['寅','辰','午','申','戌','子']},艮:{b:[0,0,1],el:'土',gan:['丙','丙'],zhi:['辰','午','申','戌','子','寅']},坤:{b:[0,0,0],el:'土',gan:['乙','癸'],zhi:['未','巳','卯','丑','亥','酉']}};
const names={'乾乾':'乾为天','乾兑':'天泽履','乾离':'天火同人','乾震':'天雷无妄','乾巽':'天风姤','乾坎':'天水讼','乾艮':'天山遁','乾坤':'天地否','兑乾':'泽天夬','兑兑':'兑为泽','兑离':'泽火革','兑震':'泽雷随','兑巽':'泽风大过','兑坎':'泽水困','兑艮':'泽山咸','兑坤':'泽地萃','离乾':'火天大有','离兑':'火泽睽','离离':'离为火','离震':'火雷噬嗑','离巽':'火风鼎','离坎':'火水未济','离艮':'火山旅','离坤':'火地晋','震乾':'雷天大壮','震兑':'雷泽归妹','震离':'雷火丰','震震':'震为雷','震巽':'雷风恒','震坎':'雷水解','震艮':'雷山小过','震坤':'雷地豫','巽乾':'风天小畜','巽兑':'风泽中孚','巽离':'风火家人','巽震':'风雷益','巽巽':'巽为风','巽坎':'风水涣','巽艮':'风山渐','巽坤':'风地观','坎乾':'水天需','坎兑':'水泽节','坎离':'水火既济','坎震':'水雷屯','坎巽':'水风井','坎坎':'坎为水','坎艮':'水山蹇','坎坤':'水地比','艮乾':'山天大畜','艮兑':'山泽损','艮离':'山火贲','艮震':'山雷颐','艮巽':'山风蛊','艮坎':'山水蒙','艮艮':'艮为山','艮坤':'山地剥','坤乾':'地天泰','坤兑':'地泽临','坤离':'地火明夷','坤震':'地雷复','坤巽':'地风升','坤坎':'地水师','坤艮':'地山谦','坤坤':'坤为地'};
const palaces={乾:['乾为天','天风姤','天山遁','天地否','风地观','山地剥','火地晋','火天大有'],兑:['兑为泽','泽水困','泽地萃','泽山咸','水山蹇','地山谦','雷山小过','雷泽归妹'],离:['离为火','火山旅','火风鼎','火水未济','山水蒙','风水涣','天水讼','天火同人'],震:['震为雷','雷地豫','雷水解','雷风恒','地风升','水风井','泽风大过','泽雷随'],巽:['巽为风','风天小畜','风火家人','风雷益','天雷无妄','火雷噬嗑','山雷颐','山风蛊'],坎:['坎为水','水泽节','水雷屯','水火既济','泽火革','雷火丰','地火明夷','地水师'],艮:['艮为山','山火贲','山天大畜','山泽损','火泽睽','天泽履','风泽中孚','风山渐'],坤:['坤为地','地雷复','地泽临','地天泰','雷天大壮','泽天夬','水天需','水地比']};
const position=['初爻','二爻','三爻','四爻','五爻','上爻'], stages=['本宫','一世','二世','三世','四世','五世','游魂','归魂'], beasts=['青龙','朱雀','勾陈','螣蛇','白虎','玄武'];
function relation(home,other){if(home===other)return '兄弟';if(sheng[home]===other)return '子孙';if(sheng[other]===home)return '父母';if(ke[home]===other)return '妻财';return '官鬼'}
function triOf(b){return Object.keys(trig).find(k=>trig[k].b.join('')===b.join(''))}
function detail(bits){let inner=triOf(bits.slice(0,3)),outer=triOf(bits.slice(3)),name=names[outer+inner], palace=Object.keys(palaces).find(k=>palaces[k].includes(name)),idx=palaces[palace].indexOf(name),shi=[6,1,2,3,4,5,4,3][idx],ying=((shi+2)%6)+1;return {inner,outer,name,palace,idx,shi,ying,home:trig[palace].el}}
function na(bits,i){let t=trig[triOf(bits.slice(i<3?0:3,i<3?3:6))],j=i<3?i:i;return t.gan[i<3?0:1]+t.zhi[j]}
function zoneParts(d,zone){const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(d).filter(x=>x.type!=='literal').map(x=>[x.type,Number(x.value)]));return p}
function stemTime(zone,d){if(typeof Solar==='undefined')throw Error('历法组件加载失败，请检查网络连接后重试。');const p=zoneParts(d,zone); // 子初换日：23时以次日干支作日柱
let cal=Solar.fromYmdHms(p.year,p.month,p.day,p.hour,p.minute,p.second).getLunar(),ec=cal.getEightChar();ec.setSect(1);
return {parts:p,year:ec.getYear(),month:ec.getMonth(),day:ec.getDay(),hour:ec.getTime(),date:`${p.year}年${p.month}月${p.day}日 ${String(p.hour).padStart(2,'0')}:${String(p.minute).padStart(2,'0')}`,zone}}
function xunkong(day){let g=GAN.indexOf(day[0]),z=ZHI.indexOf(day[1]);let start=(z-g+12)%12;return [ZHI[(start+10)%12],ZHI[(start+11)%12]]}
function randomCoin(){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%2?3:2}
function coins(){if(document.querySelector('input[name="method"]:checked').value==='coins')return Array.from({length:6},()=>Array.from({length:3},randomCoin));let s=$('manual').value.match(/[23]{3}/g)||[];if(s.length!==6 || $('manual').value.replace(/[23\s,，、;；]/g,'').trim())throw Error('请填写六组钱面数字，每组必须是三位 2 或 3，例如：223 332 222 233 323 333。');return s.map(x=>x.split('').map(Number))}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function renderLines(bits,moves){return `<div class="lines">${bits.map((b,i)=>({b,i})).reverse().map(({b,i})=>`<div class="line ${b?'yang':'yin'}">${b?'<span></span>':'<span></span><span></span>'}${moves&&moves[i]?'<i>✦</i>':''}</div>`).join('')}</div>`}
function pct(s){return `<strong>${s}</strong>`}
function influence(branch,target){const opposite={子:'午',丑:'未',寅:'申',卯:'酉',辰:'戌',巳:'亥',午:'子',未:'丑',申:'寅',酉:'卯',戌:'辰',亥:'巳'}, pairs={子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午'};if(branch===target)return '临';if(opposite[branch]===target)return '冲';if(pairs[branch]===target)return '合';if(sheng[zEl[branch]]===zEl[target])return '生';if(ke[zEl[branch]]===zEl[target])return '克';if(sheng[zEl[target]]===zEl[branch])return '泄';if(ke[zEl[target]]===zEl[branch])return '耗';return '同气'}

const YI6=(function(){
 const E={木:"火",火:"土",土:"金",金:"水",水:"木"}, K={木:"土",土:"水",水:"火",火:"金",金:"木"};
 const clash={子:"午",丑:"未",寅:"申",卯:"酉",辰:"戌",巳:"亥",午:"子",未:"丑",申:"寅",酉:"卯",戌:"辰",亥:"巳"};
 const combine={子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午"};
 const esc=escapeHTML;
 let classic=null;
 const domains={
  health:["健康", "世爻、官鬼与子孙只作民俗象义；不进行医学预测"],
  legal:["诉讼纠纷","官鬼、父母、世应及证据材料"],
  exam:["考试录取","父母文书、官鬼名位与世爻"],
  property:["房屋合同","父母为主，财爻及世应为辅"],
  finance:["薪酬财务","妻财为主，世爻、官鬼与父母为辅"],
  romance:["感情","世应关系及实际对象，不能确认他人心理"],
  social:["朋友社交","兄弟、世应与动变，不能直接断人物意图"],
  business:["合作经营","世应、兄弟、财爻与父母"],
  children:["子女休闲","子孙为主，兼看实际对象"],
  career:["事业项目","官鬼与世爻，按升职、成果、去留分别取用"],
  general:["整体问题","世爻及具体事项；问题过宽时不强断"]
 };
 function intent(q,manual){
  const s=String(q||"").trim(),x=s.replace(/\s/g,"");if(!x)return {ok:false,error:"请先输入具体问题"};
  let domain=/症状|生病|健康|身体|怀孕|胎儿/.test(x)?"health":/官司|诉讼|法律|法院|仲裁/.test(x)?"legal":/考试|考研|考公|考证|录取/.test(x)?"exam":/房子|买房|卖房|租房|合同|签约|证件|搬家/.test(x)?"property":/工资|薪水|加薪|涨薪|收入|回款|货款|投资|财运|盈利|奖金/.test(x)?"finance":/恋爱|复合|感情|伴侣|婚姻|分手|男朋友|女朋友/.test(x)?"romance":/交朋友|新朋友|友谊|友情|结识朋友|社交|朋友/.test(x)?"social":/合作|合伙|伙伴|加盟商|利益分配/.test(x)?"business":/子女|孩子|休养|兴趣|爱好/.test(x)?"children":/工作|事业|职位|升职|晋升|离职|公司|项目|职业|领导/.test(x)?"career":"general";
  const m={career:"career",money:"finance",relationship:"romance",house:"property",friends:"social",children:"children",health:"health"};
  if(manual&&manual!=="auto"&&m[manual]&&domain==="general")domain=m[manual];
  const subtype=/升职|晋升|提拔|升迁/.test(x)?"promotion":/工资.*(涨|升|增加)|加薪|涨薪|涨工资/.test(x)?"salary":/公司.*(待多久|呆多久|干多久|留多久|什么时候离开)|工作.*(待多久|呆多久)/.test(x)?"tenure":/新朋友|交新朋友|认识朋友/.test(x)?"new_friends":/新项目|新的项目|新机会|新工作/.test(x)&&/有没有|会不会|还会|未来|接下来|能否/.test(x)?"new_opportunity":/项目.*(出结果|出成果|有效果|达成)/.test(x)?"project_result":"general";
  const when=/什么时候|何时|多久|哪天|几号|几月/.test(x);
  const period=x.match(/(?:未来|接下来|近|以后|今后)(?:的)?(?:\d+|[一二两三四五六七八九十半]+)(?:个)?(?:天|周|月|年)/)?.[0]||"";
  const choice=/该不该|要不要|应不应该|应该接|接不接|是否接受|值得不值得/.test(x);
  const compare=/哪个更|对比|比较|A项目.*B项目/i.test(x);
  const impact=/对我.*影响|给我带来什么/.test(x);
  const risk=/风险|隐患|阻碍/.test(x);
  const newOpportunity=subtype==="new_opportunity"||subtype==="new_friends";
  const timeOutcome=!!period&&/会不会|能不能|是否|能否|会.*吗/.test(x)&&!newOpportunity;
  const type=compare?"comparison":choice?"decision":newOpportunity?"new_opportunity":when?"timing":timeOutcome?"outcome":impact?"impact":risk?"risk":/未来|接下来|发展|走向|趋势|会怎么样/.test(x)?"trend":/会不会|能否|可以吗|能不能|有吗|有没有/.test(x)?"outcome":"outcome";
  return {ok:true,question:s,domain,domainName:domains[domain][0],subtype,type,period,criteria:domains[domain][1]};
 }
 function effect(a,b){const ae=zEl[a],be=zEl[b];if(a===b)return "同支";if(clash[a]===b)return "相冲";if(combine[a]===b)return "相合";if(ae===be)return "同五行";if(E[ae]===be)return a+"生"+b+"，"+a+"泄气";if(E[be]===ae)return b+"生"+a+"，"+a+"受生";if(K[ae]===be)return a+"克"+b+"，"+b+"受克";if(K[be]===ae)return b+"克"+a+"，"+a+"受克";return "需另查";
 }
 function inspect(c,p){
  const sh=c.rows[c.a.shi-1],yh=c.rows[c.a.ying-1],moving=c.rows.filter(r=>c.moves[r.i]);
  const target=p.subtype==="salary"||p.domain==="finance"?"妻财":p.subtype==="new_friends"||p.domain==="social"?"兄弟":p.domain==="property"||p.domain==="exam"?"父母":p.domain==="career"?"官鬼":p.domain==="children"?"子孙":null;
  const targets=target?c.rows.filter(r=>r.r===target):[];
  let focal=targets.find(r=>r.i===sh.i)||targets.find(r=>c.moves[r.i])||(targets.length===1?targets[0]:null);
  const facts=[],push=(id,kind,label,interpretation)=>facts.push({id,kind,label,interpretation});
  push("world","base","世爻："+sh.gz+sh.r+"；月建"+c.month+"对世："+effect(c.month,sh.gz[1])+"；日辰"+c.day+"对世："+effect(c.day,sh.gz[1]),"代表本人的卦内条件，不是现实已发生的事件");
  push("response","base","应爻："+yh.gz+yh.r+"；世应："+effect(sh.gz[1],yh.gz[1]),"代表与外部条件的传统关系，不能推断某人意图");
  if(targets.length)push("targets","use",target+"共"+targets.length+"处："+targets.map(r=>position[r.i]+r.gz+(r.empty?"（空）":"")).join("，"),"主用神必须结合旺衰和动变确定；多现不能随意确定唯一对象");
  else push("hidden","limit","本卦未明现"+(target||"唯一对象用神"),"伏神飞神尚未独立完成验收，不以缺失断凶吉");
  for(const r of moving){
   const back=E[zEl[r.vgz[1]]]===zEl[r.gz[1]]?"回头生":K[zEl[r.vgz[1]]]===zEl[r.gz[1]]?"回头克":E[zEl[r.gz[1]]]===zEl[r.vgz[1]]?"动生变":K[zEl[r.gz[1]]]===zEl[r.vgz[1]]?"动克变":"同类/其他";
   push("move"+r.i,"moving",position[r.i]+r.gz+r.r+"→"+r.vgz+r.vr+"："+back+"；与世："+effect(r.gz[1],sh.gz[1])+(r.empty?"；本爻旬空":"")+(c.empty.includes(r.vgz[1])?"；变爻旬空":""),"动变提供变化线索，但必须结合所问用神及日月");
  }
  if(focal)push("focal","focus","主要观察："+position[focal.i]+focal.gz+focal.r+"，月建作用："+effect(c.month,focal.gz[1])+"，日辰作用："+effect(c.day,focal.gz[1])+(focal.empty?"；旬空":""),"与所问相关的主要用神，作用方向在上方明确列出");
  const restrictions=[];
  if(focal){
   if(clash[c.day]===focal.gz[1])restrictions.push("用神受日辰相冲");
   if(clash[c.month]===focal.gz[1])restrictions.push("用神逢月破");
   if(K[zEl[c.day]]===zEl[focal.gz[1]])restrictions.push("日辰克用神");
   if(K[zEl[c.month]]===zEl[focal.gz[1]])restrictions.push("月建克用神");
   if(focal.empty)restrictions.push("用神旬空");
   if(c.moves[focal.i]&&K[zEl[focal.vgz[1]]]===zEl[focal.gz[1]])restrictions.push("用神发动化回头克");
  }
  const support=[];
  if(focal){
   if(E[zEl[c.day]]===zEl[focal.gz[1]])support.push("日辰生用神");
   if(E[zEl[c.month]]===zEl[focal.gz[1]])support.push("月建生用神");
   if(c.day===focal.gz[1])support.push("用神临日");
   if(c.month===focal.gz[1])support.push("用神临月");
   if(c.moves[focal.i]&&E[zEl[focal.vgz[1]]]===zEl[focal.gz[1]])support.push("用神动化回头生");
  }
  return {sh,yh,moving,target,targets,focal,facts,restrictions,support,uncertain:(!focal||targets.length>1&& !targets.some(r=>c.moves[r.i])||moving.length>1)};
 }
 function answer(c,p,j){
  const quiet=j.moving.length===0,restrict=j.restrictions.length,support=j.support.length;
  let conclusion="";
  if(p.domain==="health")conclusion="身体状况不能通过卦象作诊断、治疗或康复判断。请根据症状、检查及医疗意见处理。";
  else if(p.subtype==="tenure")conclusion="这卦不能可靠推出你将在现公司待多少个月，也没有足够依据认定近期一定离开或长期留任。"+(quiet?"六爻安静，只能说明本次没有直接动变线索。":"卦中有动变，但不能将动爻机械换算成离职日期。");
  else if(p.subtype==="new_friends")conclusion="关于"+(p.period||"接下来")+"会不会结识新朋友："+(j.target&&j.targets.length===0?"本卦未明现兄弟用神，伏神尚待校核；":"")+"可以看到个人与外部交往的卦内状态，但现有规则不足以确定新朋友一定出现或不会出现，不能推断具体人数。";
  else if(p.subtype==="project_result")conclusion="你问的是项目什么时候取得业务成果，不是工作职位何时变动。"+(restrict?"与成果相关的用神存在传统制约因素；":"")+(j.moving.length?"卦中确有动变，但动爻并不自动对应营业额、订单或完成日期。":"本卦没有直接动变信号。")+"在未明确“成果”指营收、拉新、交付还是复购前，不能选定唯一用神并推断应期。";
  else if(p.subtype==="promotion")conclusion="关于"+(p.period||"接下来")+"能否正式晋升，"+(restrict&&support?"官鬼用神同时存在支持和制约，当前证据不支持肯定断言；":restrict?"职位用神存在"+j.restrictions.join("、")+"等制约，近期晋升的传统信号偏弱；":support?"官鬼用神得到"+j.support.join("、")+"等支持，存在积极象义，但不能认定任命必然发生；":"目前缺乏明确的职级变动证据，不能肯定或否定晋升。")+(p.type==="timing"?"现有应期规则不足以推定具体月份。":"");
  else if(p.subtype==="salary")conclusion="关于"+(p.period||"接下来")+"工资是否会涨，"+(restrict?"妻财用神有"+j.restrictions.join("、")+"等制约；":support?"财爻有"+j.support.join("、")+"等生扶；":"")+(j.moving.some(r=>r.r==="妻财")?"财爻发动，存在直接变化象义；":"财爻没有直接发动，不能据此认定已进入调薪兑现阶段；")+"因此暂不能断定期限内必然涨薪。";
  else if(p.subtype==="new_opportunity")conclusion="你问的是未来会不会出现新的项目机会，而不是接不接现有项目。"+(j.moving.some(r=>r.r==="官鬼"||r.vr==="官鬼")?"工作相关爻有发动或动化信号，但不等于新项目已经分配。":"目前缺少直接的工作机会发动信号；这不能推出今后不会有新项目。");
  else if(p.type==="timing")conclusion="你问的是"+(p.question.includes("项目")?"项目成果":"所问事项")+"何时发生。当前缺少已经核验的应期证据，不能给出月份，更不能把动爻数当月份；"+(quiet?"静卦并不等于永远不会发生。":"还需要先确认事件是否具备实现条件。");
  else if(p.type==="trend")conclusion="关于"+(p.period||"接下来")+"的"+p.domainName+"发展：本卦「"+c.a.name+"」变「"+c.b.name+"」，"+(restrict&&support?"用神有生扶也有制约；":restrict?"主用神有制约因素；":support?"主用神有生扶因素；":"缺少可直接定向的用神条件；")+"目前只可作为传统象义观察，不能直接推断现实结果。";
  else conclusion="针对「"+p.question+"」，"+(restrict?"卦内存在"+j.restrictions.join("、")+"；":"")+(support?"也存在"+j.support.join("、")+"；":"")+"尚不能依据已经核验的规则确认具体结果。";
  const why=[...j.facts.filter(x=>["focal","hidden"].includes(x.id)),...j.facts.filter(x=>x.kind==="moving"),...j.facts.filter(x=>x.kind==="base")].slice(0,5);
  const risk=p.domain==="finance"?"现实要核实实际工资结构、考核周期及是否有明确调薪通知。":p.domain==="career"?"现实要核实项目验收口径、负责人、资源及岗位考核节点。":p.domain==="social"?"结识新朋友更应观察真实相处、双方互动是否持续，不涉及商业收益分配。":p.domain==="romance"?"以双方实际沟通、边界和行动为依据，不能用卦象证明对方心理。":p.domain==="property"?"核实产权、合同义务、付款与交付条件。":p.domain==="health"?"身体问题请依据医学检查，不要以卦代诊。":"观察具体事项的现实进展，不能将卦象直接当作确定事实。";
  return {conclusion,why,risk};
 }
 async function load(){if(classic)return;let res=await fetch("./data/classics.json?v=6.0",{cache:"no-store"});if(!res.ok)throw Error("卦辞库加载失败");const j=await res.json();if(Object.keys(j.hexagrams||{}).length!==64||Object.values(j.hexagrams).some(x=>x.lines?.length!==6))throw Error("卦辞库校验失败");classic=j.hexagrams;}
 function interpret(c){
  if(!classic)throw Error("请先加载卦辞数据");
  const p=intent(c.question,c.requestedDomain);if(!p.ok)throw Error(p.error);
  const ord=["乾","兑","离","震","巽","坎","艮","坤"];
  const key=x=>(ord.indexOf(x.outer)+1)+","+(ord.indexOf(x.inner)+1);
  if(!Array.isArray(c.totals)||c.totals.length!==6||!Array.isArray(c.bits)||c.bits.length!==6||!Array.isArray(c.changed)||c.changed.length!==6)throw Error("六爻原始数据不完整");
  const original=detail(c.bits),transformed=detail(c.changed);
  if(original.name!==c.a.name||transformed.name!==c.b.name||original.palace!==c.a.palace||original.shi!==c.a.shi||original.ying!==c.a.ying)throw Error("卦名、八宫、世应与实际摇卦不一致，已停止解读");
  const a=classic[key(c.a)],b=classic[key(c.b)];
  if(!a||!b||a.name!==c.a.name||b.name!==c.b.name)throw Error("独立64卦数据库与排盘冲突，停止解读");
  if(!c.totals.every((n,i)=>[6,7,8,9].includes(n)&&n===c.throwing[i].reduce((u,v)=>u+v,0)&&c.bits[i]===n%2&&c.changed[i]===(n===6||n===9?1-n%2:n%2)&&c.moves[i]===(n===6||n===9)))throw Error("原始钱面与阴阳变爻不一致");
  const expectedEmpty=xunkong(c.t.day);
  if(expectedEmpty.join("")!==c.empty.join(""))throw Error("旬空与日柱不符");
  const originalRows=c.bits.map((v,i)=>{const gz=na(c.bits,i),vgz=na(c.changed,i);return {gz,vgz,r:relation(c.a.home,zEl[gz[1]]),vr:relation(c.a.home,zEl[vgz[1]])};});
  for(let i=0;i<6;i++){const x=originalRows[i],r=c.rows[i];if(!r||r.gz!==x.gz||r.vgz!==x.vgz||r.r!==x.r||r.vr!==x.vr||r.empty!==c.empty.includes(r.gz[1]))throw Error("第"+(i+1)+"爻纳甲、六亲或旬空冲突");}
  const j=inspect(c,p),h=answer(c,p,j),moving=j.moving;
  const ed=moving.map(r=>"<p><b>"+position[r.i]+"："+esc(a.lines[r.i])+"</b><br>"+esc(j.facts.find(x=>x.id==="move"+r.i)?.label||"")+"</p>").join("");
  const html='<div class="focus-report"><div class="section-title">直接回答 · '+esc(p.domainName)+'</div><p class="v5-lead"><strong>'+esc(h.conclusion)+'</strong></p>'+
   '<p class="sub">问题识别：'+esc(p.subtype+" / "+p.type)+(p.period?" ｜时间范围："+esc(p.period):"")+'</p>'+
   '<div class="section-title">为什么这样判断</div>'+h.why.map(x=>"<p><b>"+esc(x.label)+"</b><br>"+esc(x.interpretation)+"</p>").join("")+
   '<div class="section-title">本卦、变卦与动爻</div><p>'+esc(c.a.name)+" → "+esc(c.b.name)+"。本卦卦辞："+esc(a.judgment)+'</p>'+(ed||'<p>六爻安静，静卦不等于事情永远没有变化。</p>')+
   '<div class="section-title">可检查的用神关系</div><p>分析主线：'+esc(p.criteria)+'。</p><p>有利信号：'+esc(j.support.join("；")||"暂无经过确认的直接信号")+'</p><p>制约信号：'+esc(j.restrictions.join("；")||"暂无经过确认的直接信号")+'</p>'+
   '<div class="section-title">现实核验与时间限制</div><p>'+esc(h.risk)+'</p><p>传统应期未经完整验收，不能推定确定日期或未来具体人物行为。</p>'+
   '<p class="sub">易爻 V6.0 重写测试版：仅作为民俗文化辅助分析。伏神飞神、综合旺衰、多爻连锁作用尚未达到独立专业验收；健康、法律与财务事项以现实证据和专业意见为准。</p></div>';
  return {ok:true,html,answer:h.conclusion,parsed:p,evidence:j.facts};
 }
 return {load,interpret,intent,inspect,effect};
})();
window.YiYaoEngineV6=YI6;
async function cast(){const btn=$('cast');btn.disabled=true;btn.textContent='正在校验卦盘…';$('error').textContent='正在处理，请稍候…';try{if(!window.YiYaoEngineV6)throw Error('新版解卦引擎未加载，请刷新网页');await Promise.race([window.YiYaoEngineV6.load(),new Promise((_,reject)=>setTimeout(()=>reject(Error('数据加载超时：请检查网络或GitHub Pages部署')),8000))]);let question=$('question').value.trim();if(!question)throw Error('请先输入你想问的事情。');const t=stemTime($('timezone').value,new Date()),throwing=coins(),totals=throwing.map(a=>a.reduce((s,x)=>s+x,0)),bits=totals.map(v=>v%2),moves=totals.map(v=>v===6||v===9),changed=bits.map((x,i)=>moves[i]?1-x:x),a=detail(bits),b=detail(changed),empty=xunkong(t.day),ganStart=({甲:0,乙:0,丙:1,丁:1,戊:2,己:3,庚:4,辛:4,壬:5,癸:5})[t.day[0]];
const rows=bits.map((v,i)=>{let gz=na(bits,i),vgz=na(changed,i);return {i,gz,vgz,r:relation(a.home,zEl[gz[1]]),vr:relation(a.home,zEl[vgz[1]]),empty:empty.includes(gz[1]),animal:beasts[(ganStart+i)%6]}});
$('time').innerHTML=[t.date,t.zone,`${t.year}年 · ${t.month}月 · ${t.day}日 · ${t.hour}时`,`旬空：${empty.join('')}空`].map(x=>`<span class="pill">${escapeHTML(x)}</span>`).join('');$('topic').textContent=`所问：${question}`;
$('hexes').innerHTML=`<div class="hexbox"><div class="sub">本卦</div><div class="hexname">${a.name}</div>${renderLines(bits,moves)}<div class="sub">${a.outer}上 · ${a.inner}下</div></div><div class="hexbox"><div class="sub">变卦</div><div class="hexname">${b.name}</div>${renderLines(changed)}<div class="sub">${b.outer}上 · ${b.inner}下</div></div>`;
$('movement').textContent=moves.some(Boolean)?'动爻：'+moves.map((x,i)=>x?position[i]:null).filter(Boolean).join('、'):'六爻安静 · 无动爻（变卦同本卦）';
$('tossTable').innerHTML=rows.map(({i})=>`<tr class="${moves[i]?'moving':''}"><td>${position[i]}</td><td>${throwing[i].join(' + ')}</td><td>${totals[i]}</td><td>${bits[i]?'阳':'阴'}${moves[i]?'（老）':'（少）'}</td><td>${bits[i]?'⚊':'⚋'} ${totals[i]===6?'×':totals[i]===9?'○':''}</td></tr>`).join('');
$('palace').innerHTML=`<span class="pill">${a.palace}宫 · 五行${a.home}</span><span class="pill">${stages[a.idx]}</span><span class="pill">世在${position[a.shi-1]} · 应在${position[a.ying-1]}</span>`;
$('chartTable').innerHTML=rows.slice().reverse().map(r=>{let i=r.i;return `<tr class="${moves[i]?'moving':''}"><td>${position[i]}</td><td>${bits[i]?'⚊':'⚋'} → ${changed[i]?'⚊':'⚋'}</td><td>${r.gz}（${zEl[r.gz[1]]}）</td><td>${r.r}</td><td>${i+1===a.shi?'世':i+1===a.ying?'应':'—'}</td><td>${r.animal}</td><td>${r.empty?'空':'—'}</td><td>${moves[i]?`${totals[i]===6?'老阴×':'老阳○'} → ${r.vgz}（${r.vr}）`:'静'}</td></tr>`}).join('');
const k=choice(question,$('kind').value),world=rows[a.shi-1],respond=rows[a.ying-1],month=t.month[1],day=t.day[1];
const engineInput={question,t,throwing,totals,bits,moves,changed,a,b,rows,empty,k,world,respond,month,day,requestedDomain:$('kind').value};
const out=window.YiYaoEngineV6.interpret(engineInput);
if(!out||!out.html)throw Error('解卦引擎没有返回结果');
$('reading').innerHTML=out.html;
$('output').classList.add('show');
$('output').scrollIntoView({behavior:'smooth',block:'start'});
window.lastReading={question,t,throwing,html:$('output').innerText};
}catch(e){$('error').textContent=e.message||'排盘失败，请检查输入后重试。';console.error('易爻起卦失败',e);window.alert('起卦未完成：'+(e.message||e));}finally{btn.disabled=false;btn.textContent='起卦 · 见其所象';}}
window.addEventListener('error',e=>{const el=document.getElementById('error');if(el)el.textContent='页面脚本异常：'+(e.message||'未知错误')});
document.querySelectorAll('input[name="method"]').forEach(x=>x.addEventListener('change',()=>{$('manualBox').style.display=x.value==='manual'&&x.checked?'block':'none'}));$('cast').onclick=cast;$('again').onclick=()=>{window.scrollTo({top:0,behavior:'smooth'})};$('copy').onclick=async()=>{if(!window.lastReading)return;try{await navigator.clipboard.writeText(window.lastReading.html);$('copy').textContent='已复制'}catch(e){$('copy').textContent='复制失败，请手动选择文本'}};
