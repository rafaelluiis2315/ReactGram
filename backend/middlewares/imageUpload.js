const multer = require("multer");
const path = require("path");

// Destination to store image
const imageStore = multer.diskStorage({
    destination: (req, file, cd) => {
        let folder = ""

        if (req.baseUrl.includes("user")) {
            folder = "users"
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos"
        }

        cd(null, `uploads/${folder}/`)
    },
    filename: (req, file, cd) => {
        cd(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStore,
    fileFilter: (req, file, cd) => {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cd(new Error("Por favor, envie apenas png ou jpg"))
        }

        cd(null, true)
    }
})

module.exports = { imageUpload };