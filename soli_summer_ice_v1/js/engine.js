window.SoliEngine=(()=>{
function context(char,text,history){
 const w=SoliStore.state.worlds.find(x=>x.id===char.world);
 const pages=w?.entries.filter(e=>e.keywords.some(k=>text.includes(k)))||[];
 const memories=(SoliStore.state.memories[char.id]||[]).slice(-8);
 return [{role:"system",content:`你正在Soli的小世界“夏日奇冰”中与用户聊天。保持自然、有生活感，不要像客服。不要虚构自己是现实中的人。
Char：${char.name}
性格：${char.personality}
背景：${char.background}
相关世界书：${pages.map(p=>p.name+"："+p.content).join("\n")||"暂无"}
已知记忆：${memories.join("\n")||"暂无"}
聊天风格：夏日奇冰，清凉、轻盈、克制，有空气感。`},...history.slice(-18).map(m=>({role:m.role,content:m.content}))]}
async function reply(char,history,text){
 const a=SoliStore.state.api;
 if(!a.key)return "还没有连接 AI。打开 Cabinet，在 AI 中填写 API Key 后，就可以真正开始聊天。";
 const res=await fetch((a.baseUrl||"").replace(/\/$/,"")+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+a.key},body:JSON.stringify({model:a.model,messages:context(char,text,history),temperature:Number(a.temperature),max_tokens:Number(a.maxTokens)})});
 if(!res.ok)throw Error("API "+res.status+" · "+await res.text());
 const d=await res.json();return d.choices?.[0]?.message?.content||"没有收到完整回复。";
}
return{reply,remember(charId,text){if(!SoliStore.state.settings.autoMemory)return;const a=SoliStore.state.memories[charId] ||= [];if(text.length>18){a.push(text.slice(0,120));if(a.length>20)a.shift();SoliStore.save()}}}
})()