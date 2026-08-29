window.SoliStore=(()=>{
const KEY="soli-summer-ice-state";
const defaults={
api:{baseUrl:"https://api.openai.com/v1",key:"",model:"gpt-4o-mini",temperature:.8,maxTokens:1200},
settings:{autoMemory:true,stream:false},
chars:[{id:"char-1",name:"夏",initial:"夏",personality:"温柔、自然、有自己的节奏，喜欢海风、冰饮和午后的安静。",background:"住在夏日奇冰世界的一座临海小屋里。",world:"world-1"}],
worlds:[{id:"world-1",name:"夏日奇冰",description:"一座被盛夏、海风与透明冰汽包围的小世界。",entries:[
{id:"p-1",name:"海边小镇",keywords:["海边","沙滩","小镇","夏天"],content:"小镇靠着很浅很蓝的海。午后的阳光落在白色屋檐上，空气里常有海风和冰汽。"},
{id:"p-2",name:"冰饮店",keywords:["冰饮","柠檬","冰店","饮料"],content:"街角有一家很小的冰饮店，玻璃窗总带着水雾。店主会根据当天的天气调一杯冰饮。"}]}],
chats:{},memories:{},life:{plants:[]}
};
let state=load();
function load(){try{return deepMerge(structuredClone(defaults),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch{return structuredClone(defaults)}}
function deepMerge(base,extra){if(!extra||typeof extra!=="object")return base;for(const k of Object.keys(extra)){if(extra[k]&&typeof extra[k]==="object"&&!Array.isArray(extra[k])&&base[k])base[k]=deepMerge(base[k],extra[k]);else base[k]=extra[k]}return base}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
return{get state(){return state},save,uid:()=>crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random(),reset(){state=structuredClone(defaults);save()}}
})()