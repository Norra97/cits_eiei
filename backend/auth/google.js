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
    // เมื่อได้ profile.photos[0].value (url)
    let pictureUrl = profile.photos && profile.photos[0] && profile.photos[0].value ? profile.photos[0].value : '/images/placeholder.png';
    if (pictureUrl.length > 1024) pictureUrl = '/images/placeholder.jpg';
    // ส่ง pictureUrl นี้ไปบันทึกใน database (ไม่ต้องดาวน์โหลดรูป)
    return done(null, user);
  } catch (err) {
    console.error('GoogleStrategy error:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj)); 