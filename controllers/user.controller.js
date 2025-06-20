const userService = require('../services/user.service');

exports.register = async (req, res) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).send(result.message);
    } catch (err) {
        res.status(err.status || 500).send(err.message || 'Internal server error');
    }
};

exports.login = async (req, res) => {
    try {
        const result = await userService.login(req.body.username, req.body.password);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).send(err.message || 'Internal server error');
    }
};

exports.getRole = async (req, res) => {
    try {
        console.log('getRole username:', req.body.username);
        const result = await userService.getRole(req.body.username);
        res.json(result);
    } catch (err) {
        console.error('getRole error:', err);
        res.status(err.status || 500).send(err.message || 'Internal server error');
    }
}; 