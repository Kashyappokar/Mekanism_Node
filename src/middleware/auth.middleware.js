const jwt = require('jsonwebtoken')
const User = require('../schema/user.schema')
const {ApiErrors} = require('../utils/ApiErrors')
const logger = require('../utils/logger')

const loggedIn = async(req, res, next) => {
    try {
        const token =  req.cookies?.token

        if(token === "" || !token){
            logger.error(`User is not logged in.`)
            res.status(400).json(new ApiErrors(
                "User is Not logged In"
            ))
        }
        
        // const token = window.localStorage.getItem("token")
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        const user = await User.findById(decodedToken?._id).select("-password")
        req.user = user
    
        next();
    } catch (error) {
        logger.error(`Middleware malfunction. [Error: "${error.message}"]`)
        return res.status(500).json(new ApiErrors( 
           error.message || "Auth MiddleWare Malfunction." 
        ))
    }
}

module.exports = loggedIn