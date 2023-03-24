const { body } = require("express-validator");

const photoInsertValidation  = () => {
    return [
        body("title")
            .not().equals("undefined").withMessage("O título e obrigatório.")
            .isString().withMessage("O título e obrigatório.")
            .isLength({min: 3}).withMessage("O título precisa ter no mínimo 3 caracteres."),
        body("image")
            .custom((value, {req}) =>{
                if (!req.file) throw new Error("A imagem e obrigatória.");

                return true;
            })
    ]
}

module.exports = {
    photoInsertValidation,
}