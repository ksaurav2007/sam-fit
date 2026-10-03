import {NavLink,Navigate,Route,Routes} from "react-router-dom";import {useAuth} from "./context/Auth.jsx";import Auth from "./pages/Auth.jsx";import Dashboard from "./pages/Dashboard.jsx";import Nutrition from "./pages/Nutrition.jsx";import Hydration from "./pages/Hydration.jsx";
export default function App(){const{user,logout}=useAuth();
  if(user===undefined)return <p style={{padding:20}}>Loading…</p>;
  if(!user)return <Routes><Route path="*" element={<Auth/>}/></Routes>;
  const dark=document.documentElement.dataset.theme==="dark";
  return <div className="app"><nav className="side" aria-label="Main"><div className="brand">SaM Fit</div>
    {[["/","Dashboard"],["/nutrition","Nutrition"],["/hydration","Hydration"]].map(([to,l])=><NavLink key={to} to={to} end={to==="/"} className={({isActive})=>isActive?"active":""}>{l}</NavLink>)}
    <button onClick={()=>{const t=dark?"light":"dark";document.documentElement.dataset.theme=t;localStorage.setItem("theme",t)}}>Theme</button><button onClick={logout}>Logout</button></nav>
    <main><Routes><Route path="/" element={<Dashboard/>}/><Route path="/nutrition" element={<Nutrition/>}/><Route path="/hydration" element={<Hydration/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></main></div>}
document.documentElement.dataset.theme=localStorage.getItem("theme")||"light";
