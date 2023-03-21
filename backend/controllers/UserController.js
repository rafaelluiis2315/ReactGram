const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(422).json({ errors: ["Por favor, utilize outro e-mail"] });
        }

        const salt = await bcrypt.getSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: passwordHash,
        });

        return res.status(201).json({
            _id: newUser._id,
            token: generateToken(newUser._id),
        });
    } catch (err) {
        console.error(err);
        return res.status(422).json({
            errors: ["Houve um erro, por favor tente novamente mais tarde."],
        });
    }
};



module.exports = { register };