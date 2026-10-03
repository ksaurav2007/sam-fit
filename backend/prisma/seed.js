import {PrismaClient} from "@prisma/client";import bcrypt from "bcryptjs";import {FOODS} from "./foods.js";
const db=new PrismaClient();
for(const [name,unit,kcal,protein,carbs,fat,fiber,aliases] of FOODS){const d={unit,kcal,protein,carbs,fat,fiber,aliases};await db.food.upsert({where:{name},update:d,create:{name,...d}})}
console.log(`Food catalog: ${FOODS.length} foods`);
if(process.env.SEED_DEMO==="true"){const u=await db.user.upsert({where:{email:"demo@samfit.app"},update:{},create:{email:"demo@samfit.app",isDemo:true,passwordHash:await bcrypt.hash("Demo@12345",10),profile:{create:{name:"Demo User",age:20,gender:"Male",heightCm:172,weightKg:65,activity:1,goal:"Build muscle",kcalTarget:2500,proteinTarget:120,waterTargetMl:2800}},prefs:{create:{avoid:["Curd"]}},budget:{create:{monthly:3000,daily:100}}}});console.log("Demo user:",u.email)}
await db.$disconnect();
