export function targets({age,gender,heightCm,weightKg,activity,goal}){
  const bmr=10*weightKg+6.25*heightCm-5*age+(gender==="Male"?5:-161),tdee=bmr*[1.2,1.375,1.55,1.725][activity??1];
  const adj={"Gain weight":400,"Build muscle":300,"Lose weight":-400}[goal]||0;
  return{kcalTarget:Math.round((tdee+adj)/50)*50,proteinTarget:Math.round(weightKg*(["Build muscle","Gain weight"].includes(goal)?1.8:1.4)),waterTargetMl:Math.round((weightKg*35+(activity>=2?500:0))/100)*100};
}
