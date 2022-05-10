const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: 'http://localhost:3000/auth/google/callback',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(refreshToken);
      // console.log(profile);
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        console.log('existingUser:', existingUser);
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName,
        }).save();
        console.log('user:', user);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
