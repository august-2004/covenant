const express = require('express');
const app = express();
const cors=require('cors');
const {hashSync, compareSync}=require('bcrypt');
const userModel=require('./config/database.js');
const dotenv = require('dotenv');
const jwt=require('jsonwebtoken');
const passport = require('passport');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

require('./config/passport.js');

app.post('/register',(req,res)=>{
    const user=new userModel({
        username:req.body.username,
        password:hashSync(req.body.password,10)
    });

    user.save().then(user=>{
        res.send({
            success:true,
            message:"user created successfully",
            user:{
                id:user._id,
                username:user.username
            }
        });
    }).catch(err =>{
        res.send({
            success:false,
            message:"something went wrong",
            error:err
        });
    });
});

app.post('/login',(req,res)=>
    userModel.findOne({ username:req.body.username}).then(user=>{
        if(!user){
            return res.status(401).send({
                success:false,
                message:"user not found"
            });
        }

        if(!compareSync(req.body.password,user.password)){
            return res.status(401).send({
                success:false,
                message:"incorrect password"
            });
        }

        const payload={
            username:user.username,
            id:user._id
        }
        const token=jwt.sign(payload, process.env.sec, {expiresIn:"1d"});

        return res.status(200).send({
            success:true,
            message:"logged in successfully:)))",
            token:"Bearer "+token
        });
    }));

app.get('/protected',passport.authenticate('jwt',{session:false}),(req,res)=>{
    console.log("User authenticated:", req.user);
    return res.status(200).send({
        success:true,
        user: {
            id:req.user._id,
            username:req.user.username
        }
    });
});    

app.listen(5000,()=>{
    console.log("listening on port 5000");
})    