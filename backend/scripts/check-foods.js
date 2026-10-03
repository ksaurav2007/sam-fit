import "dotenv/config";import {db} from "../src/utils/db.js";import {ensureCatalog} from "../src/services/catalog.js";import {buildIndex,resolveFood,price} from "../src/services/foodsCore.js";
const u=new URL(process.env.DATABASE_URL);console.log(`Database: ${u.hostname}:${u.port}${u.pathname} (user ${u.username})`);
if(process.argv.includes("--seed"))console.log("Seeded, total foods:",await ensureCatalog());
const foods=await db.food.findMany();console.log("Foods in this database:",foods.length);
const c=foods.find(f=>f.name==="Chapati");console.log("Chapati record:",c||"MISSING (run: npm run check-foods -- --seed)");
if(foods.length){const idx=buildIndex(foods);for(const n of ["chapati","Chapati","CHAPATI","chapatis","CHAPATIS"]){const f=resolveFood(idx,n);console.log(n.padEnd(9),"->",f?`${f.name}: 8 = ${price(f,8).kcal} kcal`:"NOT FOUND")}}
await db.$disconnect();
