export async function resolve(spec,ctx,next){if(spec==="@prisma/client")return{url:new URL("./fake-prisma.mjs",import.meta.url).href,shortCircuit:true};return next(spec,ctx)}
