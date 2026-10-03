import {db} from "../utils/db.js";import {FOODS} from "../../prisma/foods.js";
// Idempotent: inserts/updates the catalog in whatever database DATABASE_URL points to.
export async function ensureCatalog(){for(const [name,unit,kcal,protein,carbs,fat,fiber,aliases] of FOODS){const d={unit,kcal,protein,carbs,fat,fiber,aliases};await db.food.upsert({where:{name},update:d,create:{name,...d}})}return db.food.count()}
