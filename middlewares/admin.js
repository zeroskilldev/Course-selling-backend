const jwt = require('jsonwebtoken');
const { jwt_admin_secret } = require("../config");

function adminAuthMiddleware(req, res, next){
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, jwt_admin_secret);

    if(decoded){
        req.adminId = decoded.id;
        next();
    }
    else{
        res.status(403).json({
            msg : "Invalid token"
        });
    }
}

module.exports = {
    adminAuthMiddleware
}