window.SoliEngine=(()=>{
function buildMessages(char,text,history){
const w=SoliStore.state.worlds.find(x=>x.id===char.world);
const pages=(w?.entries||[]).filter(e=>e.keywords.some(k=>text.includes(k)));
const memories=(SoliStore.state.memories[char.id]||[]).slice(-8);
const system=`你正在Soli的小世界“夏日奇冰”中与用户聊天。保持自然、有生活感，不要像客服。不要声称自己是现实中的人。
Char：${char.name}
性格：${char.personality}
背景：${char.background}
相关世界书：
${pages.map(p=>p.name+"："+p.content).join("\n")||"暂无"}
已知记忆：
${memories.join("\n")||"暂无"}
聊天风格：清凉、轻盈、克制，有空气感。`;
return [{role:"system",content:system},...history.slice(-18).map(m=>({role:m.role,content:m.content}))];
}
async function reply(char,history,text){
const a=SoliStore.state.api;
if(!a.key)return "Soli 还没有连接 AI。打开 Cabinet，在 AI 中填写 API Key 后，就可以开始聊天。";
const base=(a.baseUrl||"").replace(/\/$/,"");
const response=await fetch(base+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+a.key},body:JSON.stringify({model:a.model,messages:buildMessages(char,text,history),temperature:Number(a.temperature),max_tokens:Number(a.maxTokens)})});
if(!response.ok)throw new Error("API "+response.status);
const data=await response.json();
return data.choices?.[0]?.message?.content||"没有收到完整回复。";
}
function remember(id,text){
if(!SoliStore.state.settings.autoMemory)return;
if(text.length<18)return;
const list=SoliStore.state.memories[id] ||= [];
list.push(text.slice(0,120));if(list.length>20)list.shift();SoliStore.save();
}
return{reply,remember};
})();