const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    console.log('entered');
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg: "Authorization Denied"});
    try {
        const decoded = jwt.verify(token, config.get('jwtSecretKey'));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'No Authentication'});
    }  
}