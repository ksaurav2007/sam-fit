// Pure food matching and pricing (no database import, so it can be unit-tested).
export const norm=s=>String(s||"").toLowerCase().replace(/[^a-z\s]/g," ").replace(/\s+/g," ").trim();
export const variants=n=>{const v=new Set([n]);n.split(" ").length&&v.add(n.replace(/ies$/,"y"));v.add(n.replace(/oes$/,"o"));v.add(n.replace(/es$/,""));v.add(n.replace(/s$/,""));return[...v]};
export function buildIndex(foods){const idx=new Map(),put=(k,f)=>{for(const x of variants(norm(k)))if(x&&!idx.has(x))idx.set(x,f)};
  foods.forEach(f=>put(f.name,f));foods.forEach(f=>(f.aliases||[]).forEach(a=>put(a,f)));return idx}
export function resolveFood(idx,name){const n=norm(name);for(const x of variants(n))if(idx.has(x))return idx.get(x);
  const t=n.split(" ");return t.length>1?idx.get(t[t.length-1])||idx.get(t[t.length-1].replace(/s$/,""))||null:null}
export function price(f,qty){const w=f.unit==="g"||f.unit==="ml";
  if(w&&qty<10)throw Object.assign(new Error(`${f.name} is measured in ${f.unit}. Enter an amount like ${f.unit==="g"?"100":"250"}.`),{status:422});
  const m=qty*(w?.01:1);return{name:f.name,qty,unit:f.unit,kcal:f.kcal*m,protein:f.protein*m,carbs:f.carbs*m,fat:f.fat*m,fiber:f.fiber*m}}
