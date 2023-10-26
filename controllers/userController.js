// in this we  will control our user model and  user schema  here
import userModel from "../models/User.js";
import bycript from 'bcrypt';
import jwt from "jsonwebtoken";


class userController {
    // arrow function here 
    static userRegister = async (req, res) => {
        const { userName, email, password, confirm_password } = req.body
        // agar user already email se register ha  to error aygi
        const user = await userModel.findOne({ email: email })
        if (user) {
            res.status(400).send({
                status: 'failed',
                message: 'user is already registered .',
            });
        } else {
            // let user regiseter and validate the user fields her
            if (userName && email && password && confirm_password) {
                // chaeck if the both password are matched here so move forward 
                if (password === confirm_password) {
                    try {
                        // let bcrypt the password 
                        const salt = await bycript.genSalt(10)
                        const hashedPassword = await bycript.hash(password, salt)
                        const data = new userModel({
                            userName: userName,
                            email: email,
                            password: hashedPassword
                        })
                        await data.save();
                        const savedUser = await userModel.findOne({ email: email })
                        // generate Token
                        const token = jwt.sign({ userID: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });

                        res.status(200).send({
                            status: "success",
                            message: "user registered successfully"
                        })
                        // console.log(token);

                    } catch (error) {
                        console.log(error);
                        res.status(400).send({
                            status: 'failed',
                            message: 'Unable to register.',
                        });
                    }

                } else {
                    res.status(400).send({
                        status: 'failed',
                        message: 'Password doesnt match.',
                    });
                }
            } else {
                res.status(400).send({
                    status: 'failed',
                    message: 'all fields are required.',
                });
            }
        }
        return user;
    }

    static userLogin = async (req, res) => {
        const { email, password } = req.body
        try {
            if (email && password) {
                const user = await userModel.findOne({ email: email })
                // check if the user is register and not null
                if (user != null) {
                    const validPassword = await bycript.compare(password, user.password);
                    if ((user.email === email) && validPassword) {
                     const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.status(200).send({
                            status: 'success',
                            message: 'user login successfully',"token":token
                        });
                    console.log(token);
                        
                    } else {
                        res.status(400).send({
                            status: 'failed',
                            message: 'email or password invalid.',
                        });
                    }
                } else {
                    res.status(500).send({
                        status: 'failed',
                        message: 'user not registered.',
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
                status: 'failed',
                message: 'unable to login .',
            });
        }
    }

    // method to provide user to change the passsword if the user is login so we will create middleware to protect the route so that only authenticate  user can changed tire password
     static changeUserPassword = async (req, res)=>{
         // destructe then password and confirm password

        const {password,confirm_password}= req.body

        if (password && confirm_password) {
            // check if the password and cofirm password matched or not
              if (password!==confirm_password) {
                res.status(400).send({
                    status: 'failed',
                    message: 'password not matched.',
                });
              }else{
                // agar match hojat han to pasword ko hashed karo or 
                const salt = await bycript.genSalt(10)
                const newhashedPassword = await bycript.hash(password, salt)
                 await userModel.findByIdAndUpdate(req.user._id, {$set:{
                    password:newhashedPassword
                 }})
                res.status(400).send({
                    status: 'success',
                    message: 'password changed sucsessfully',
                });
              }
        }else{
            res.status(400).send({
                status: 'failed',
                message: 'all fields are required',
            });
        }
     }

      // loged user     
     static logedUser= async (req, res)=>{
            res.send({"user": req.user})
     }
     

     // is method k zarye link banegi wo send krenege email id pr user ko
     static sendEmailPasswordReset= async (req,res)=>{
          const {email}=req.body
          if (email) {
               const user= await userModel.findOne({email:email})
                  // agar user milgaya 
                  if (user) {
                        // ham is link bhejenge user ko us link se wo password ko reset karskta ha
                        const secret= user._id + process.env.JWT_SECRET_KEY
                        const token= jwt.sign({userID: user._id},secret,{
                            expiresIn:"15m"
                        })
                        // is link pr hit krke password reset krskte han
                        const link= `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`

                        console.log(link);
                        res.status(200).send({
                            status: 'success',
                            message: "password reset email sent... plz check at your email",
                        });
                        // api/user/reset/:id/:token
                  }else{
                    res.status(400).send({
                        status: 'failed',
                        message: "email does't match",
                    });
                  }
          }else{
            res.status(400).send({
                status: 'failed',
                message: 'all fields are required',
            });
          }
     }
       // now ab ham pasword ko update kre database me save karwayenge

       static userResetPassword= async (req, res)=>{
             // link l through password change karenge
             const {password,confirm_password}=req.body
             const {id,token}=req.params
             const user= await userModel.findById(id);
             const newToken= user._id + process.env.JWT_SECRET_KEY
             try {
                   jwt.verify(token, newToken)
                   if (password && confirm_password) {
                    if (password!==confirm_password) {
                        res.status(400).send({
                            status: 'failed',
                            message: 'password dont match',
                        });
                    }else{
                        // update or reset the password here
                        const salt = await bycript.genSalt(10)
                        const newhashedPassword = await bycript.hash(password, salt)
                         await userModel.findByIdAndUpdate(user._id, {$set:{
                            password:newhashedPassword
                         }})
                         res.status(200).send({
                            status: 'success',
                            message: 'password reset successfully',
                        });
                    }
                    
                   }else{
                    res.status(400).send({
                        status: 'failed',
                        message: 'all fields are required',
                    });
                   }
             } catch (error) {
                res.status(400).send({
                    status: 'failed',
                    message: 'unable to reset the password',
                });
             }

       }

       // logout functionality here

       static logout= async(req, res)=>{
           const {email}= req.body
           try {
            if (email) {
                const user= await userModel.findOne({email:email});
                if (user) {
                const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1s' })

                res.status(200).send({
                    status: 'success',
                    message: 'User logged out successfully.',
                });
            
                }else{
                    res.status(400).send({
                        status: 'failed',
                        message: "User not found. Couldn't log out.",
                    });
                    }
                }else{
                    res.status(400).send({
                        status: 'failed',
                        message: 'Email is required.',
                    });
                }
           } catch(error){
            console.error(error);
            res.status(500).send({
              status: 'error',
              message: 'An error occurred during logout.',
            });
           }
           }

       }


// this controller will be use in the user router as routes
export default userController