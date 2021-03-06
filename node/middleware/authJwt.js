const jwt = require("jsonwebtoken");
const config = require("../utils/auth.js");

let verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.user = {
            user_id: decoded.id
        }
        next();
    });
};

let deserializeUser = (req, res, next) => {
    let token = req.headers["authorization"];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (!err) {
                req.user = {
                    user_id: decoded.id
                }
            }
        })
    }
    next();
}

const authJwt = {
    verifyToken,
    deserializeUser
};

module.exports = authJwt;