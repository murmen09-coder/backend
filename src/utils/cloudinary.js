import{v2 as cloudinary} from "cloudinary"
import fs from "fs"

  // Configuration
    cloudinary.config({ 
                
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys' above to copy your API secret
    });
    

    // Upload an image
     const uploadOnCloudinary = async(localFilePath)=> {
        try{
            if(!localFilePath) return null
            const response= await cloudinary.uploader.upload(localFilePath,{resourse_type: "auto"})
            console.log("file uploaded on cloudniry", response.url)
            fs.unlinkSync(localFilePath)
            
            return response;
            

         return response
       
        } catch (error) {
            fs.unlinkSync(localFilePath)// remove the local tem file as upload operation failded
            return null;
       }};

       export{uploadOnCloudinary}