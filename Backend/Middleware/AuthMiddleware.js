const AsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

const Protect = AsyncHandler(async (req, res, next) => {
    try {
        if(!req.headers.authorization)
        {
           res.status(401).json({ success:false , message:"Not Authorized!(You are not sending token with request)"})
        }
        else if(!req.headers.authorization.startsWith("Bearer"))
        {
           res.status(401).json({ success:false , message:"Not Authorized!(Token not starts with Bearer)"})
        }
        
        //get token from
        let token = req.headers.authorization.split(" ")[1]
    
        //verify token
        const decoded = jwt.verify(token,process.env.JWT_Secret)
    
        req.user = await User.findById(decoded.id).select("-password")
    
        next()
    } catch (error) {
        res.status(401).json({ success:false , message:"Not Authorized"})
    }   
});

module.exports = Protect;
