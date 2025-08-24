const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ success: false, message: "No token provided" });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).send({ success: false, message: "Invalid token format" });
        }
        
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).send({ success: false, message: "Invalid token" });
    }
}
