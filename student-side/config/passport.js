const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const userModel=require('./database');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await userModel.findOne({ username: username });

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await userModel.findById(id);
        
        if (!user) {
            return done(null, false); 
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
});
