const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

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

        const filePath = path.join(__dirname, '..', 'uploads', 'photos', photo.image);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ errors: ["Falha ao excluir a foto"] });
            }
        });

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

const getUserPhotos = async (req, res) => {
    try {
        const { id } = req.params;

        const photos = await Photo.find({ userId: id }).sort([["createdAt", -1]]).exec();

        res.status(200).json(photos);
    } catch (error) {
        console.error(error)
        return res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde."] });
    }
}

const getPhotoById = async (req, res) => {
    try {
        const { id } = req.params;

        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] })
        }

        res.status(200).json(photo);
    } catch (error) {
        console.error(error)
        return res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde."] });
    }
}

const updatePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const reqUser = req.user;

        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] })
        }

        if (!photo.userId.equals(reqUser._id)) {
            return res.status(422).json({ errors: ["Acesso negado!"] });
        }

        if (title) {
            photo.title = title
        }

        await photo.save();

        res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
    } catch (error) {
        console.error(error)
        return res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde."] });
    }
}

const likePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const reqUser = req.user;

        const photo = await Photo.findById(id);

        // Check if photo exists
        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada!"] });
        }

        // Check if user already liked the photo
        if (photo.likes.includes(reqUser._id)) {
            return res.status(422).json({ errors: ["Você já curtiu esta foto."] });
        }

        // Put user id in array of likes
        photo.likes.push(reqUser._id);

        await photo.save();

        res
            .status(200)
            .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida!" });
    } catch (error) {
        console.error(error)
        return res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde."] });
    }
}

const commentPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body
        const reqUser = req.user;

        const user = await User.findById(reqUser._id);
        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] })
        }

        const userComment = {
            comment,
            userName: user.name,
            userImage: user.profileImage,
            userId: user._id
        }

        photo.comments.push(userComment)

        await photo.save();

        res.status(200).json({ comment: userComment, message: "O comentário foi adicionado com sucesso!" });
    } catch (error) {
        console.error(error)
        return res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde."] });
    }
}

const searchPhotos = async (req, res) => {
    try {
        const { q } = req.query;

        const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

        res.status(200).json(photos);
    } catch (error) {
        console.error(error)
        return res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde."] });
    }
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos
}