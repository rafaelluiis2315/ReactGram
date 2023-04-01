const { body } = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name")
            .notEmpty().withMessage("O nome é obrigatório.")
            .isLength({min: 3}).withMessage("O nome precisa ter no mínimo 3 caracteres."),
        body("email")
            .notEmpty().withMessage("O e-mail é obrigatório.")
            .isEmail().withMessage("Insira um e-mail valido"),
        body("password")
            .notEmpty().withMessage("A senha é obrigatório.")
            .isLength({min: 5}).withMessage("A senha precisa ter no mínimo 5 caracteres.")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/).withMessage("A senha precisa conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial."),
        body("confirmPassword")
            .notEmpty().withMessage("A confirmação de senha é obrigatório.")
            .custom((value, {req}) => {
                if(value != req.body.password){
                    throw new Error("As senhas não são iguais.")
                }
                return true;
            }),
    ]
}

const loginValidation = () => {
    return [
        body("email")
            .isString().withMessage("O e-mail é obrigatório.")
            .isEmail().withMessage("Insira um e-mail valido"),
        body("password")
            .isString().withMessage("A senha é obrigatório.")
    ];
};

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({min: 3}).withMessage("O nome precisa ter no mínimo 3 caracteres."),
        body("password")
            .optional()
            .isLength({min: 5}).withMessage("A senha precisa ter no mínimo 5 caracteres.")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
            .withMessage("A senha precisa conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial."),
    ];
};

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation
};