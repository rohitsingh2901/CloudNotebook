const express = require('express');
const route = express.Router();
const user = require('../models/Users')
const { body , validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../Middleware/fetchUser')

// It must be kept confidential and known only to the parties involved in token generation and verification
const JWT_SecretToken = "Rohiht@dh&%*$9@jdhin";



//Route 1 : Create user
route.post('/create_users',[body('Email',"Enter a valid email").isEmail(),body('Name',"Name must be atleast 3 character long").isLength({min:3})], async(req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({errors:result.array()})
    }
    try{
    let u  = await user.findOne({Email : req.body.Email})
    if(u){
      return res.status(400).json({errors:"Sorry email already exists"})
    }
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.Password, salt);
    // console.log(hash);

    await user.create({
        Name:req.body.Name,
        Email:req.body.Email,
        Password:hash
    })
    const data = {
      user:{
        id : user.id
      }
    }
    const authToken = jwt.sign(data,JWT_SecretToken);
    // res.send(curruser)
    res.send({authToken})

  }
  catch{
    return res.status(500).json({error : "Internal server Error. Please try again later..."})
  }
})





//Route 2 : login user authentication

route.post('/login',
[body('Email',"Enter a valid email").isEmail().exists(),body('Password').exists()], async(req,res)=>{
  try{
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({errors:result.array()})
  }

  const userExists = await user.findOne({Email : req.body.Email});
  if(!userExists){
    return res.status(400).json({error : "Invalid credentials"})
  }

  const passCompare  = await bcrypt.compare(req.body.Password,userExists.Password);

  if(!passCompare){
    return res.status(400).json({error : "Invalid credentials"})
  }
  const data = {
    user:{
      id : userExists.id
    }
  }
  console.log(data.user.id)
  const authToken = jwt.sign(data,JWT_SecretToken);
  // res.send(curruser)
  res.send({authToken})

}
catch{
  return res.status(500).json({error : "Internal server Error. Please try again later..."})
}



})


// Route 3 : Get info of logged in user
route.post('/getuser',fetchUser, async(req,res)=>{
  try {
    const userID = req.user.id;
    console.log(userID)
    const u = await user.findById(userID).select('-Password');
    console.log(u)
    res.send(u);
  } catch (error) {
  return res.status(500).json({error : "Internal server Error. Please try again later..."})
  }
})



module.exports = route