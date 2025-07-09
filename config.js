const jwt_admin_secret = process.env.JWT_USER_SECRET;
const jwt_user_secret = process.env.JWT_ADMIN_SECRET;

module.exports = {
    jwt_admin_secret,
    jwt_user_secret
}