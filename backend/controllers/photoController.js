const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
    try {
        // Extract required data from the request body and file
        const { title } = req.body;
        const image = req.file.filename;

        // Find the user by ID in the database
        const user = await User.findById(req.user._id);

        // Create a new photo object with user ID and name
        const newPhoto = await Photo.create({
            image,
            title,
            userId: user._id,
            userName: user.name,
        })
        if (!newPhoto) {
            return res.status(422).json({ errors: ["Houve um erro ao criar a foto."] });
        }

        // If the photo was created successfully, return it.
        res.status(201).json(newPhoto);
    } catch (error) {
        // If there was an error creating the photo, return an error message
        console.error(error);
        res.status(500).json({ error: "Houve um problema, por favor tente mais tarde." });
    }
}

module.exports = {
    insertPhoto,
}