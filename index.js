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
app.use("/public", express.static(path.join(__dirname, "public")));

// Session configuration
app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: 'mysecretcode',
    resave: false,
    saveUninitialized: true,
}));

// Database connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Pro'
});

con.connect((err) => {
    if (err) {
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ MySQL: " + err.stack);
        return;
    }
    console.log("เชื่อมต่อ MySQL สำเร็จ ID: " + con.threadId);
});

// Import routes from project.js
require('./project.js');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
}); 