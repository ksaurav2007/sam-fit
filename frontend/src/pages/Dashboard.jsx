import {useEffect,useState} from "react";import {api} from "../services/api.js";
const Stat=({l,v,t,u})=><div className="card"><div className="mu">{l}</div><div className="big">{Math.round(v)}<span className="mu"> / {t}{u}</span></div><div className="bar"><i style={{width:Math.min(100,v/t*100)+"%"}}/></div></div>;
export default function Dashboard(){const[d,setD]=useState(null),[e,setE]=useState("");useEffect(()=>{api.get("/nutrition/today").then(setD).catch(x=>setE(x.message))},[]);
  if(e)return <p className="err">{e}</p>;if(!d)return <div className="card">Loading your day…</div>;const{totals:t,targets:p}=d,gap=Math.round(p.proteinTarget-t.protein);
  return <><h1>Hello, {p.name}</h1><p className="mu">{gap>0?`Protein is ${gap} g below today's target.`:"Protein target reached."} Targets are estimates.</p>
  <div className="grid"><Stat l="Calories" v={t.kcal} t={p.kcalTarget} u=" kcal"/><Stat l="Protein" v={t.protein} t={p.proteinTarget} u=" g"/><Stat l="Water" v={d.waterMl} t={p.waterTargetMl} u=" ml"/></div>
  <div className="card"><h3>Today's meals</h3>{d.meals.length?d.meals.map(m=><div key={m.id} className="row"><b>{m.type}</b><span className="mu">{m.items.map(i=>`${i.name} × ${i.qty}`).join(", ")}</span></div>):<p className="mu">No meals logged yet.</p>}</div>
  <div className="card"><h3>Workout</h3><p className="mu">{d.workoutSets} sets logged today.</p></div></>}
