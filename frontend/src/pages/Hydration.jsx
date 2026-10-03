import {useEffect,useState} from "react";import {api} from "../services/api.js";
export default function Hydration(){const[d,setD]=useState(null),[t,setT]=useState(2800),[e,setE]=useState("");
  const load=()=>Promise.all([api.get("/water/today"),api.get("/user/profile")]).then(([w,u])=>{setD(w);setT(u.profile.waterTargetMl)}).catch(x=>setE(x.message));useEffect(()=>{load()},[]);
  const add=async ml=>{if(!(ml>=50))return setE("Enter at least 50 ml.");setE("");try{await api.post("/water/log",{ml});load()}catch(x){setE(x.message)}};
  if(!d)return <div className="card">Loading…</div>;
  return <><h1>Hydration</h1><div className="card"><div className="big">{(d.totalMl/1000).toFixed(2)} / {(t/1000).toFixed(1)} L</div><div className="bar"><i style={{width:Math.min(100,d.totalMl/t*100)+"%"}}/></div>
  <div className="row">{[250,350,500,750,1000].map(v=><button key={v} className="pri" onClick={()=>add(v)}>+{v} ml</button>)}<input type="number" id="c" placeholder="Custom ml" aria-label="Custom ml" style={{width:120}}/><button className="sec" onClick={()=>add(+document.getElementById("c").value)}>Add</button></div>{e&&<p className="err">{e}</p>}</div>
  <div className="card"><h3>History</h3>{d.logs.length?d.logs.map(l=><div key={l.id} className="row"><span>{new Date(l.at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} · {l.ml} ml</span><button className="sec" onClick={async()=>{await api.del("/water/log/"+l.id);load()}}>Undo</button></div>):<p className="mu">No water logged yet.</p>}</div></>}
