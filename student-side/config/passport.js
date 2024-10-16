const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('./database.js'); // Import your user model

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extract token from header
opts.secretOrKey = 'abc'; // Replace with your secret key, or use dotenv for security

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("JWT Payload:", jwt_payload); // Debugging
    
    try {
        // Use async/await to find the user by id
        const user = await userModel.findById(jwt_payload.id);
        
        if (user) {
            console.log("User found:", user); // Debugging
            return done(null, user); // User found
        } else {
            console.log("User not found with this id"); // Debugging
            return done(null, false); // No user found
        }
    } catch (err) {
        console.log("Error finding user:", err); // Debugging
        return done(err, false); // Error occurred
    }
}));
