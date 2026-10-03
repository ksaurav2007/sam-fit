import {Router} from "express";import bcrypt from "bcryptjs";import jwt from "jsonwebtoken";import crypto from "crypto";import {z} from "zod";
import {db,wrap} from "../utils/db.js";import {targets} from "../utils/targets.js";import {cookieOpts} from "../middleware/auth.js";
const r=Router(),pw=z.string().min(8,"Password needs at least 8 characters").regex(/[A-Za-z]/,"Include a letter").regex(/\d/,"Include a number");
const reg=z.object({name:z.string().min(1),email:z.string().email(),password:pw,age:z.coerce.number().int().min(10).max(100),gender:z.enum(["Male","Female","Other"]),heightCm:z.coerce.number().min(100).max(250),weightKg:z.coerce.number().min(25).max(300),activity:z.coerce.number().int().min(0).max(3),goal:z.string()});
const sign=(res,id)=>res.cookie("t",jwt.sign({sub:id},process.env.JWT_SECRET,{expiresIn:"7d"}),cookieOpts());
const hash=t=>crypto.createHash("sha256").update(t).digest("hex");
r.post("/register",wrap(async(q,s)=>{const d=reg.parse(q.body);if(await db.user.findUnique({where:{email:d.email.toLowerCase()}}))return s.status(409).json({error:"That email is already registered."});
const{name,email,password,...p}=d,u=await db.user.create({data:{email:email.toLowerCase(),passwordHash:await bcrypt.hash(password,12),profile:{create:{name,...p,...targets(p)}},prefs:{create:{}},budget:{create:{monthly:3000,daily:100}}}});sign(s,u.id);s.status(201).json({id:u.id})}));
r.post("/login",wrap(async(q,s)=>{const{email,password}=z.object({email:z.string().email(),password:z.string()}).parse(q.body),u=await db.user.findUnique({where:{email:email.toLowerCase()}});
if(!u||!(await bcrypt.compare(password,u.passwordHash)))return s.status(401).json({error:"Email or password is incorrect."});sign(s,u.id);s.json({id:u.id})}));
r.post("/logout",(q,s)=>{s.clearCookie("t",cookieOpts());s.json({ok:true})});
r.post("/forgot-password",wrap(async(q,s)=>{const{email}=z.object({email:z.string().email()}).parse(q.body),u=await db.user.findUnique({where:{email:email.toLowerCase()}});
if(u){const t=crypto.randomBytes(32).toString("hex");await db.user.update({where:{id:u.id},data:{resetToken:hash(t),resetExpires:new Date(Date.now()+36e5)}});console.log(`[EMAIL NOT CONFIGURED] reset link: ${process.env.FRONTEND_URL}/reset-password?token=${t}`)}
s.json({ok:true,message:"If that email exists, a reset link has been sent."})}));
r.post("/reset-password",wrap(async(q,s)=>{const{token,password}=z.object({token:z.string(),password:pw}).parse(q.body),u=await db.user.findFirst({where:{resetToken:hash(token),resetExpires:{gt:new Date()}}});
if(!u)return s.status(400).json({error:"Reset link is invalid or expired."});await db.user.update({where:{id:u.id},data:{passwordHash:await bcrypt.hash(password,12),resetToken:null,resetExpires:null}});s.json({ok:true})}));
export default r;
