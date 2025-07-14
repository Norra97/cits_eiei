const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
require('./auth/google');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./routes/auth');
app.use('/api', authRouter);

const userRouter = require('./routes/user');
app.use('/api/users', userRouter);

const equipmentRouter = require('./routes/equipment');
app.use('/api/equipment', equipmentRouter);

const borrowRouter = require('./routes/borrow');
app.use('/api/borrow', borrowRouter);

// Google OAuth2 routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) {
      // ไม่พบ user ในระบบ
      return res.redirect('http://localhost:5173/login?error=notfound');
    }
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({
      id: req.user.userid,
      username: req.user.username,
      email: req.user.useremail,
      role: req.user.role,
      picture: req.user.picture // เพิ่ม picture ใน payload
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Google OAuth callback req.user:', req.user);
    console.log('Google OAuth callback token:', token);
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 