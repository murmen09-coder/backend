const asyncHandler=(requestHandler)=>{
    (req,res, next)=>{
        Promise.resolve(requestHandler(req.res.ext)).catch((err)=>next=(err))
    }
    return
}



    export{asyncHandler}

/*    const asyncHandler=(fn) =>async(req,res,next)=>{
        try{

            await fn(req,res,next)
        }catch(error){
            res.statud(error.code || 500).jason({
                sucess:false,
                message: error.message
            })
        }
    }*/