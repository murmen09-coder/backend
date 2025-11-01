//require('dotenv').config({path:'./env'})
//import mongoose from "mongoose"
//import{DB_NAME} from "./constants.js"

import dotenv from 'dotenv'

import connectDB from "./db/index.js"

dotenv.config({path:'./env'})
connectDB()



/* 
import express from "express"
const app = express()
( async()=> {
    try {
        await mongoose.connect('${process.env.MONGODB_URI}/${DB_NAME}')
            app.on(error,(error)=>{
                console.log ("Error : to abe to open")
                throw error
            })

        app.listing(process.env.PORT,()=>{
            console.log('App is listening on port $ {process.env.PORT}')
        })

    }catch(error){
        console.log("ERROR:Cannot connect to DB ", error)
        throw error

    }
    
})()

*/