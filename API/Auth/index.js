import express from "express";
import bcrypt from "bcryptjs";

//Models
import {UserModel} from "../../database/user";

//Validations
import {ValidateSignup, ValidateSignin} from "../../validation/auth";

const Router = express.Router();

/*
Route       /signup
Des         Signup using email and password
Params      None
Access      Public
Method      POST
*/

Router.post("/signup", async(req,res)=> {
  try {
    await ValidateSignup(req.body.credentials);
    const {email, password, fullname, phoneNumber} = req.body.credentials;

    const checkUserByEmail = await UserModel.findOne({email});
    const checkUserByPhone = await UserModel.findOne({phoneNumber});

    if(checkUserByEmail || checkUserByPhone) {
      return res.json({error: "User already Exists!!!!!!"});
    }

//hashing ur passowrd
    const bcryptSalt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);

//save to DB
await UserModel.create({
  ...req.body.credentials,
  password: hashedPassword
});

//JWT Token
const token = jwt.sign({user: {fullname, email}}, "ZomatoApp");

return res.status(200).json({token, status: "success"});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

//xyz555 -> hfhaFu%&v12**hvj -> vhgk -> ggkj

/*
Route       /signin
Des         Signin using email and password
Params      None
Access      Public
Method      POST
*/

Router.post("/signin", async(req,res)=> {
  try {
   await ValidateSignin(req.body.credentials);
   const user = await UserModel.findByEmailAndPassword(
     req.body.credentials
   );
   const token = user.generateJwtToken();
   return res.status(200).json({token, status: "success"});
     } catch (error) {
       return res.status(500).json({error: error.message});
     }
});
