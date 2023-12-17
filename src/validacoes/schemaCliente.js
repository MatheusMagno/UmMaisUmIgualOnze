const joi = require('joi');

const schemaCadastrarCliente = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório'
    }),
    email: joi.string().email().required().messages({
        'string.email': 'O email precisa ter um formato valido',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório'
    }),
    cpf: joi.string().min(11).required().messages({
        'any.required': 'O campo CPF é obrigatório',
        'string.empty': 'O campo CPF é obrigatório',
        'string.min': 'O CPF precisa conter no minimo 11 caracteres'
    }),

    cep: joi.string().max(9),
    rua: joi.string(),
    numero: joi.string(),
    bairro: joi.string(),
    cidade: joi.string(),
    estado: joi.string()
});

module.exports = {
    schemaCadastrarCliente
}