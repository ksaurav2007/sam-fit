import {useState} from "react";import {useAuth} from "../context/Auth.jsx";
export default function Auth(){const{login,register}=useAuth(),[reg,setReg]=useState(false),[err,setErr]=useState(""),[busy,setBusy]=useState(false),
  [f,setF]=useState({name:"",email:"",password:"",confirm:"",age:20,gender:"Male",heightCm:170,weightKg:65,activity:1,goal:"Build muscle"}),set=k=>e=>setF({...f,[k]:e.target.value});
  async function submit(e){e.preventDefault();setErr("");if(reg&&f.password!==f.confirm)return setErr("Passwords do not match.");setBusy(true);
    try{reg?await register(f):await login({email:f.email,password:f.password})}catch(x){setErr(x.message)}setBusy(false)}
  const In=(l,k,t="text")=><label>{l}<br/><input type={t} value={f[k]} onChange={set(k)} required style={{width:"100%"}}/></label>;
  return <form onSubmit={submit} className="card" style={{maxWidth:420,margin:"40px auto"}}><h1>SaM Fit</h1><p className="mu">No Excuses. Just Fitness.</p>
    {reg&&In("Full name","name")}{In("Email","email","email")}{In("Password (8+ chars, letter and number)","password","password")}
    {reg&&<>{In("Confirm password","confirm","password")}<div className="row">{In("Age","age","number")}{In("Height cm","heightCm","number")}{In("Weight kg","weightKg","number")}</div>
    <label>Gender<br/><select value={f.gender} onChange={set("gender")}>{["Male","Female","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Activity<br/><select value={f.activity} onChange={set("activity")}>{["Sedentary","Lightly active","Moderately active","Very active"].map((x,i)=><option key={x} value={i}>{x}</option>)}</select></label>
    <label>Goal<br/><select value={f.goal} onChange={set("goal")}>{["Lose weight","Maintain weight","Gain weight","Build muscle","Improve fitness","General health"].map(x=><option key={x}>{x}</option>)}</select></label></>}
    {err&&<p className="err" role="alert">{err}</p>}<div className="row"><button className="pri" disabled={busy}>{busy?"Please wait…":reg?"Create account":"Log in"}</button><button type="button" className="sec" onClick={()=>setReg(!reg)}>{reg?"I have an account":"Sign up"}</button></div></form>}
