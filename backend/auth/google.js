const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOrCreateGoogle(profile);
    // Download Google profile image and save locally
    const pictureUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
    if (pictureUrl && user && user.userid) {
      const ext = path.extname(pictureUrl.split('?')[0]) || '.jpg';
      const filename = `google_${user.userid}${ext}`;
      const imagePath = path.join(__dirname, '../images', filename);
      const localPath = `/images/${filename}`;
      try {
        const response = await axios.get(pictureUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, response.data);
        await User.updateProfileImage(user.userid, localPath);
        user.picture = localPath;
      } catch (err) {
        console.error('Failed to download Google profile image:', err);
      }
    }
    return done(null, user);
  } catch (err) {
    console.error('GoogleStrategy error:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj)); 