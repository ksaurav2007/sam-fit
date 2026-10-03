import {FOODS} from "./prisma/foods.js";import {buildIndex,resolveFood,price} from "./src/services/foodsCore.js";
const idx=buildIndex(FOODS.map(([name,unit,kcal,protein,carbs,fat,fiber,aliases])=>({name,unit,kcal,protein,carbs,fat,fiber,aliases})));
let bad=0;const eq=(a,b,l)=>{if(a!==b){bad++;console.log("FAIL",l,a,b)}};
for(const [q,e] of [["chapatis","Chapati"],["Chapati ","Chapati"],["CHAPATIS","Chapati"],["roti","Roti"],["rotis","Roti"],["eggs","Egg"],["Boiled Eggs","Egg"],["idlis","Idli"],["dosas","Dosa"],["parathas","Paratha"],["maggi","Maggi"],["dahi","Curd"],["chole","Chole"],["chana masala","Chole"],["bananas","Banana"],["bread slices","Bread"],["chicken","Chicken curry"],["vegetables","Vegetables"],["rajma","Rajma"],["biryani","Biryani"],["dal","Dal"],["milk","Milk"],["oats","Oats"],["poha","Poha"],["upma","Upma"],["sambar","Sambar"],["paneer","Paneer"],["rice","Rice"]]){const f=resolveFood(idx,q);eq(f&&f.name,e,q)}
eq(resolveFood(idx,"pizza"),null,"pizza");
const p=price(resolveFood(idx,"chapatis"),8);eq(p.kcal,800,"kcal8");eq(p.protein,24,"p8");eq(p.carbs,144,"c8");eq(p.fat,20,"f8");eq(price(resolveFood(idx,"chapati"),9).kcal,900,"kcal9");eq(Math.round(price(resolveFood(idx,"milk"),250).kcal),155,"milk");
try{price(resolveFood(idx,"paneer"),2);eq(1,0,"paneer guard")}catch(e){console.log("guard ok:",e.message)}
console.log(bad?"FAILURES":"ALL PASSED");
