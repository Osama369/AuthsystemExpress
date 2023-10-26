import userModel from "../models/User.js";
import jwt from "jsonwebtoken";

// token denge 

var checkUserAuth = async (req, res, next)=>{
   
    let token 
    const {authorization}= req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
             token= authorization.split(' ')[1] 

             // verify token
             const {userID}= jwt.verify(token,process.env.JWT_SECRET_KEY)

             // get user from the token
             req.user= await userModel.findById(userID)
             next()

        } catch (error) {
              console.log(error);
              res.status(400).send({
                status: 'failed',
                message: 'Unuthorized user',
            });
        }
    }
    if (!token) {
        res.status(400).send({
            status: 'failed',
            message: 'no token Unauthorized user',
        });
    }
}
export default checkUserAuth