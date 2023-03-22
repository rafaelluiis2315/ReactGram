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

        const salt = await bcrypt.genSalt();
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ errors: ["Usuario não encontrado."] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(422).json({ errors: ["Senha invalida."] });
        }

        return res.status(201).json({
            _id: user._id,
            profileImage: user.profileImage,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error(err);
        return res.status(422).json({
            errors: ["Houve um erro, por favor tente novamente mais tarde."],
        });
    }
}

const getCurrentUser = async (req, res) => {
    const user = req.user;
    
    res.status(200).json(user);
}

module.exports = {
    register,
    login,
    getCurrentUser
};