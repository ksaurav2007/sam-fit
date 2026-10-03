// In-memory stand-in for Prisma, used only by test/run.mjs to exercise the real Express routes.
const T={food:[],user:[],meal:[]};let n=0;const id=()=>"id"+ ++n;
export class PrismaClient{
 food={findMany:async()=>T.food,count:async()=>T.food.length,upsert:async({where,update,create})=>{let f=T.food.find(x=>x.name===where.name);if(f)Object.assign(f,update);else T.food.push(f={id:id(),...create});return f}};
 user={findUnique:async({where,select})=>{const u=T.user.find(x=>(where.email&&x.email===where.email)||(where.id&&x.id===where.id));return u&&select?{email:u.email,profile:u.profile,prefs:{},budget:{}}:u},
  create:async({data})=>{const u={id:id(),email:data.email,profile:null};u.profile={userId:u.id,...data.profile.create};T.user.push(u);return u}};
 meal={create:async({data})=>{const m={id:id(),userId:data.userId,type:data.type,source:data.source,eatenAt:new Date(),items:data.items.create.map(i=>({id:id(),...i}))};T.meal.push(m);return m},findMany:async({where})=>T.meal.filter(m=>m.userId===where.userId)};
 profile={findUnique:async({where})=>T.user.find(u=>u.id===where.userId).profile};
 waterLog={findMany:async()=>[]};workoutLog={count:async()=>0};
}
