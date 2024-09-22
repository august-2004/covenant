const express=require('express');
const app=express();
const userModel=require('./config/database');
const {hashSync}=require('bcrypt');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const passport = require('passport');

app.set('view engine','ejs');
app.use(express.urlencoded({ extended:true }));

app.listen(5000,(req,res) => {
    console.log("Listening on port 5000");
})

require('./config/passport');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({mongoUrl: 'mongodb+srv://srinidhi:sri2004@srinidhicluster.fupcmdo.mongodb.net/sessions?retryWrites=true&w=majority',collectionName:"sessions"}),
  cookie: { 
    maxAge: 1000*60*60*24
   }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/register',(req,res) => {
    res.render('register');
});

app.get('/login',(req,res) => {
    res.render('login');
});

app.post('/register',(req,res) => {
    let user=new userModel({
        username:req.body.username,
        password:hashSync(req.body.password,10)
    });

    user.save().then(user=>console.log(user));
    res.send({success:true});
});

app.post('/login',passport.authenticate('local',{successRedirect:'protected'}));

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  
        }
        res.redirect('/login');  
    });
});


app.get('/protected',(req,res) => {
    if(req.isAuthenticated()){
        res.send("protected");
    }else{
        res.status(401).send({msg:"unauthorized"});
    }
    console.log(req.session);
    console.log(req.user);
});