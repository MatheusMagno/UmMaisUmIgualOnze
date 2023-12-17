const joi = require('joi');

const schemaProduto = joi.object({
    descricao: joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório',
        'string.empty': 'O campo descrição não pode estar vazio',
    }),
    quantidade_estoque: joi.number().integer().positive().required().messages({
        'number.base': 'A quantidade em estoque deve ser um número',
        'number.integer': 'A quantidade em estoque deve ser um número inteiro',
        'number.positive': 'A quantidade em estoque deve ser um número positivo',
        'any.required': 'O campo quantidade_estoque é obrigatório',
    }),
    valor: joi.number().positive().required().messages({
        'number.base': 'O valor deve ser um número',
        'number.positive': 'O valor deve ser um número positivo',
        'any.required': 'O campo valor é obrigatório',
    }),
    categoria_id: joi.number().integer().positive().required().messages({
        'number.base': 'A categoria_id deve ser um número',
        'number.integer': 'A categoria_id deve ser um número inteiro',
        'number.positive': 'A categoria_id deve ser um número positivo',
        'any.required': 'O campo categoria_id é obrigatório',
    }),
    produto_imagem: joi.string().allow(''),
});

module.exports = {
    schemaProduto,
};