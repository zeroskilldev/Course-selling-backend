const jwt = require('jsonwebtoken');
const { jwt_user_secret } = require("../config");

function userAuthMiddleware(req, res, next){
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, jwt_user_secret);

    if(decoded){
        req.userId = decoded.id;
        next();
    }
    else{
        res.status(403).json({
            msg : "Invalid token"
        });
    }
}

module.exports = {
    userAuthMiddleware
}