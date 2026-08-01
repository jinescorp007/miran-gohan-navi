
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const allergens = {
  wheat:{label:"小麦",test:"3.30 / クラス2",words:["小麦","小麦粉","パン","バンズ","うどん","ラーメン","麺","パスタ","ピザ","餃子","パン粉","衣","天ぷら","フライ","カツ","ルー","クッキー","ケーキ","醤油"]},
  peanut:{label:"ピーナッツ",test:"16.77 / クラス3",words:["ピーナッツ","ピーナツ","落花生","花生","ピーナッツバター","担々","サテ"]},
  soy:{label:"大豆",test:"6.41 / クラス3",words:["大豆","豆腐","油揚げ","納豆","味噌","醤油","しょうゆ","きな粉","豆乳","おから","枝豆"]},
  rice:{label:"米",test:"2.69 / クラス2",words:["米","白米","ご飯","ごはん","ライス","おにぎり","寿司","米粉","せんべい"]},
  kiwi:{label:"キウイ",test:"0.51 / クラス1",words:["キウイ"]},
  sesame:{label:"ごま",test:"0.45 / クラス1",words:["ごま","ゴマ","胡麻","ごま油"]},
  egg:{label:"卵白",test:"0.39 / クラス1",words:["卵","玉子","たまご","マヨネーズ","カスタード"]},
  tuna:{label:"マグロ",test:"0.36 / クラス1",words:["マグロ","まぐろ","鮪","ツナ"]}
};

const defaultSettings = {
  wheat:"observed", peanut:"check", soy:"check", rice:"observed",
  kiwi:"check", sesame:"check", egg:"check", tuna:"check"
};

let settings = {...defaultSettings, ...(JSON.parse(localStorage.getItem("miranSettingsV4") || "null") || {})};

const starterFoods = [
  {id:"rice",name:"炊いた白ご飯",brand:"",category:"staple",scene:["home","school"],liking:4,eaten:20,noSymptom:20,mild:0,strong:0,lastDate:"2026-07-31",lastMemo:"日常的に食べており症状なし",minutes:5},
  {id:"senbei",name:"せんべい",brand:"商品ごとに確認",category:"snack",scene:["home","convenience"],liking:5,eaten:5,noSymptom:5,mild:0,strong:0,lastDate:"2026-08-01",lastMemo:"米原料だが症状なし。商品別に原材料確認",minutes:0},
  {id:"gummy",name:"グミ",brand:"商品ごとに確認",category:"snack",scene:["home","convenience"],liking:5,eaten:3,noSymptom:3,mild:0,strong:0,lastDate:"2026-08-01",lastMemo:"好き。メーカー・商品別に記録",minutes:0},
  {id:"mcd-cheese",name:"チーズバーガー",brand:"マクドナルド",category:"meal",scene:["restaurant"],liking:5,eaten:5,noSymptom:5,mild:0,strong:0,lastDate:"2026-08-01",lastMemo:"パン部分も一緒に食べて症状なし",minutes:0},
  {id:"mcd-fries",name:"フライドポテト",brand:"マクドナルド",category:"staple",scene:["restaurant"],liking:5,eaten:5,noSymptom:5,mild:0,strong:0,lastDate:"2026-08-01",lastMemo:"これまで症状なし",minutes:0},
  {id:"meat-simple",name:"肉料理（単純な味付け）",brand:"",category:"side",scene:["home"],liking:5,eaten:3,noSymptom:3,mild:0,strong:0,lastDate:"2026-08-01",lastMemo:"肉が好き。ソース・つなぎは確認",minutes:20}
];

const starterIncidents = [
  {
    id:"incident-20260730",
    date:"2026-07-30", time:"21:00",
    food:"珍来のシンプルなラーメン／途中で食べた饅頭",
    place:"珍来・饅頭の商品不明", amount:"ラーメン1人前、饅頭",
    onset:"夜", symptoms:["強いかゆみ","発疹・じんましん","救急搬送"],
    factors:["長時間の運動","激しい運動","暑さ・大量の汗","疲労"],
    notes:"昼のインスタントラーメンは症状なし。一日中スケボー。夜のラーメン後に背中全面へ発疹。原因は未確定。",
    createdAt:"2026-07-30"
  }
];

function getFoods(){
  return JSON.parse(localStorage.getItem("miranFoodsV4") || "null") || starterFoods;
}
function setFoods(v){ localStorage.setItem("miranFoodsV4", JSON.stringify(v)); }
function getIncidents(){
  return JSON.parse(localStorage.getItem("miranIncidentsV4") || "null") || starterIncidents;
}
function setIncidents(v){ localStorage.setItem("miranIncidentsV4", JSON.stringify(v)); }

document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.add("active");
    if(btn.dataset.tab === "catalog") renderCatalog();
    if(btn.dataset.tab === "record") renderIncidents();
  };
});

function renderSettings(){
  $("allergenSettings").innerHTML = Object.entries(allergens).map(([key,a]) => `
    <div class="setting-row">
      <div><strong>${a.label}</strong><div class="small">検査 ${a.test}</div></div>
      <select data-setting="${key}">
        <option value="observed">食べた実績あり</option>
        <option value="check">要確認</option>
        <option value="avoid">除去中</option>
      </select>
    </div>`).join("");
  document.querySelectorAll("[data-setting]").forEach(s => s.value = settings[s.dataset.setting] || "check");
}
$("settingsBtn").onclick = () => { renderSettings(); $("settingsDialog").showModal(); };
$("saveSettingsBtn").onclick = e => {
  e.preventDefault();
  document.querySelectorAll("[data-setting]").forEach(s => settings[s.dataset.setting] = s.value);
  localStorage.setItem("miranSettingsV4", JSON.stringify(settings));
  $("settingsDialog").close();
};

function foodRisk(food){
  if(food.strong > 0) return "red";
  if(food.mild > 0) return "yellow";
  if(food.noSymptom > 0) return "green";
  return "yellow";
}
function daysSince(dateStr){
  if(!dateStr) return 999;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now-d)/(1000*60*60*24));
}
function recommendationScore(food, scene, mealType, limit, activity){
  if(food.strong > 0) return -999;
  if(!food.scene.includes(scene)) return -200;

  let score = 0;
  const safeRate = food.eaten ? food.noSymptom / food.eaten : 0;
  score += safeRate * 45;
  score += food.liking * 7;

  const recent = daysSince(food.lastDate);
  if(recent === 0) score -= 18;
  else if(recent <= 2) score -= 10;
  else if(recent >= 5) score += 7;

  if(limit !== "any" && Number(food.minutes || 0) > Number(limit)) score -= 25;
  if(mealType === "snack" && food.category === "snack") score += 25;
  if(mealType !== "snack" && food.category === "snack") score -= 30;

  if(activity === "high"){
    score += safeRate * 15;
    if(food.eaten < 3) score -= 30;
  }

  return score;
}
function recommendationReason(food){
  const parts = [];
  if(food.noSymptom > 0) parts.push(`症状なし ${food.noSymptom}回`);
  if(food.liking >= 5) parts.push("大好き");
  else if(food.liking >= 4) parts.push("好き");
  if(daysSince(food.lastDate) <= 1) parts.push("最近食べたため飽きに注意");
  if(food.brand) parts.push(food.brand);
  return parts.join("・");
}
function renderRecommendations(){
  const scene = $("scene").value;
  const mealType = $("mealType").value;
  const limit = $("timeLimit").value;
  const activity = $("activityToday").value;

  const ranked = getFoods()
    .map(f => ({...f, score:recommendationScore(f,scene,mealType,limit,activity)}))
    .filter(f => f.score > -100)
    .sort((a,b) => b.score-a.score)
    .slice(0,3);

  if(!ranked.length){
    $("recommendations").innerHTML = `<div class="watch-card"><strong>候補がまだ足りません</strong><p class="small">食事記録を追加すると、実績から3つ選べるようになります。</p></div>`;
    return;
  }

  $("recommendations").innerHTML = ranked.map((f,i) => `
    <div class="recommend-card">
      <div class="catalog-head">
        <div><span class="rank">${i+1}</span> <strong>${esc(f.name)}</strong>${f.brand ? `<div class="small">${esc(f.brand)}</div>` : ""}</div>
        <span class="badge ${foodRisk(f)}">${f.strong ? "要確認" : "実績あり"}</span>
      </div>
      <div class="score-line">${esc(recommendationReason(f))}</div>
      <div class="tags">
        <span class="tag">${f.category==="snack"?"おやつ":"食事"}</span>
        <span class="tag">好き度 ${"★".repeat(f.liking)}</span>
      </div>
    </div>`).join("");
}
$("recommendBtn").onclick = renderRecommendations;

function renderWatchList(){
  const incidents = getIncidents();
  $("watchList").innerHTML = incidents.slice().reverse().map(x => `
    <div class="watch-card">
      <strong>${esc(x.food)}</strong>
      <div class="small">${esc(x.date)}／原因未確定／${esc(x.symptoms.join("・"))}</div>
      <div class="tags">${x.factors.map(v => `<span class="tag">${esc(v)}</span>`).join("")}</div>
    </div>`).join("");
}

$("incidentDate").value = new Date().toISOString().slice(0,10);

$("saveIncidentBtn").onclick = () => {
  const food = $("incidentFood").value.trim();
  if(!food) return alert("料理・商品名を入力してください。");
  const symptoms = [...document.querySelectorAll('input[name="symptom"]:checked')].map(x=>x.value);
  const factors = [...document.querySelectorAll('input[name="factor"]:checked')].map(x=>x.value);
  const incident = {
    id:String(Date.now()), date:$("incidentDate").value, time:$("incidentTime").value,
    food, place:$("incidentPlace").value.trim(), amount:$("incidentAmount").value.trim(),
    onset:$("onsetTime").value, symptoms, factors,
    notes:$("incidentNotes").value.trim(), createdAt:new Date().toISOString()
  };
  const list = getIncidents(); list.push(incident); setIncidents(list);

  const foods = getFoods();
  const key = (food+"|"+incident.place).toLowerCase();
  let item = foods.find(f => (f.name+"|"+f.brand).toLowerCase() === key);
  if(!item){
    item = {id:String(Date.now()+1),name:food,brand:incident.place,category:"meal",scene:["home","convenience","restaurant"],liking:3,eaten:0,noSymptom:0,mild:0,strong:0,lastDate:incident.date,lastMemo:""};
    foods.push(item);
  }
  item.eaten += 1; item.strong += 1; item.lastDate = incident.date; item.lastMemo = incident.notes;
  setFoods(foods);

  ["incidentFood","incidentPlace","incidentAmount","onsetTime","incidentNotes"].forEach(id=>$(id).value="");
  document.querySelectorAll('input[name="symptom"],input[name="factor"]').forEach(x=>x.checked=false);
  renderIncidents(); renderWatchList();
  alert("症状記録を保存し、食事図鑑を自動更新しました。");
};

function renderIncidents(){
  $("incidents").innerHTML = getIncidents().slice().reverse().map(x => `
    <div class="incident-card">
      <strong>${esc(x.date)}　${esc(x.food)}</strong>
      <div class="small">${esc(x.place)}／${esc(x.symptoms.join("・") || "症状未選択")}</div>
      <div class="tags">${x.factors.map(v=>`<span class="tag">${esc(v)}</span>`).join("")}</div>
      <p class="small">${esc(x.notes)}</p>
    </div>`).join("");
}

$("saveMealBtn").onclick = () => {
  const name = $("mealName").value.trim();
  if(!name) return alert("料理・商品名を入力してください。");
  const brand = $("mealBrand").value.trim();
  const foods = getFoods();
  const key = (name+"|"+brand).toLowerCase();
  let item = foods.find(f => (f.name+"|"+f.brand).toLowerCase() === key);
  if(!item){
    item = {
      id:String(Date.now()),name,brand,category:$("mealCategory").value,
      scene:[$("mealScene").value],liking:Number($("liking").value),
      eaten:0,noSymptom:0,mild:0,strong:0,lastDate:"",lastMemo:"",minutes:10
    };
    foods.push(item);
  }
  if(!item.scene.includes($("mealScene").value)) item.scene.push($("mealScene").value);
  item.eaten += 1;
  const symptom = $("mealSymptom").value;
  if(symptom==="none") item.noSymptom += 1;
  if(symptom==="mild") item.mild += 1;
  if(symptom==="strong") item.strong += 1;
  item.liking = Number($("liking").value);
  item.lastDate = new Date().toISOString().slice(0,10);
  item.lastMemo = $("mealMemo").value.trim();
  setFoods(foods);

  $("mealName").value=""; $("mealBrand").value=""; $("mealMemo").value="";
  alert("食事記録を保存し、食事図鑑を自動更新しました。");
};

function renderCatalog(){
  const filter = $("catalogFilter").value;
  const list = getFoods().filter(f => {
    if(filter==="safe") return f.noSymptom > 0 && f.strong===0;
    if(filter==="watch") return f.strong>0 || f.mild>0;
    if(filter==="snack") return f.category==="snack";
    if(filter==="convenience") return f.scene.includes("convenience");
    if(filter==="restaurant") return f.scene.includes("restaurant");
    return true;
  });
  $("catalogList").innerHTML = list.sort((a,b)=>b.noSymptom-a.noSymptom).map(f => {
    const rate = f.eaten ? Math.round(f.noSymptom/f.eaten*100) : 0;
    return `<div class="catalog-card">
      <div class="catalog-head">
        <div><strong>${esc(f.name)}</strong>${f.brand?`<div class="small">${esc(f.brand)}</div>`:""}</div>
        <span class="badge ${foodRisk(f)}">${f.strong?"要確認":f.noSymptom?"実績あり":"未確認"}</span>
      </div>
      <div class="score-line">食べた ${f.eaten}回／症状なし ${f.noSymptom}回／強い症状 ${f.strong}回／症状なし率 ${rate}%</div>
      <div class="score-line">好き度 ${"★".repeat(f.liking)}${"☆".repeat(5-f.liking)}／最終 ${esc(f.lastDate)}</div>
      <p class="small">${esc(f.lastMemo)}</p>
    </div>`;
  }).join("");
}
$("catalogFilter").onchange = renderCatalog;

$("imageInput").onchange = e => {
  const file=e.target.files[0]; if(!file)return;
  $("preview").src=URL.createObjectURL(file); $("preview").hidden=false; $("ocrBtn").disabled=false;
};
$("ocrBtn").onclick = async () => {
  const file=$("imageInput").files[0]; if(!file)return;
  $("ocrBtn").disabled=true;
  try{
    const res=await Tesseract.recognize(file,"jpn+eng",{logger:m=>{
      if(m.status==="recognizing text") $("ocrStatus").textContent=`読み取り中 ${Math.round(m.progress*100)}%`;
    }});
    $("menuText").value=res.data.text.trim();
    $("ocrStatus").textContent="読み取り完了。誤字を確認してください。";
  }catch{
    $("ocrStatus").textContent="読み取りに失敗しました。直接入力してください。";
  }finally{$("ocrBtn").disabled=false;}
};

$("analyzeBtn").onclick = () => {
  const lines=$("menuText").value.split(/\n+/).map(x=>x.trim()).filter(x=>x.length>1);
  const foods=getFoods();
  $("menuResults").innerHTML=lines.map(line=>{
    const observed = foods.filter(f=>line.includes(f.name) || (f.brand && line.includes(f.brand)));
    let avoid=[],check=[];
    for(const [k,a] of Object.entries(allergens)){
      if(a.words.some(w=>line.includes(w))){
        if(settings[k]==="avoid") avoid.push(a.label);
        if(settings[k]==="check") check.push(a.label);
      }
    }
    let cls="yellow",label="店員確認",msg="料理名だけでは原材料を確認できません。";
    if(avoid.length){cls="red";label="除去設定に該当";msg=avoid.join("・");}
    else if(observed.some(f=>f.strong>0)){cls="red";label="過去に強い症状";msg="同一または近い登録名に強い症状の記録があります。";}
    else if(observed.some(f=>f.noSymptom>0)){cls="green";label="食べた実績あり";msg=`登録実績：${observed.map(f=>`${f.name} 症状なし${f.noSymptom}回`).join("、")}。同一商品・原材料か確認してください。`;}
    else if(check.length){msg=`検査・設定上の確認対象：${check.join("・")}`;}
    return `<div class="menu-result"><div class="menu-head"><strong>${esc(line)}</strong><span class="badge ${cls}">${label}</span></div><div class="small">${esc(msg)}</div></div>`;
  }).join("");
};

renderRecommendations();
renderWatchList();
renderIncidents();
