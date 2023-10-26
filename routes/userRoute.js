import express, { urlencoded } from "express";

const userRoute= express.Router()
import userController from "../controllers/userController.js";
import checkUserAuth from "../middleware/authMiddleware.js";

userRoute.use("/changepassword",checkUserAuth)
userRoute.use("/loggedUser",checkUserAuth)
userRoute.use("/logout",checkUserAuth)

// public routes and
//1. userRegister is method to get registered
// 2. userLogin is method to get Login  
userRoute.post('/register',userController.userRegister)  
userRoute.post("/login",userController.userLogin)
userRoute.post("/sendResetPasswordEmail",userController.sendEmailPasswordReset)
userRoute.post("/resetPassword/:id/:token", userController.userResetPassword)

//protected routes
userRoute.post("/changepassword",userController.changeUserPassword)
userRoute.get("/loggedUser",userController.logedUser)
userRoute.post("/logout",userController.logout)
export default userRoute

