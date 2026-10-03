const BASE=import.meta.env.VITE_API_URL||"http://localhost:4000";
async function req(path,opt={}){const form=opt.body instanceof FormData;
  const res=await fetch(BASE+"/api"+path,{credentials:"include",...opt,headers:form?{}:{"Content-Type":"application/json"},body:form||opt.body==null?opt.body:JSON.stringify(opt.body)});
  const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||"Request failed");return data}
export const api={get:p=>req(p),post:(p,b)=>req(p,{method:"POST",body:b}),put:(p,b)=>req(p,{method:"PUT",body:b}),del:p=>req(p,{method:"DELETE"})};
