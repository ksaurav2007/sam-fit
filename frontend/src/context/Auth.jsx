import {createContext,useContext,useEffect,useState} from "react";import {api} from "../services/api.js";
const C=createContext();export const useAuth=()=>useContext(C);
export function AuthProvider({children}){const[user,setUser]=useState(undefined);
  const load=()=>api.get("/user/profile").then(setUser).catch(()=>setUser(null));useEffect(()=>{load()},[]);
  const login=async b=>{await api.post("/auth/login",b);await load()},register=async b=>{await api.post("/auth/register",b);await load()},logout=async()=>{await api.post("/auth/logout");setUser(null)};
  return <C.Provider value={{user,login,register,logout,reload:load}}>{children}</C.Provider>}
