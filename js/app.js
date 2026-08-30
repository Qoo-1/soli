(()=>{try{
const screen=document.querySelector("#screen"),nav=document.querySelector("#nav"),clock=document.querySelector("#clock"),boot=document.querySelector("#boot"),fatal=document.querySelector("#fatal");
if(!screen||!nav||!clock) throw new Error("Soli DOM 初始化失败：缺少 screen、nav 或 clock。");
if(!window.SoliStore) throw new Error("SoliStore 未加载。");
if(!window.SoliIcons) throw new Error("SoliIcons 未加载。");
if(!window.SoliEngine) throw new Error("SoliEngine 未加载。");
let route="surface",activeChar=null;
const navItems=[["chat","Chat"],["world","World"],["life","Life"],["cabinet","Cabinet"]];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const icon=n=>`<div class="icon">${SoliIcons[n]}</div>`;
function time(){clock.textContent=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false})}
time();setInterval(time,1000);
function navRender(){nav.innerHTML=navItems.map(([r,n])=>`<button class="nav-btn ${route===r||route==="chatroom"&&r==="chat"?"active":""}" data-r="${r}">${icon(r)}<span>${n}</span></button>`).join("");nav.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{route=b.dataset.r;render()})}
function head(title,sub,action=""){return `<div class="topline"><div><div class="eyebrow">SOLI / SUMMER ICE</div><div class="title">${title}</div><div class="sub">${sub}</div></div>${action}</div>`}
function surface(){return `<div class="surface"><div class="surface-orb"></div><div class="surface-copy"><div class="soli">SOLI</div><h1>夏日<br>奇冰</h1><p>一小块盛夏，被安静地留在这里。<br>你可以聊天，也可以什么都不做。</p></div><div class="float-area">
<button class="float-link main" data-r="chat">${icon("chat")}<b>Chat</b><span>去见见你的 Char</span></button>
<button class="float-link world" data-r="world">${icon("world")}<b>World</b><span>打开世界</span></button>
<button class="float-link life" data-r="life">${icon("life")}<b>Life</b><span>一些日常</span></button>
</div></div>`}
function chats(){const cs=SoliStore.state.chars;return `<div class="page">${head("Chat","和 Char 待在同一个空间里",`<button class="fab" id="newChar">${icon("plus")}</button>`)}<div class="list">${cs.map(c=>{const a=SoliStore.state.chats[c.id]||[];return `<div class="row" data-char="${c.id}"><div class="avatar">${esc(c.initial||c.name[0])}</div><div class="rowmain"><b>${esc(c.name)}</b><span>${esc(a.at(-1)?.content||"还没有开始聊天")}</span></div>${icon("arrow")}</div>`}).join("")}</div></div>`}
function chatroom(){const c=activeChar,a=SoliStore.state.chats[c.id]||[];return `<div class="chat"><div class="chathead"><button class="back" id="back">‹</button><div class="avatar">${esc(c.initial||c.name[0])}</div><div class="chatname"><b>${esc(c.name)}</b><span>夏日奇冰 · ${esc(c.personality.slice(0,22))}</span></div></div><div class="messages" id="messages">${a.length?a.map(m=>`<div class="msg ${m.role==="user"?"user":"ai"}">${m.role==="assistant"?`<div class="meta">${esc(c.name)}</div>`:""}${esc(m.content)}</div>`).join(""):`<div class="empty">从一句很普通的话开始。</div>`}</div><div class="composer"><textarea id="input" class="textarea" rows="1" placeholder="说点什么……"></textarea><button class="send" id="send">↑</button></div></div>`}
function world(){const w=SoliStore.state.worlds[0];return `<div class="page">${head("World","世界与 Pages")}<div class="paper"><div class="eyebrow">CURRENT WORLD</div><h2>${esc(w.name)}</h2><p>${esc(w.description)}</p></div><div class="section">Pages</div><div class="list">${w.entries.map((e,i)=>`<div class="paper" data-page="${e.id}" style="cursor:pointer"><div class="eyebrow">PAGE ${String(i+1).padStart(2,"0")}</div><h3>${esc(e.name)}</h3><div class="keywords">${e.keywords.map(k=>`<span class="tag">${esc(k)}</span>`).join("")}</div></div>`).join("")}</div></div>`}
function life(){return `<div class="page">${head("Life","Soli 里慢慢发生的一些日常",`<button class="fab" id="plant">${icon("plus")}</button>`)}<div class="card" style="min-height:230px;display:grid;place-items:center;text-align:center"><div><div style="font-size:30px;letter-spacing:.25em;color:#74aeb7">SUMMER</div><div style="margin-top:12px">这里不需要一直发生什么。</div><div class="mini" style="margin-top:6px">留一点空白，也是一种生活。</div></div></div><div class="section">Garden</div><div class="list">${SoliStore.state.life.plants.length?SoliStore.state.life.plants.map(p=>`<div class="row"><div class="avatar">01</div><div class="rowmain"><b>${esc(p.name)}</b><span>正在慢慢生长 · 第 ${p.day} 天</span></div></div>`).join(""):`<div class="empty">还没有种下植物。</div>`}</div></div>`}
function cabinet(){return `<div class="page">${head("Cabinet","Soli 的控制与内部设置")}<div class="list">
<div class="drawer" data-settings="ai"><div><b>AI</b><span>API / Model / Generation</span></div>${icon("arrow")}</div>
<div class="drawer" data-settings="voice"><div><b>Voice</b><span>Speech / Input / Playback</span></div>${icon("arrow")}</div>
<div class="drawer" data-settings="chat"><div><b>Chat</b><span>Memory / Style / Context</span></div>${icon("arrow")}</div>
<div class="drawer" data-settings="appearance"><div><b>Appearance</b><span>Summer Ice</span></div>${icon("arrow")}</div>
<div class="drawer" data-settings="data"><div><b>Data</b><span>Export / Reset</span></div>${icon("arrow")}</div>
</div><div id="settingsDetail"></div></div>`}
function settingDetail(type){
if(type==="ai")return `<div class="section">AI</div><div class="card form"><label class="label">API Base URL</label><input id="base" class="input" value="${esc(SoliStore.state.api.baseUrl)}"><label class="label">API Key</label><input id="key" class="input" type="password" value="${esc(SoliStore.state.api.key)}" placeholder="仅保存在本机浏览器"><label class="label">Model</label><input id="model" class="input" value="${esc(SoliStore.state.api.model)}"><div class="grid2"><input id="temp" class="input" type="number" step=".1" value="${SoliStore.state.api.temperature}"><input id="tokens" class="input" type="number" value="${SoliStore.state.api.maxTokens}"></div><div class="actions"><button class="btn primary" id="saveAI">保存</button></div></div>`;
if(type==="voice")return `<div class="section">Voice</div><div class="card"><div class="mini">语音接口已经预留。下一版可以接入 STT / TTS provider，并保留浏览器语音作为 fallback。</div></div>`;
if(type==="chat")return `<div class="section">Chat</div><div class="card form"><label><input id="memory" type="checkbox" ${SoliStore.state.settings.autoMemory?"checked":""}> 自动保存轻量 Memory</label><div class="mini">World Pages 负责世界设定，Memory 负责保存聊天中值得留下的内容。</div></div>`;
if(type==="appearance")return `<div class="section">Appearance</div><div class="card"><b>Summer Ice</b><div class="mini" style="margin-top:5px">当前全局风格：夏日奇冰。冰白、雾蓝、透明玻璃、纸张与轻微水感。</div></div>`;
return `<div class="section">Data</div><div class="card actions"><button class="btn" id="export">Export</button><button class="btn" id="reset">Reset</button></div>`;
}
function bind(){
document.querySelectorAll("[data-r]").forEach(x=>x.onclick=()=>{route=x.dataset.r;render()});
document.querySelectorAll("[data-char]").forEach(x=>x.onclick=()=>{activeChar=SoliStore.state.chars.find(c=>c.id===x.dataset.char);route="chatroom";render()});
document.querySelector("#back")?.addEventListener("click",()=>{route="chat";render()});
document.querySelector("#send")?.addEventListener("click",send);
document.querySelector("#input")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
document.querySelector("#newChar")?.addEventListener("click",()=>{const n=prompt("Char 名称","新的 Char");if(!n)return;SoliStore.state.chars.push({id:SoliStore.uid(),name:n,initial:n[0],personality:"自然、温柔、有自己的想法。",background:"刚刚来到夏日奇冰。",world:"world-1"});SoliStore.save();render()});
document.querySelector("#plant")?.addEventListener("click",()=>{SoliStore.state.life.plants.push({name:"小植物",day:1});SoliStore.save();render()});
document.querySelectorAll("[data-page]").forEach(x=>x.onclick=()=>{const e=SoliStore.state.worlds[0].entries.find(y=>y.id===x.dataset.page);alert(e.name+"\n\n关键词："+e.keywords.join(" / ")+"\n\n"+e.content)});
document.querySelectorAll("[data-settings]").forEach(x=>x.onclick=()=>{const d=document.querySelector("#settingsDetail");d.innerHTML=settingDetail(x.dataset.settings);bindSettings()});
}
function bindSettings(){
document.querySelector("#saveAI")?.addEventListener("click",()=>{const s=SoliStore.state;s.api.baseUrl=document.querySelector("#base").value.trim();s.api.key=document.querySelector("#key").value.trim();s.api.model=document.querySelector("#model").value.trim();s.api.temperature=document.querySelector("#temp").value;s.api.maxTokens=document.querySelector("#tokens").value;SoliStore.save()});
document.querySelector("#memory")?.addEventListener("change",e=>{SoliStore.state.settings.autoMemory=e.target.checked;SoliStore.save()});
document.querySelector("#export")?.addEventListener("click",()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(SoliStore.state,null,2)],{type:"application/json"}));a.download="soli-data.json";a.click()});
document.querySelector("#reset")?.addEventListener("click",()=>{if(confirm("确定重置 Soli 本机数据吗？")){SoliStore.reset();location.reload()}});
}
async function send(){
const input=document.querySelector("#input"),text=input.value.trim();if(!text)return;
const c=activeChar,a=SoliStore.state.chats[c.id] ||= [];
a.push({role:"user",content:text});SoliStore.save();input.value="";render();
const box=document.querySelector("#messages");box.insertAdjacentHTML("beforeend",`<div class="msg ai" id="typing"><div class="meta">${esc(c.name)}</div>正在想……</div>`);box.scrollTop=box.scrollHeight;
try{const answer=await SoliEngine.reply(c,a,text);a.push({role:"assistant",content:answer});SoliEngine.remember(c.id,text)}
catch(e){a.push({role:"assistant",content:"AI 连接失败：\n"+e.message});SoliStore.save()}
render();
}
function render(){
navRender();
screen.innerHTML=route==="surface"?surface():route==="chat"?chats():route==="chatroom"?chatroom():route==="world"?world():route==="life"?life():cabinet();
bind();
if(route==="chatroom"){const b=document.querySelector("#messages");b.scrollTop=b.scrollHeight}
}
render();
window.__soliReady=true;
if(window.__soliDiagnostics) window.__soliDiagnostics.app="OK";
setTimeout(()=>boot.classList.add("hide"),550);

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./service-worker.js",{updateViaCache:"none"})
    .then(reg=>{
      if(window.__soliDiagnostics) window.__soliDiagnostics.serviceWorker="OK";
      reg.update().catch(()=>{});
    })
    .catch(error=>{
      if(window.__soliDiagnostics) window.__soliDiagnostics.serviceWorker="ERROR";
      console.warn("Soli Service Worker registration failed:",error);
    });
}else if(window.__soliDiagnostics){
  window.__soliDiagnostics.serviceWorker="UNAVAILABLE";
}
}catch(error){
console.error(error);
if(window.__soliFail) window.__soliFail(error,"app");
else {document.querySelector("#fatal").hidden=false;document.querySelector("#boot").classList.add("hide");}
}})();