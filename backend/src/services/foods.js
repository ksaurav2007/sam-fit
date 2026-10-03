import {db} from "../utils/db.js";import {buildIndex,resolveFood} from "./foodsCore.js";
let cache={at:0,idx:null};
export async function getIndex(){if(!cache.idx||Date.now()-cache.at>6e4){cache={at:Date.now(),idx:buildIndex(await db.food.findMany())}}return cache.idx}
export const findFood=async name=>resolveFood(await getIndex(),name);
