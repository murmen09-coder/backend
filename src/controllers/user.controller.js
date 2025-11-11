import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
//import { use } from "react";

const generateAccessAndReferedhTokens = async (userId)=>{
    try{ const user =await User.findById(userId)
      const accessToken  = await  user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()
      user.refreshToken=refreshToken
      await user.save({validateBeforSave :false})
      return {accessToken, refreshToken}
      

    }catch(error){
        throw ApiError(500, " Something went work while generation refresh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
   // res.status(200).json({
     //   message: "This is Murali"

     //uerser detail from frontend
     // email with valiadation
     //if usere is already exisit
     //check for image , check avatat
     //upload the to cloudinary, avatar
     //creat user object - creat enery in db
     //remove passowrd and refresh token field from responce
     // check for user creation
     // return res

     const{fullName,email,username,password}=req.body
     //console.log("email:" , email);
    
     if (
        [fullName, email, username, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
     }
     const existedUser= await User.findOne({
        $or:[{username},{email}]
     })
     if (existedUser){
        throw new ApiError(409, " User with email or user name already exist")
     }
    
    //console.log(req.files);

     const avatarLocalPath = req.files?.avatar[0]?.path;
     //const coverImageLocalPath = req.files?.coverImage[0]?.path;

     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage[0].path)
     
     if (!avatarLocalPath){
        throw new ApiError(400," Avatar file is required")
     }
     
     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   
   
   
    if(!avatar){
        throw new ApiError(400," Avatar file is required")
    }
    const user =  await User.create ({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
 
 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Something wrong went wrong whiel registing the user")
    }
    return res.status(201).json(
        new ApiResponce(200, createdUser,"User Registered Sucessfully")
    )

    })
//} )
const loginUser = asyncHandler( async (req, res)=>{
    // req body-> data
    //username or email
    //find the user
    // password check for existing user
    //access and refresh token
    // send cookie....secure ..and acknowlgemtn

    //geting data.
    const {email, username, password} = req.body
    
    if (!(username || email)){
        throw new ApiError(400, " Username or E- Mail is required")
       }

     const user = await User.findOne({
            $or:[{username} , {email}]
            })
        if (!user){
            throw new ApiError(404, " User does not exist")
        }
      const isPasswordVaild = await user.isPasswordCorrect(password)  
      if (!isPasswordVaild){
            throw new ApiError(401  , " Invalid user Creditial")
      }
      const{accessToken, refreshToken} =await generateAccessAndReferedhTokens(user._id)

      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

      const options ={
        httpOnly: true,
        secure: true
      }
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponce( 200,
             {user: loggedInUser,accessToken,refreshToken},
              "User Logged in Successfully")
      )

    
})

const logoutUser = asyncHandler(async(req, res)=>{
      await User.findByIdAndUpdate(
        req.user._id,
        { $set:{refreshToken: undefined}
    },
    {
        new: true
    }
)
     
    const options ={
        httpOnly: true,
        secure: true
    }
    //console.log("this is a test");
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json (new ApiResponce(200,{}, "User Logged Out"))

})


const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(incomingRefreshToken){
        throw new ApiError(401,"Unahthorised request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure: true
        }
        const{accessToken, newRefreshToken}=await generateAccessAndReferedhTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options )
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponce(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message|| "Invalid refresh token")
        
    }
})
export {
    loginUser,
    logoutUser, 
    registerUser,
    refreshAccessToken

 
}