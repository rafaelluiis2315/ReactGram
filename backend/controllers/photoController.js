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

const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const reqUser = req.user;

        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] });
        }

        if (!photo.userId.equals(reqUser.id)) {
            return res.status(422).json({ errors: ["Acesso negado!"] });
        }

        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso." });
    } catch (error) {
        console.error(error)
        return res.status(400).json({ errors: ["id invalido"] });
    }
}

const getAllPhotos = async (req, res) => {
    try {
        const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

        res.status(200).json(photos);
    } catch (error) {
        console.error(error)
        return res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde."] });
    }
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos
}