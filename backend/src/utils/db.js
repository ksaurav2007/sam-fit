import {PrismaClient} from "@prisma/client";export const db=new PrismaClient();
export const dayRange=(d=new Date())=>{const s=new Date(d);s.setHours(0,0,0,0);const e=new Date(s);e.setDate(e.getDate()+1);return{gte:s,lt:e}};
export const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
