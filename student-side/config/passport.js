const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('./database.js'); 

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'abc';

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("JWT Payload:", jwt_payload); 
    
    try {
        const user = await userModel.findById(jwt_payload.id);
        
        if (user) {
            console.log("User found:", user); 
            return done(null, user); 
        } else {
            console.log("User not found with this id"); 
            return done(null, false);

        if (!user) {
            return done(null, false); 
        }
    } catch (err) {
        console.log("Error finding user:", err); 
        return done(err, false);
    }
}));
