import "dotenv/config";import express from "express";import helmet from "helmet";import cors from "cors";import cookieParser from "cookie-parser";import rateLimit from "express-rate-limit";import {ZodError} from "zod";
import auth from "./routes/auth.js";import {db} from "./utils/db.js";import {ensureCatalog} from "./services/catalog.js";import api from "./routes/api.js";
for(const k of ["DATABASE_URL","JWT_SECRET","FRONTEND_URL"])if(!process.env[k]){console.error(`Missing env var ${k}`);process.exit(1)}
const app=express();app.set("trust proxy",1);app.use(helmet());app.use(cors({origin:process.env.FRONTEND_URL.split(",").map(x=>x.trim()),credentials:true}));app.use(express.json({limit:"1mb"}));app.use(cookieParser());
app.use("/api/auth",rateLimit({windowMs:15*60*1000,limit:30}),auth);app.use("/api/ai",rateLimit({windowMs:60*1000,limit:10}));app.use("/api",rateLimit({windowMs:60*1000,limit:200}),api);
app.get("/health",async(q,s)=>s.json({ok:true,build:"foods-v3",foods:await db.food.count()}));
app.use((e,q,s,n)=>{if(e instanceof ZodError)return s.status(400).json({error:e.issues[0].message,field:e.issues[0].path.join(".")});if(e.status)return s.status(e.status).json({error:e.message});console.error(e);s.status(500).json({error:"Something went wrong. Please try again."})});
try{console.log(`Food catalog ready: ${await ensureCatalog()} foods`)}catch(e){console.error("Food catalog could not be seeded. Did you run: npx prisma migrate dev ?\n",e.message);process.exit(1)}
app.listen(process.env.PORT||4000,()=>console.log("SaM Fit API running (build foods-v3)"));
