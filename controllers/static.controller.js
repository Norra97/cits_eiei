const path = require('path');
const fs = require('fs');

exports.serveStatic = (filePath) => (req, res) => {
    const fullPath = path.join(__dirname, '..', filePath);
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('Page not found: ' + filePath);
        } else {
            res.sendFile(fullPath);
        }
    });
};

exports.logout = (req, res) => {
    console.log('Logout route called');
    req.session.destroy(function (err) {
        if (err) {
            console.error('Session destroy error:', err.message);
            res.status(500).send("Cannot clear session");
        } else {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.set('Expires', '-1');
            res.set('Pragma', 'no-cache');
            res.json({ redirect: "/login" });
        }
    });
}; 