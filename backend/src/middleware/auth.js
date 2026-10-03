import jwt from "jsonwebtoken";
export const requireAuth=(req,res,next)=>{try{req.userId=jwt.verify(req.cookies.t||"",process.env.JWT_SECRET).sub;next()}catch{res.status(401).json({error:"Please log in."})}};
export const cookieOpts=()=>({httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:process.env.NODE_ENV==="production"?"none":"lax",maxAge:7*864e5});
