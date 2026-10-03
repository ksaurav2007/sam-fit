import {register} from "node:module";register("./hooks.mjs",import.meta.url);
Object.assign(process.env,{DATABASE_URL:"x",JWT_SECRET:"test-secret",FRONTEND_URL:"http://localhost:5173",PORT:"4100",NODE_ENV:"test"});
await import("../src/server.js");const B="http://localhost:4100";let cookie="",bad=0;
const call=async(m,p,b)=>{const r=await fetch(B+p,{method:m,headers:{"Content-Type":"application/json",cookie},body:b&&JSON.stringify(b)});const c=r.headers.get("set-cookie");if(c)cookie=c.split(";")[0];return{s:r.status,j:await r.json()}};
const ck=(l,ok)=>{if(!ok)bad++;console.log(ok?"PASS":"FAIL",l)};
console.log("health:",(await call("GET","/health")).j);
await call("POST","/api/auth/register",{name:"T",email:"t@t.com",password:"Passw0rd1",age:20,gender:"Male",heightCm:172,weightKg:65,activity:1,goal:"Build muscle"});
let expect=0;
for(const name of ["chapati","Chapati","CHAPATI","chapatis","CHAPATIS"]){const r=await call("POST","/api/nutrition/meals",{type:"Lunch",items:[{name,qty:8}]}),i=r.j.items?.[0];expect+=800;
  ck(`"${name}" x8 -> ${i?.name} ${i?.kcal}kcal ${i?.protein}P ${i?.carbs}C ${i?.fat}F`,r.s===201&&i.name==="Chapati"&&i.kcal===800&&i.protein===24&&i.carbs===144&&i.fat===20)}
for(const [name,q,k] of [["Rice",1,200],["Egg",2,156],["Chicken",1,230],["Dal",1,120]]){const r=await call("POST","/api/nutrition/meals",{type:"Dinner",items:[{name,qty:q}]}),i=r.j.items?.[0];expect+=k;ck(`${name} x${q} -> ${i?.name} ${Math.round(i?.kcal)}kcal`,r.s===201&&Math.round(i.kcal)===k)}
const t=(await call("GET","/api/nutrition/today")).j;
ck(`diary has Chapati x8: ${t.meals.some(m=>m.items[0].name==="Chapati"&&m.items[0].qty===8)}`,t.meals.some(m=>m.items[0].name==="Chapati"&&m.items[0].qty===8));
ck(`today totals ${Math.round(t.totals.kcal)} kcal (expected ${expect}), ${t.meals.length} meals`,Math.round(t.totals.kcal)===expect&&t.meals.length===9);
console.log(bad?"FAILURES":"ALL PASSED");process.exit(bad?1:0);
