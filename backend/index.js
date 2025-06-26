const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/frontend', express.static(path.join(__dirname, '../frontend/public')));
// app.use("/public", express.static(path.join(__dirname, "public")));

// Session configuration
app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: 'mysecretcode',
    resave: false,
    saveUninitialized: true,
}));

// Import routes from project.js
const userRoutes = require('./routes/user.routes');
const staticRoutes = require('./routes/static.routes');
const assetRoutes = require('./routes/asset.routes');
const borrowRoutes = require('./routes/borrow.routes');
const lecturerRoutes = require('./routes/lecturer.routes');

app.use('/', userRoutes);
// app.use('/', staticRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/lecturer', lecturerRoutes);

app.get('/', (req, res) => {
    res.redirect('/frontend/web_pro/login%20regis/login.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
}); 