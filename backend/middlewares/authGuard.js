const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authGuard = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ errors: ["Acesso negado!"] });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        console.log(verified)
        req.user = await User.findById(verified.id).select("-password");
        console.log(req.user)
        next();
    } catch (error) {
        res.status(401).json({ errors: ["Token inválido!"] });
    }
}

module.exports = authGuard;