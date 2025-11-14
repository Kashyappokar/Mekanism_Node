const User = require('../schema/user.schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const dotenv = require('dotenv')
const { ApiResponse } = require('../utils/ApiResponse')
const { ApiErrors } = require('../utils/ApiErrors')
const logger = require('../utils/logger')

dotenv.config()

const createUser = async(req , res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        logger.error(`Data to create user missing.`)
        return res.status(400).json( new ApiErrors(
            "All Fields are required!"
        ))
    }

    const loweredEmail = email.toLowerCase()
    
    
    try {
        
        //check existing user
        const existingUser = await User.findOne({email: loweredEmail}) 
        
        if(existingUser){
            logger.error(`User already exist.`)
            return res.status(400).json(new ApiErrors(
                "User already exist."
            ))
        }

        const user = await User.create({
            name, email, password
        });

        if(!user){
            logger.error("Error create user method. DataBase")
            return res.status(400).json(new ApiErrors(
                "Error While User registration."
            ))
        } 
        
        
        await user.save()
        logger.info(`New user created.`)
        res.status(201).json(
            new ApiResponse(
                "User registered successfully.",
                user 
            ))
      

    } catch(error) {

        logger.error(`Create method [Error: "${error.message}"]`)
        return res.status(500).json(new ApiErrors(
           error.message || "Create user Error."
        ))
    }
}

const loginUser = async(req , res) => {

    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
    
        if (!user) {
            logger.error(`User email in invalid.`)
            return res.status(400).json(new ApiErrors(
                "Entered Email is invalid."
            ))
        }
    
    
    
        const isMatched = await bcrypt.compare(password, user.password)
    
        if(!isMatched){
            logger.error(`Password entered doesn't match.`)
            return  res.status(400).json(new ApiErrors(
                "Entered Password is invalid."
            ))
            
        }
    
        const token = jwt.sign({
            _id: user?._id, 
            email: user?.email,
            role: user?.role
        },process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_TIMEOUT})

        // localStorage.setItem("token", token)
        // console.log(localStorage.getItem("token"))
    
        
        const cookieOption = {
            httpOnly: true,
            secure: true
        }

        res.cookie("token",token,cookieOption);
        
        logger.info("User login in successfull.")
        res.status(200).json(new ApiResponse(
            "Token generated",
            token
        ))
    
    } catch (error) {
        logger.error(`Error while. [Error: "${error.message}"]`)
        return res.status(500).json(new ApiErrors(
            error.message || `Error in login user method.`
        ))    
    }
    
}

const getUserProfile = async(req, res) => {

    try {

        const user = req.user
        const userData = User.findById(user?._id).select("-password")

        if(!userData){
            logger.error(`User is not logged In.`)
            return res.status(400).json(new ApiErrors(
                "User aren't logged in."
            ))
         
        }

        logger.info(`User profile found.`)
        res.status(200).json(new ApiResponse(
            "User Found.",
            user
        ))
}   catch(error){
        logger.error(`getUserProfile [Error: "${error.message}"]`)
        return res.status(500).json(new ApiErrors(
                error.message || "Error in getUserProfile method."
            ))
    }
}

const logOut = async(req, res) => {
    try {
        res.cookie('token',"",{})
        logger.info(`User LoggedOut.`)
        res.status(200).json(new ApiResponse(
            "User LoggedOut successfully."
        ))
    } catch (error) {
        logger.error(`Logout method [Error: "${error.message}"]`)
        return res.status(500).json(new ApiErrors(
            error.message || "Error in logout method."            
        ))
    }
}

const pagiNation = async(req, res) => {
    
}

module.exports = {createUser, loginUser, getUserProfile, logOut}