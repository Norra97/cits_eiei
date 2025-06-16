const express = require("express");
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const session = require('express-session'); // session
const bodyParser = require('body-parser');
const { log, profile } = require("console");
const cors = require('cors');
const app = express();
const multer = require('multer');



app.use(cors());
app.use(bodyParser.json());
app.use("/public", express.static('/Users/phakornc/Desktop/web appppp/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//-----session-----//
app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Set the session timeout (in milliseconds)
    secret: 'mysecretcode', // Secret used to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
}));



//-----database-----//
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Pro'
});



const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Pro',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



con.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as id " + con.threadId);
});





//---POST---//
//-----Register-----//

app.post("/register", async function (req, res) {
    const { username, password, role, phonenum, department, useremail } = req.body;

    // Check for empty fields
    if (!username || !password || !role || !phonenum || !department || !useremail) {
        res.status(400).send("All fields are required!");
        return;
    }

    // Validate Email Format
    const emailRegex = /^[0-9]{10}@lamduan\.mfu\.ac\.th$/;
    if (!emailRegex.test(useremail)) {
        res.status(400).send("Invalid email format! Use 'xxxx@lamduan.mfu.ac.th'");
        return;
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check for duplicate username or email
        const sqlCheck = "SELECT userid FROM user WHERE username = ? OR useremail = ?";
        con.query(sqlCheck, [username, useremail], async function (err, results) {
            if (err) {
                res.status(500).send("Database error!");
            } else if (results.length > 0) {
                res.status(400).send("Username or Email already exists!");
            } else {
                const sqlInsert = "INSERT INTO user (username, password, role, phonenum, department, useremail) VALUES (?, ?, ?, ?, ?, ?)";
                con.query(sqlInsert, [username, hashedPassword, role, phonenum, department, useremail], function (err) {
                    if (err) {
                        res.status(500).send("Database error during registration!");
                    } else {
                        res.status(200).send("Successfully registered!");
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).send("Error during password hashing!");
    }
});


//-----Login-----//
app.post("/login", async function (req, res) {
    const identifier = req.body.username;
    const password = req.body.password;

    const sql = `
        SELECT userid, username, password, role, department, useremail, phonenum
        FROM user
        WHERE username = ? OR useremail = ?
    `;

    con.query(sql, [identifier, identifier], async function (err, results) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Database error!!");
        }

        if (results.length !== 1) {
            return res.status(401).send("Wrong username/email or password!!");
        }

        const user = results[0];
        
        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).send("Wrong username/email or password!!");
        }

        console.log("Login successful. User data:", user);

        res.json({
            success: true,
            username: user.username,
            userid: user.userid,
            department: user.department || "Undefined",
            useremail: user.useremail,
            phonenum: user.phonenum
        });
    });
});


//-----Role-----//
app.post("/userRole", function (req, res) {
    const username = req.body.username;
    if (!username) {
        res.status(400).send("Username is required");
        return;
    }

    const sql = "SELECT role FROM user WHERE username = ?";
    con.query(sql, [username], function (err, results) {
        if (err) {
            res.status(500).send("Database error!!");
        } else if (results.length !== 1) {
            res.status(401).send("Wrong username or user not found!!");
        } else {
            const userRole = results[0].role;

            if (userRole === 1) {
                res.json({ role: "student" });
            } else if (userRole === 2) {
                res.json({ role: "staff" });
            } else if (userRole === 3) {
                res.json({ role: "lecturer" });
            } else {
                res.status(403).send("Invalid role");
            }
        }
    });
});


//---root service---//
app.get("/", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/login regis/login.html"));
});



//---Student---//
//-----Route to serve the student home page-----//
app.get("/student", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-dash.html"));
});
//-----Route to serve the Asset student home page-----//
app.get("/student/Asset", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-asset.html"));
});
//-----Route to serve the Asset Accept student home page-----//
app.get("/student/Asset-accept", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-asset accept.html"));
});
//-----Route to serve the Calendar student home page-----//
app.get("/student/calendar", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/calendar.html"));
});
//-----Route to serve the setting page-----//
app.get("/settings/std", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-sta-rt.html"));
});

app.get("/student/sta/pd", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-sta-pd.html"));
});
app.get("/student/sta/rt", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-sta-rt.html"));
});

app.get("/student/sta/br", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-sta-br.html"));
});
app.get("/student/sta/rj", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-sta-rj.html"));
});
app.get("/student/sta/rpd", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-sta-rpd.html"));
});
app.get("/student/set", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-setting.html"));
});


//---staff---//
//-----Route to the staff home page-----//
app.get("/staff", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/staff/stf-dash.html"));
});

//-----Route to EditAsset-----//
app.get("/staff/Edit-Asset", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/staff/test.html"));
});

//-----Route to staff History-----//

app.get("/staff/History", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/staff/stf-history.html"));
});

app.get("/staff/History-Re", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/staff/stf-history-re.html"));
});


//-----Route to  staff Returning-----//
app.get("/staff/Returning", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/staff/stf-returning.html"));
});

//-----Route to serve the setting page-----//
app.get("/settings/stf", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/staff/stf-setting.html"));
});


//-----Route to serve the lecturer dashboard page-----//
app.get("/lecturer", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lec-dash.html"));
});

app.get("/lecturer/MangeUser", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lec-mangeuser.html"));
});

app.get("/lecturer/Borrowing-requests", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lec-borr-req.html"));
});

app.get("/lecturer/history", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lec-history.html"));
});

//-----Route to serve the setting page-----//
app.get("/settings/lec", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lec-setting.html"));
});

app.get("/lecturer/AddAsset", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lec-addasset.html"));
});




app.get("/login", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/login regis/login.html"));
});


//-----Route to serve the register page-----//
app.get("/register", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/login regis/register.html"));
});



// ------ Logout -------//
app.get("/logout", function (req, res) {
    // Clear session variables
    req.session.destroy(function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Cannot clear session");
        } else {
            // Set response headers to prevent caching
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.set('Expires', '-1');
            res.set('Pragma', 'no-cache');

            // Redirect to the root service
            res.json({ redirect: "/" }); // Send a JSON response with the redirect URL
        }
    });
});


// Endpoint to update username
app.post("/updateUsername", async (req, res) => {
    const { userID, newUsername } = req.body;
    console.log(userID)
    // Check if new username already exists
    const sqlCheck = "SELECT userid FROM user WHERE username = ?";
    con.query(sqlCheck, [newUsername], function (err, results) {
        if (err) {
            return res.status(500).send("Database error!!");
        }
        if (results.length > 0) {
            return res.status(400).send("Username already taken!!");
        }

        // Update username
        const sqlUpdate = "UPDATE user SET username = ? WHERE userid = ?";
        con.query(sqlUpdate, [newUsername, userID], function (err) {
            if (err) {
                return res.status(500).send("Database error during username update!!");
            }
            res.status(200).send("Username successfully updated!");
        });
    });
});

// Get all assets
app.get("/assets", function (req, res) {
    const sql = "SELECT * FROM Asset WHERE Assetstatus IN ('Available', 'Disabled')";

    con.query(sql, function (err, results) {
        if (err) {
            console.error("Database error:", err); // แสดงข้อผิดพลาดใน console
            res.status(500).send("Database error!!");
        } else {
            console.log("Assets retrieved:", results); // ตรวจสอบผลลัพธ์
            res.json(results);
        }
    });
});



// Add a new asset

// ตั้งค่าที่เก็บไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Addimg'); // เส้นทางสำหรับเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
    }
});

// ตัวกรองไฟล์ (ตรวจสอบชนิดไฟล์)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};

// กำหนดการอัปโหลด
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type'), false);
        } else if (file.size > 2 * 1024 * 1024) { // จำกัดขนาดที่ 1MB
            cb(new Error('File size exceeds limit of 2MB'), false);
        } else {
            cb(null, true);
        }
    },
});

// Route สำหรับเพิ่มสินทรัพย์
app.post('/assets', upload.single('Assetimg'), (req, res) => {
    console.log('--- Request Received ---');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    const { Assetname, Assetdetail, Assetcode, Assetlocation, Staffaddid, Assetstatus, Assettype } = req.body;
    const Assetimg = req.file ? req.file.filename : null;

    // ตรวจสอบว่าข้อมูลจำเป็นครบถ้วนหรือไม่
    if (!Assetname || !Assetdetail || !Assetcode || !Assetlocation || !Staffaddid || !Assetstatus || !Assettype) {
        console.error('Missing required fields:', {
            Assetname, Assetdetail, Assetcode, Assetlocation, Staffaddid, Assetstatus, Assettype
        });
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
            missingFields: {
                Assetname: !Assetname,
                Assetdetail: !Assetdetail,
                Assetcode: !Assetcode,
                Assetlocation: !Assetlocation,
                Staffaddid: !Staffaddid,
                Assetstatus: !Assetstatus,
                Assettype: !Assettype
            }
        });
    }

    // ตรวจสอบว่า asset type มีอยู่ในฐานข้อมูลหรือไม่
    const checkTypeSql = "SELECT asset_type_name FROM asset_type WHERE asset_type_name = ?";
    con.query(checkTypeSql, [Assettype], (typeErr, typeResults) => {
        if (typeErr) {
            console.error('Error checking asset type:', typeErr);
            return res.status(500).json({
                success: false,
                message: 'Error checking asset type'
            });
        }

        if (typeResults.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid asset type'
            });
        }

        // SQL Query สำหรับเพิ่มข้อมูล
        const sqlInsert = `
            INSERT INTO asset (Assetname, Assetdetail, Assetcode, Assetlocation, Assetimg, Staffaddid, Assetstatus, Assettype) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // ใส่ค่าลงใน query
        con.query(sqlInsert, [Assetname, Assetdetail, Assetcode, Assetlocation, Assetimg, Staffaddid, Assetstatus, Assettype], (err, result) => {
            if (err) {
                console.error('Database error during insertion:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error during insertion',
                    error: err.message
                });
            }
            console.log('Database insertion success:', result);
            res.status(201).json({
                success: true,
                message: 'Asset added successfully',
                insertId: result.insertId
            });
        });
    });
});

// Edit an existing asset
app.put('/assets/:id', upload.single('Assetimg'), (req, res) => {
    const id = req.params.id;
    const { Assetname, Assetdetail, Assetcode, Assetlocation, Assettype } = req.body;
    const Assetimg = req.file ? req.file.filename : null;

    const fields = [];
    const values = [];

    if (Assetname) {
        fields.push("Assetname = ?");
        values.push(Assetname);
    }
    if (Assetdetail) {
        fields.push("Assetdetail = ?");
        values.push(Assetdetail);
    }
    if (Assetcode) {
        fields.push("Assetcode = ?");
        values.push(Assetcode);
    }
    if (Assetlocation) {
        fields.push("Assetlocation = ?");
        values.push(Assetlocation);
    }
    if (Assettype) {
        fields.push("Assettype = ?");
        values.push(Assettype);
    }        
    if (Assetimg) {
        fields.push("Assetimg = ?");
        values.push(Assetimg);
    }

    values.push(id);

    const sqlUpdate = `UPDATE Asset SET ${fields.join(", ")} WHERE Assetid = ?`;

    con.query(sqlUpdate, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error during update!");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Asset not found!");
        }
        res.status(200).json({ success: true, message: "Asset updated successfully!" });
    });
});


app.get('/asset-types', (req, res) => {
    const sql = "SELECT * FROM `asset_type`";
    con.query(sql, (err, results) => {
        if (err) return res.status(500).send("Database error");
        res.json(results);
    });
});

// Add a new asset type
// Add a new asset type
app.post('/asset-types', (req, res) => {
    const { asset_type_name } = req.body;

    // Log the incoming data
    console.log('Received asset type:', asset_type_name);

    // Validate the input
    if (!asset_type_name) {
        console.error('Asset type name is missing');
        return res.status(400).send('Asset type name is required');
    }

    const sql = "INSERT INTO `asset_type` (asset_type_name) VALUES (?)";
    con.query(sql, [asset_type_name], (err, result) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).send('Database error');
        }
        res.status(201).json({ success: true, id: result.insertId, name: asset_type_name });
    });
});

app.put('/asset-types/:id', (req, res) => {
    const { id } = req.params;
    const { asset_type_name } = req.body;
    const sql = "UPDATE `asset_type` SET asset_type_name = ? WHERE asset_type_id = ?";
    con.query(sql, [asset_type_name, id], (err, result) => {
        if (err) return res.status(500).send("Database error");
        res.status(200).json({ success: true });
    });
});

// Delete an asset type
app.delete('/asset-types/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM `asset_type` WHERE asset_type_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send("Database error");
        res.status(200).json({ success: true });
    });
});

// Endpoint: Get unavailable dates for a specific asset
app.get('/get-unavailable-dates/:assetId', (req, res) => {
    const assetId = req.params.assetId;

    const query = `
        SELECT Borrowdate, ReturnDate
        FROM BorrowReq
        WHERE Assetid = ? AND Status IN ('Pending', 'Approved', 'Borrowing')
    `;

    con.query(query, [assetId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        // สร้าง Array ของวันที่ที่ไม่สามารถยืมได้
        const unavailableDates = [];
        results.forEach(row => {
            let currentDate = new Date(row.Borrowdate);
            const endDate = new Date(row.ReturnDate);

            while (currentDate <= endDate) {
                unavailableDates.push(currentDate.toISOString().split('T')[0]); // Convert to YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        res.json(unavailableDates); // ส่งวันที่กลับ
    });
});

// Delete an asset
app.delete("/assets/:id", function (req, res) {
    const id = req.params.id;

    const sqlDelete = "DELETE FROM Asset WHERE Assetid = ?";
    con.query(sqlDelete, [id], function (err, result) {
        if (err) {
            res.status(500).send("Database error during the deletion!!");
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send("No asset found with given ID!!");
            } else {
                res.status(200).json({ success: true, message: 'Asset deleted successfully' });
            }
        }
    });
});

// ==================== ไอ้แก้ ====================
app.put('/assets/toggle-status/:id', (req, res) => {
    const id = req.params.id;
    const { newStatus } = req.body;

    const sqlUpdate = "UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?";
    con.query(sqlUpdate, [newStatus, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error during status update.");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Asset not found.");
        }
        res.status(200).json({ success: true, message: `Asset status updated to ${newStatus}` });
    });
});

app.get("/test", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/test.html"));
});
app.get("/student/asset-accept", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-asset accept.html"));
});
app.get("/lect/getreturn", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lect-return.html"));
});


// This is just a sample code, you will need to adapt it to your actual backend setup.

// ตรวจสอบวันที่ซ้อนทับ
app.post('/borrow-asset', async (req, res) => {
    const { assetId, borrowDate, returnDate, username, activity, usageType } = req.body;

    try {
        // ตรวจสอบวันที่ซ้อนทับ
        const isOverlap = await checkDateOverlap(assetId, borrowDate, returnDate);
        if (isOverlap) {
            return res.status(400).json({
                success: false,
                message: 'Date range overlaps with an active borrow request for the same asset.'
            });
        }

        // เพิ่มคำร้องในตาราง BorrowReq
        const sqlInsert = `
        INSERT INTO BorrowReq (Assetid, Borrowdate, Returndate, Status, Borrowname, Activity, UsageType)
        VALUES (?, ?, ?, 'Pending', ?, ?, ?)
        `;
        con.query(sqlInsert, [assetId, borrowDate, returnDate, username, activity, usageType], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database insertion failed: ' + err.message });
            }

            res.status(201).json({
                success: true,
                message: 'Borrow request added successfully.'
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

// ฟังก์ชันตรวจสอบวันที่ซ้อนทับ
const checkDateOverlap = (assetId, borrowDate, returnDate) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM BorrowReq
            WHERE AssetId = ? 
            AND Status IN ('Borrowing', 'Approved')
            AND (BorrowDate <= ? AND ReturnDate >= ?)
        `;
        con.query(sql, [assetId, returnDate, borrowDate], (err, results) => {
            if (err) reject(err);
            resolve(results.length > 0); // Returns true if there's an overlap
        });
    });
};

// อัปเดตสถานะ Asset
app.put('/update-asset-status/:assetId', (req, res) => {
    const assetId = req.params.assetId;
    const { status } = req.body;

    const sql = `UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?`;
    con.query(sql, [status, assetId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Asset not found or no change in status.');
        }

        res.status(200).json({ success: true, message: `Asset status updated to ${status}` });
    });
});

app.put('/return-asset/:reqId', async (req, res) => {
    const reqId = req.params.reqId;
    const { newStatus } = req.body;

    console.log(`Attempting to return asset with Request ID: ${reqId}`);

    try {
        await con.promise().beginTransaction();

        // ดึงข้อมูล Asset ID จากคำขอยืม
        const [assetResult] = await con.promise().query(
            'SELECT Assetid FROM BorrowReq WHERE Reqid = ?',
            [reqId]
        );

        if (assetResult.length === 0) {
            throw new Error('ไม่พบคำขอยืม');
        }

        const assetId = assetResult[0].Assetid;

        // อัพเดทสถานะในตาราง BorrowReq
        const [borrowUpdateResult] = await con.promise().query(
            'UPDATE BorrowReq SET Status = ? WHERE Reqid = ?',
            [newStatus, reqId]
        );

        if (borrowUpdateResult.affectedRows === 0) {
            throw new Error('ไม่สามารถอัพเดทสถานะคำขอยืมได้');
        }

        // อัพเดทสถานะอุปกรณ์ในตาราง Asset
        const [assetUpdateResult] = await con.promise().query(
            'UPDATE Asset SET Assetstatus = "Pending" WHERE Assetid = ?',
            [assetId]
        );

        if (assetUpdateResult.affectedRows === 0) {
            throw new Error('ไม่สามารถอัพเดทสถานะอุปกรณ์ได้');
        }

        await con.promise().commit();
        res.json({ success: true, message: 'อัพเดทสถานะการคืนเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการคืนอุปกรณ์:', error);
        await con.promise().rollback();
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด: ' + error.message });
    }
});

app.get('/disabled-assets-requests', async (req, res) => {
    const username = req.query.username; // Get the username from the query parameter

    const sql = `
        SELECT a.Assetid,a.Assetimg,a.Assetname,br.Status, br.comment
        FROM Asset a
        LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid
        WHERE br.Status = 'Reject' AND br.Borrowname = ?
    `;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/return-assets-requests', async (req, res) => {
    const username = req.query.username;
    const sql = `
    SELECT a.*,br.*
    FROM Asset a
    LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid
    WHERE br.Status = 'Approved' AND br.Borrowname = ?
    
    `;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/pending-assets-requests', async (req, res) => {
    const username = req.query.username;
    const sql = `
    SELECT a.Assetid, a.Assetimg, a.Assetname, a.Assetcode, a.Assetdetail, a.Assetlocation, a.Assettype,
           br.Reqid, br.Borrowdate, br.ReturnDate, br.Status, br.Activity, br.UsageType as UsageType
    FROM Asset a
    LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid
    WHERE br.Status = 'Pending' AND br.Borrowname = ?
    `;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});




app.get('/Reject-assets-requests', async (req, res) => {
    const username = req.query.username;
    const sql = `
    SELECT a.*,br.*
    FROM Asset a
    LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid
    WHERE br.Status = 'Reject' AND br.Borrowname = ?
    
`;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


app.get('/RePending-assets-requests', async (req, res) => {
    const username = req.query.username;
    const sql = `
    SELECT a.*,br.*
    FROM Asset a
    LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid
    WHERE br.Status = 'RePending' AND br.Borrowname = ?

`;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/Returned-assets-requests', async (req, res) => {
    const username = req.query.username;
    const sql = `

    SELECT a.*,br.*
    FROM Asset a
    LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid
    WHERE br.Status = 'Returned' AND br.Borrowname = ?

    
`;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/asset-borrow-requests', async (req, res) => {
    const username = req.query.username;

    const sql = `
    SELECT 
        Asset.Assetid, Asset.Assetimg, Asset.Assetname, Asset.Assetstatus, Asset.Staffaddid,
        Asset.Assetcode, Asset.Assetdetail, Asset.Assetlocation, Asset.Assettype,
        BorrowReq.Reqid, BorrowReq.Borrowdate, BorrowReq.ReturnDate, BorrowReq.lectname, 
        BorrowReq.Status, BorrowReq.Activity, BorrowReq.UsageType
    FROM Asset
    LEFT JOIN BorrowReq ON Asset.Assetid = BorrowReq.Assetid
    WHERE BorrowReq.Borrowname = ? AND BorrowReq.Status = 'Approved'
    ORDER BY BorrowReq.Borrowdate DESC
    `;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching borrow requests:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

app.delete('/cancel-asset-request/:reqId', async (req, res) => {
    const { reqId } = req.params;
    
    try {
        await con.promise().beginTransaction();

        // Get Asset ID from the request
        const [borrowReq] = await con.promise().query(
            'SELECT Assetid FROM BorrowReq WHERE Reqid = ? AND Status = "Pending"',
            [reqId]
        );

        if (borrowReq.length === 0) {
            throw new Error('Request not found or already processed');
        }

        const { Assetid } = borrowReq[0];

        // Delete the borrow request
        const [deleteResult] = await con.promise().query(
            'DELETE FROM BorrowReq WHERE Reqid = ? AND Status = "Pending"',
            [reqId]
        );

        if (deleteResult.affectedRows === 0) {
            throw new Error('Failed to delete request');
        }

        // Update asset status back to Available
        const [assetResult] = await con.promise().query(
            'UPDATE Asset SET Assetstatus = "Available" WHERE Assetid = ?',
            [Assetid]
        );

        if (assetResult.affectedRows === 0) {
            throw new Error('Failed to update asset status');
        }

        await con.promise().commit();
        res.json({ success: true, message: 'Request cancelled successfully' });
    } catch (error) {
        await con.promise().rollback();
        console.error('Error cancelling request:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.delete('/getreturn-asset/:assetId', async (req, res) => {
    const assetId = req.params.assetId;

    try {
        await con.promise().beginTransaction();

        // Update Asset table to set Assetstatus to 'Available'
        const updateAssetStatusQuery = 'UPDATE Asset SET Assetstatus = "Available" WHERE Assetid = ?';
        const [assetUpdateResult] = await con.promise().query(updateAssetStatusQuery, [assetId]);

        if (assetUpdateResult.affectedRows === 0) {
            throw new Error('Asset not found');
        }

        // Update the row in BorrowReq table to set Status to 'Returned'
        const updateBorrowReqStatusQuery = 'UPDATE BorrowReq SET Status = "Returned" WHERE Assetid = ?';
        const [borrowReqUpdateResult] = await con.promise().query(updateBorrowReqStatusQuery, [assetId]);

        // Check if the update operation was successful
        if (borrowReqUpdateResult.affectedRows === 0) {
            throw new Error('Borrow request not found or already returned');
        }

        await con.promise().commit();
        res.json({ success: true, message: 'Asset returned and borrow request status updated' });
    } catch (error) {
        await con.promise().rollback();
        res.status(500).json({ success: false, message: 'Transaction failed: ' + error.message });
    }
});



app.get('/get-history', async (req, res) => {
    const { status } = req.query;
    
    try {
        let sql = `
            SELECT 
                br.Reqid,
                br.Assetid,
                br.Borrowname,
                br.Borrowdate,
                br.ReturnDate,
                br.Status,
                br.Activity,
                br.lectname,
                a.Assetname,
                a.Assetimg,
                a.Assetstatus,
                a.Assettype
            FROM BorrowReq br
            INNER JOIN Asset a ON br.Assetid = a.Assetid
        `;

        if (status && status !== 'all') {
            sql += ` WHERE br.Status = ?`;
        }

        sql += ` ORDER BY br.Borrowdate DESC`;

        const [results] = await con.promise().query(sql, status !== 'all' ? [status] : []);
        res.json(results);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Failed to load history' });
    }
});






const fs = require('fs');
const { parse } = require('json2csv');

app.get('/export-csv', async (req, res) => {
    const sql = `
        SELECT 
            Asset.Assetid, 
            Asset.Assetimg, 
            Asset.Assetname, 
            Asset.Assetstatus, 
            Asset.Staffaddid, 
            Asset.Assetcode, 
            Asset.Assetlocation, 
            BorrowReq.Borrowdate, 
            BorrowReq.ReturnDate, 
            BorrowReq.lectname,
            BorrowReq.Borrowname,
            BorrowReq.Status,
            BorrowReq.comment
        FROM 
            BorrowReq
        LEFT JOIN 
            Asset 
        ON 
            BorrowReq.Assetid = Asset.Assetid
        WHERE 
            BorrowReq.Status = 'Returned'
    `;

    try {
        const [results] = await con.promise().query(sql);

        if (results.length === 0) {
            return res.status(404).send('No data found');
        }

        // แปลงข้อมูล JSON เป็น CSV
        const fields = [
            'Assetid',
            'Assetimg',
            'Assetname',
            'Assetstatus',
            'Staffaddid',
            'Assetcode',
            'Assetlocation',
            'Borrowdate',
            'ReturnDate',
            'lectname',
            'Borrowname',
            'Status',
            'comment',
        ];
        const opts = { fields };
        const csv = parse(results, opts);

        // ส่งไฟล์ CSV ให้ผู้ใช้งานดาวน์โหลด
        res.header('Content-Type', 'text/csv');
        res.attachment('returned_borrowing_history.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).send('Error exporting CSV');
    }
});




app.get('/Assetlist', async (req, res) => {
    const sql = `
    SELECT * FROM Asset
    `;

    try {
        const [results] = await con.promise().query(sql);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error.");
    }
});




app.get("/assets/count", async (req, res) => {
    try {
        const [available] = await con.promise().query("SELECT COUNT(*) AS count FROM Asset WHERE Assetstatus = 'Available'");
        const [borrowing] = await con.promise().query("SELECT COUNT(*) AS count FROM Asset WHERE Assetstatus = 'Borrowing'");
        const [disabled] = await con.promise().query("SELECT COUNT(*) AS count FROM Asset WHERE Assetstatus = 'Disabled'");
        const [pending] = await con.promise().query("SELECT COUNT(*) AS count FROM Asset WHERE Assetstatus = 'Pending'");

        res.json({
            available: available[0].count,
            borrowing: borrowing[0].count,
            disabled: disabled[0].count,
            pending: pending[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error.");
    }
});


app.get("/borrow-requests-summary", async (req, res) => {

    const sql = `
        SELECT Status, COUNT(*) as count
        FROM BorrowReq
        GROUP BY Status
    `;

    try {
        const [results] = await con.promise().query(sql);

        const chartData = {
            pending: 0,
            repending: 0,
            approve: 0,
            disapprove: 0,
            reject: 0,
            return: 0
        };

        results.forEach(row => {
            if (row.Status === 'Pending') {
                chartData.pending = row.count;
            } else if (row.Status === 'RePending') {
                chartData.repending = row.count;
            } else if (row.Status === 'Approved') {
                chartData.approve = row.count;
            } else if (row.Status === 'Disapproved') {
                chartData.disapprove = row.count;
            } else if (row.Status === 'Reject') {
                chartData.reject = row.count;
            } else if (row.Status === 'Returned') {
                chartData.return = row.count;
            }
        });

        res.json(chartData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error.");
    }
});


// Route to get all users
app.get("/users", (req, res) => {
    const sql = "SELECT userid, username, role, phonenum, department, useremail FROM user";
    con.query(sql, (err, results) => {
        if (err) return res.status(500).send("Database error");
        res.json(results);
    });
});

// Route to get a specific user by ID
app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT userid, username, role, phonenum, department, useremail FROM user WHERE userid = ?";
    con.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send("Database error");
        if (results.length === 0) return res.status(404).send("User not found");
        res.json(results[0]);
    });
});

// Route to update user info
app.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const { role, password, username, phonenum, department, useremail } = req.body;

    let sql = "";
    const params = [];

    if (role) {
        sql = "UPDATE user SET role = ? WHERE userid = ?";
        params.push(role, userId);
    } else if (password) {
        sql = "UPDATE user SET password = ? WHERE userid = ?";
        params.push(password, userId);
    } else {
        sql = "UPDATE user SET username = ?, phonenum = ?, department = ?, useremail = ? WHERE userid = ?";
        params.push(username, phonenum, department, useremail, userId);
    }

    con.query(sql, params, (err) => {
        if (err) return res.status(500).send("Database error");
        res.send("User updated successfully");
    });
});

// ==================== ice ====================
// ---------- table ----------
app.get('/return-assets-requests', async (req, res) => {
    const username = req.query.username; // รับ username จาก query
    const sql = `
        SELECT a.Assetname, br.ReturnDate, a.Assetlocation
        FROM Asset a
        JOIN BorrowReq br ON a.Assetid = br.Assetid
        WHERE br.Borrowname = ? AND br.Status = 'Approved'
    `;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send('Server error');
    }
});


// ---------- calendar ----------

app.get('/calendar-returns', async (req, res) => {
    const username = req.query.username; // ใช้ username จาก query parameter
    const sql = `
        SELECT a.Assetname, a.Assetlocation, br.ReturnDate 
        FROM BorrowReq br
        JOIN Asset a ON br.Assetid = a.Assetid
        WHERE br.Borrowname = ? AND br.Status = 'Approved'
    `;

    try {
        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        res.status(500).send('Server error');
    }
});


// ---------- BTN Page PD ----------
app.get('/assets-by-status', (req, res) => {
    const username = req.query.username;
    const status = req.query.status;

    const query = `
        SELECT BorrowReq.*, Asset.Assetname, Asset.Assetimg, BorrowReq.UsageType
        FROM BorrowReq
        JOIN Asset ON BorrowReq.Assetid = Asset.Assetid
        WHERE BorrowReq.Borrowname = ? AND BorrowReq.Status = ?
    `;

    con.query(query, [username, status], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.json(results);
    });
});

// ---------- login with google ----------
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// โหลดค่าจากไฟล์ .env
require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:3000/auth/google/callback",
    callbackURL: process.env.CALLBACK_URL
},

    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            console.log(profile.emails[0].value);
            // ค้นหาผู้ใช้ในฐานข้อมูล
            const [rows] = await con.promise().query(
                "SELECT * FROM user WHERE useremail = ?",
                [email]
            );

            if (rows.length > 0) {
                // หากผู้ใช้มีอยู่ในระบบ ให้ส่งข้อมูลกลับไป
                console.log(rows[0]);
                return done(null, rows[0]);
            } else {
                // หากผู้ใช้ไม่มีในระบบ ให้เปลี่ยนเส้นทางไปที่หน้า Register
                return done(null, false, { redirect: "/register" });
            }
        } catch (error) {
            return done(error, null);
        }
    }
)
);

passport.serializeUser((user, done) => done(null, user.userid));
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await con.promise().query(
            "SELECT * FROM user WHERE userid = ?",
            [id]
        );
        if (rows.length > 0) {
            done(null, rows[0]);
        } else {
            done(new Error("User not found"), null);
        }
    } catch (error) {
        done(error, null);
    }
});


app.use(passport.initialize());
app.use(passport.session());

app.get(
    "/auth/google",
    (req, res, next) => {
        console.log("Google OAuth endpoint hit");
        next(); // ดำเนินการ middleware ถัดไป
    },
    passport.authenticate('google', { scope: ['profile', 'email'] })
);


app.get(
    "/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        if (!req.user) {
            return res.redirect("/register");
        }

        const user = req.user;
        console.log("Authenticated User:", user);

        // จัดการตามบทบาทของผู้ใช้
        if (user.role === 1) {
            // Role: Student
            res.send(`
                <script>
                    localStorage.setItem('username', '${user.username}');
                    localStorage.setItem('userid', '${user.userid}');
                    localStorage.setItem('role', 'student');
                    window.location.href = '/student';
                </script>
            `);
        } else if (user.role === 2) {
            // Role: Staff
            res.send(`
                <script>
                    localStorage.setItem('username', '${user.username}');
                    localStorage.setItem('userid', '${user.userid}');
                    localStorage.setItem('role', 'staff');
                    window.location.href = '/staff';
                </script>
            `);
        } else if (user.role === 3) {
            // Role: Lecturer
            res.send(`
                <script>
                    localStorage.setItem('username', '${user.username}');
                    localStorage.setItem('userid', '${user.userid}');
                    localStorage.setItem('role', 'lecturer');
                    window.location.href = '/lecturer';
                </script>
            `);
        } else {
            // Role: Unknown
            res.send(`
                <script>
                    localStorage.setItem('username', '${user.username}');
                    localStorage.setItem('userid', '${user.userid}');
                    localStorage.setItem('role', 'unknown');
                    window.location.href = '/';
                </script>
            `);
        }
    }
);

// history staff
app.get('/get-history', async (req, res) => {
    const { status } = req.query;
    
    try {
        let sql = `
            SELECT 
                br.Reqid,
                br.Assetid,
                br.Borrowname,
                br.Borrowdate,
                br.ReturnDate,
                br.Status,
                br.Activity,
                br.lectname,
                a.Assetname,
                a.Assetimg,
                a.Assetstatus,
                a.Assettype
            FROM BorrowReq br
            INNER JOIN Asset a ON br.Assetid = a.Assetid
        `;

        if (status && status !== 'all') {
            sql += ` WHERE br.Status = ?`;
        }

        sql += ` ORDER BY br.Borrowdate DESC`;

        const [results] = await con.promise().query(sql, status !== 'all' ? [status] : []);
        res.json(results);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Failed to load history' });
    }
});



// ==================== fern ====================
const csvParser = require('csv-parser');


// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const uploadd = multer({ dest: 'uploads/' });

// Endpoint สำหรับ Import ไฟล์ CSV
app.post('/import/csv', uploadd.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    const assets = [];

    // อ่านไฟล์ CSV
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            // ดึงข้อมูลจาก CSV
            assets.push([
                row.Assetid || null,
                row.Assetname || null,
                row.Assetimg || null,
                row.Assetstatus || null,
                row.Staffaddid || null,
                row.Assetdetail || null,
                row.Assetcode || null,
                row.Assetlocation || null,
            ]);
        })
        .on('end', async () => {
            try {
                // เพิ่มข้อมูลลงในฐานข้อมูล
                const sql = `
                    INSERT INTO Asset (
                        Assetid, Assetname, Assetimg, Assetstatus, 
                        Staffaddid, Assetdetail, Assetcode, Assetlocation
                    ) VALUES ?
                `;

                await con.promise().query(sql, [assets]);
                res.status(200).send('Data imported successfully.');
            } catch (error) {
                console.error(error);
                res.status(500).send('Error importing data.');
            } finally {
                // ลบไฟล์ CSV หลังจากใช้งานเสร็จ
                fs.unlinkSync(filePath);
            }
        });
});



app.post('/upload-csv', async (req, res) => {
    const { data } = req.body;

    if (!data || data.length < 2) {
        return res.status(400).send('Invalid CSV data.');
    }

    // แยกหัวตาราง (Header)
    const headers = data[0];
    const rows = data.slice(1);

    try {
        for (const row of rows) {
            if (row.length !== headers.length) continue; // ข้ามแถวที่ข้อมูลไม่ครบ

            const assetData = {
                Assetid: row[0],
                Assetname: row[1],
                Assetimg: row[2],
                Assetstatus: row[3],
                Staffaddid: row[4],
                Assetdetail: row[5],
                Assetcode: row[6],
                Assetlocation: row[7]
            };

            // Insert into database
            const sql = `
                INSERT INTO Asset (Assetid, Assetname, Assetimg, Assetstatus, Staffaddid, Assetdetail, Assetcode, Assetlocation)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await con.promise().query(sql, Object.values(assetData));
        }

        res.status(200).send('CSV data uploaded successfully.');
    } catch (error) {
        console.error('Error uploading CSV data:', error);
        res.status(500).send('Database error.');
    }
});




app.put("/userss/:id", (req, res) => {
    const userId = req.params.id;
    const { username, phonenum, department } = req.body;

    const sql = "UPDATE user SET username = ?, phonenum = ?, department = ? WHERE userid = ?";
    con.query(sql, [username, phonenum, department, userId], (err) => {
        if (err) return res.status(500).send("Database error");
        res.send("User info updated successfully");
    });
});


app.post("/updatePassword", async (req, res) => {
    const { userID, oldPassword, newPassword } = req.body;

    const sqlGetPassword = "SELECT password FROM user WHERE userid = ?";
    con.query(sqlGetPassword, [userID], async (err, results) => {
        if (err) return res.status(500).send("Database error");
        
        if (!results.length) {
            return res.status(404).send("User not found");
        }

        // Verify old password
        const passwordMatch = await bcrypt.compare(oldPassword, results[0].password);
        if (!passwordMatch) {
            return res.status(401).send("Old password is incorrect");
        }

        try {
            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            
            const sqlUpdatePassword = "UPDATE user SET password = ? WHERE userid = ?";
            con.query(sqlUpdatePassword, [hashedNewPassword, userID], (err) => {
                if (err) return res.status(500).send("Database error");
                res.send("Password updated successfully");
            });
        } catch (error) {
            res.status(500).send("Error during password hashing!");
        }
    });
});






const port = 3000;
app.listen(port, function () {
    console.log("Server is ready at " + port);
});
app.post('/create-borrow-request', async (req, res) => {
    const { assetId, borrowname, borrowdate, returndate } = req.body;

    // ตรวจสอบว่าอุปกรณ์ว่างหรือไม่
    const checkAssetSql = 'SELECT Assetstatus FROM Asset WHERE Assetid = ?';
    try {
        const [assetResult] = await con.promise().query(checkAssetSql, [assetId]);
        
        if (assetResult.length === 0) {
            return res.status(404).json({ message: 'ไม่พบอุปกรณ์' });
        }

        if (assetResult[0].Assetstatus !== 'Available') {
            return res.status(400).json({ message: 'อุปกรณ์ไม่ว่าง' });
        }

        // สร้าง borrow request
        const createRequestSql = `
            INSERT INTO BorrowReq (Assetid, Borrowname, Borrowdate, ReturnDate, Status)
            VALUES (?, ?, ?, ?, 'Pending')
        `;

        const [result] = await con.promise().query(createRequestSql, [
            assetId,
            borrowname,
            borrowdate,
            returndate
        ]);

        // อัพเดทสถานะอุปกรณ์เป็น 'Pending'
        const updateAssetSql = 'UPDATE Asset SET Assetstatus = "Pending" WHERE Assetid = ?';
        await con.promise().query(updateAssetSql, [assetId]);

        res.json({ 
            success: true, 
            message: 'สร้างคำขอสำเร็จ รอการอนุมัติจากเจ้าหน้าที่',
            requestId: result.insertId 
        });

    } catch (error) {
        console.error('Error creating borrow request:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างคำขอ' });
    }
});

app.post('/reject-borrow-request', async (req, res) => {
    const { requestId, lectname, rejectReason } = req.body;
    
    console.log('Received request data:', { requestId, lectname, rejectReason }); // Debug log

    // Validate input
    if (!requestId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Request ID is required' 
        });
    }
    if (!lectname) {
        return res.status(400).json({ 
            success: false, 
            message: 'Lecturer name is required' 
        });
    }
    if (!rejectReason) {
        return res.status(400).json({ 
            success: false, 
            message: 'Reject reason is required' 
        });
    }

    try {
        await con.promise().beginTransaction();

        // Get Asset ID from the request
        const [borrowReq] = await con.promise().query(
            'SELECT Assetid FROM BorrowReq WHERE Reqid = ? AND Status = "Pending"',
            [requestId]
        );

        if (borrowReq.length === 0) {
            throw new Error('Request not found or already processed');
        }

        const { Assetid } = borrowReq[0];

        // Update borrow request status with Activity and Comment
        const [updateResult] = await con.promise().query(
            'UPDATE BorrowReq SET Status = ?, lectname = ?, Activity = ?, Comment = ? WHERE Reqid = ? AND Status = "Pending"',
            ['Reject', lectname, 'Request Rejected', rejectReason, requestId]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error('Failed to update request status');
        }

        // Update asset status back to Available
        const [assetResult] = await con.promise().query(
            'UPDATE Asset SET Assetstatus = "Available" WHERE Assetid = ?',
            [Assetid]
        );

        if (assetResult.affectedRows === 0) {
            throw new Error('Failed to update asset status');
        }

        await con.promise().commit();
        res.json({ 
            success: true, 
            message: 'Request rejected successfully' 
        });
    } catch (error) {
        await con.promise().rollback();
        console.error('Error rejecting request:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to reject request' 
        });
    }
});

app.get('/get-borrowing-items', async (req, res) => {
    const username = req.query.username;

    try {
        const sql = `
            SELECT 
                br.Reqid,
                br.Borrowname,
                br.Borrowdate,
                br.ReturnDate,
                br.Status,
                br.lectname,
                a.Assetid,
                a.Assetname,
                a.Assetimg,
                a.Assetstatus
            FROM BorrowReq br
            INNER JOIN Asset a ON br.Assetid = a.Assetid
            WHERE br.Borrowname = ? AND br.Status = 'Approved'
            ORDER BY br.Borrowdate DESC
        `;

        const [results] = await con.promise().query(sql, [username]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching borrowing items:', error);
        res.status(500).json({ 
            success: false, 
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการที่กำลังยืม' 
        });
    }
});

app.put('/approve-borrow-request/:reqId', async (req, res) => {
    const { reqId } = req.params;
    const { lecturerName } = req.body;
    
    if (!lecturerName) {
        return res.status(400).json({ message: 'Lecturer name is required' });
    }

    try {
        await con.promise().beginTransaction();

        // Get Asset ID and Borrowname
        const [borrowReq] = await con.promise().query(
            'SELECT Assetid, Borrowname FROM BorrowReq WHERE Reqid = ? AND Status = "Pending"',
            [reqId]
        );

        if (borrowReq.length === 0) {
            throw new Error('Borrow request not found or already processed');
        }

        const { Assetid, Borrowname } = borrowReq[0];

        // Update borrow request status
        const [updateResult] = await con.promise().query(
            'UPDATE BorrowReq SET Status = ?, lectname = ? WHERE Reqid = ? AND Status = "Pending"',
            ['Approved', lecturerName, reqId]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error('Failed to update borrow request');
        }

        // Update asset status
        const [assetResult] = await con.promise().query(
            'UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?',
            ['Borrowing', Assetid]
        );

        if (assetResult.affectedRows === 0) {
            throw new Error('Failed to update asset status');
        }

        // Record in AssetHistory
        const [historyResult] = await con.promise().query(
            'INSERT INTO AssetHistory (Assetid, Action, ActionBy, ActionDate, Details) VALUES (?, ?, ?, NOW(), ?)',
            [Assetid, 'Approved', lecturerName, `Approved borrow request by ${Borrowname}`]
        );

        if (historyResult.affectedRows === 0) {
            throw new Error('Failed to record history');
        }

        await con.promise().commit();
        res.json({ message: 'Request approved successfully' });
    } catch (error) {
        await con.promise().rollback();
        console.error('Error approving request:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/asset-borrow-return', async (req, res) => {
    const sql = `
    SELECT 
        Asset.Assetid, Asset.Assetimg, Asset.Assetname, Asset.Assetstatus, Asset.Staffaddid,
        BorrowReq.Borrowdate, BorrowReq.ReturnDate, BorrowReq.lectname, BorrowReq.Status,
        BorrowReq.Reqid
    FROM Asset
    LEFT JOIN BorrowReq ON Asset.Assetid = BorrowReq.Assetid
    WHERE BorrowReq.Status = 'RePending'
    ORDER BY BorrowReq.Borrowdate DESC
    `;

    try {
        const [results] = await con.promise().query(sql);
        res.json(results);
    } catch (error) {
        console.error('Error fetching return requests:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

app.get("/borrow-assett", async (req, res) => {
    const sql = `
    SELECT br.Reqid, br.Borrowname, br.Borrowdate, br.ReturnDate, br.Status, br.Activity, br.UsageType,
           a.Assetname
    FROM BorrowReq br
    INNER JOIN Asset a ON br.Assetid = a.Assetid
    WHERE br.Status = 'Pending'
    ORDER BY br.Borrowdate DESC
    `;

    try {
        const [results] = await con.promise().query(sql);
        res.json(results);
    } catch (error) {
        console.error('Error fetching borrow requests:', error);
        res.status(500).json({ success: false, message: 'Failed to load borrowing requests' });
    }
});

// Create AssetHistory table if not exists
const createAssetHistoryTable = `
CREATE TABLE IF NOT EXISTS AssetHistory (
    HistoryID INT AUTO_INCREMENT PRIMARY KEY,
    Assetid INT NOT NULL,
    Action VARCHAR(50) NOT NULL,
    ActionBy VARCHAR(100) NOT NULL,
    ActionDate DATETIME NOT NULL,
    Details TEXT,
    FOREIGN KEY (Assetid) REFERENCES Asset(Assetid)
)`;

con.query(createAssetHistoryTable, (err) => {
    if (err) {
        console.error('Error creating AssetHistory table:', err);
    } else {
        console.log('AssetHistory table ready');
    }
});
