import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
//import { use } from "react";



export const verifyJWT = asyncHandler(async(req , _ , next) => {
    try {
        //console.log(req.cookies)
       // console.log("Authorization header (raw):", req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
       //const token = req.cookies?.accessToken ?.replace("Bearer ", "")

       // console.log("Extracted token:", token);

        
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
       
     //const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    
     //console.log("token: ", token)
     //console.log("ACCESS TOKEN", process.env.ACCESS_TOKEN_SECRET )
        
 //     try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
        console.log("Decoded token:", decodedToken);
    // } catch(err) {
    //   console.error("Verification error:", err.name, err.message);
    // }

    
                      
    
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
       // console.log("Decoded token _id:", decodedToken?._id);
        console.log("User from DB:", user);
        
       
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
        
        req.user = user;
       
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
   

})



 //console.log("Token being verified:", token);
       // console.log(process.env.ACCESS_TOKEN_SECRET)


       // console.log("Decoded token:", decodedToken);
  
      //console.error("Error verifying token:");

//      console.log("Raw token:", token);
//if (token) {
  //console.log("Token length:", token.length);
  //console.log("Token begins:", token.slice(0,20), "... ends:", token.slice(-20));
  //const parts = token.split('.');
 // console.log("Token parts count:", parts.length, parts);
//} else {
 // console.warn("Token is missing or empty!");
//}
//console.log("Secret used:", process.env.ACCESS_TOKEN_SECRET);


     // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
       //   if (err) {
         //    console.error("🔴 Verification error:", err.name, err.message, err);
           //     return res.status(401).json({ error: "Invalid token" });
            //     }
            //console.log("✅ Decoded via callback:", decoded);
            //next();
        //});

