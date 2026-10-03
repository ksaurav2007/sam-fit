import crypto from "crypto";import {z} from "zod";import {db} from "../utils/db.js";
const food=z.object({name:z.string(),quantity:z.number().positive(),unit:z.string(),calories:z.number(),protein:z.number(),carbs:z.number(),fat:z.number(),fiber:z.number().optional().default(0),confidence:z.number().min(0).max(1)});
const mealSchema=z.object({foods:z.array(food).min(1)});
const menuSchema=z.object({date:z.string().nullable().optional(),meals:z.array(z.object({type:z.enum(["Breakfast","Lunch","Snack","Dinner"]),items:z.array(z.string())}))});
const dietSchema=z.object({meals:z.array(z.object({type:z.string(),items:z.array(food.omit({confidence:true}))}))});
async function call({system,content,schema}){
  if(!process.env.AI_API_KEY||!process.env.AI_MODEL)throw Object.assign(new Error("AI is not configured. Set AI_API_KEY and AI_MODEL on the server."),{status:503});
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"x-api-key":process.env.AI_API_KEY,"anthropic-version":"2023-06-01","content-type":"application/json"},
    body:JSON.stringify({model:process.env.AI_MODEL,max_tokens:2000,system:system+" Reply with JSON only, no prose, no code fences.",messages:[{role:"user",content}]})});
  if(!res.ok)throw Object.assign(new Error("Unable to analyse this image. Please try another image or enter the meal manually."),{status:502});
  const txt=(await res.json()).content.filter(b=>b.type==="text").map(b=>b.text).join("").replace(/```json|```/g,"").trim();
  try{return schema.parse(JSON.parse(txt))}catch{throw Object.assign(new Error("The AI returned an unreadable result. Please retry or enter manually."),{status:502})}
}
const img=(f)=>({type:"image",source:{type:"base64",media_type:f.mimetype,data:f.buffer.toString("base64")}});
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
async function cached(userId,kind,file,imageUrl,run){const hash=sha(file.buffer),hit=await db.aIAnalysis.findUnique({where:{userId_kind_hash:{userId,kind,hash}}});if(hit)return{...hit.result,cached:true};
  const result=await run();await db.aIAnalysis.create({data:{userId,kind,hash,imageUrl,result}});return result}
export const analyzeMeal=(u,f,url)=>cached(u,"meal",f,url,()=>call({schema:mealSchema,system:"You estimate nutrition of Indian hostel meals from photos. For each food give name, quantity (pieces, bowls or grams), unit, calories, protein, carbs, fat, fiber (grams) and confidence 0-1. These are estimates. Shape: {\"foods\":[{name,quantity,unit,calories,protein,carbs,fat,fiber,confidence}]}",content:[img(f),{type:"text",text:"Analyse this meal."}]}));
export const analyzeMenu=(u,f,url)=>cached(u,"menu",f,url,()=>call({schema:menuSchema,system:"You read hostel menus from photos. Shape: {\"date\":\"YYYY-MM-DD or null\",\"meals\":[{\"type\":\"Breakfast|Lunch|Snack|Dinner\",\"items\":[string]}]}. Only include items you can read.",content:[img(f),{type:"text",text:"Extract this menu."}]}));
export const generateDiet=ctx=>call({schema:dietSchema,system:"You build a one-day diet plan using only the given hostel menu items, respecting avoid list, allergies, diet type, calorie and protein targets and daily budget. Quantities may be any realistic number. Shape: {meals:[{type,items:[{name,quantity,unit,calories,protein,carbs,fat,fiber}]}]}",content:JSON.stringify(ctx)});
export const coach=(ctx,question)=>call({schema:z.object({answer:z.string()}),system:"You are a fitness and nutrition coach. Use only the supplied user data. No medical diagnosis; for medical questions advise seeing a qualified professional. Keep answers short. Shape: {\"answer\":string}",content:JSON.stringify({data:ctx,question})});
