const joi = require('joi');

const schemaPedido = joi.object({
    cliente_id: joi.number().integer().positive().required().messages({
        'any.required': 'O campo cliente_id é obrigatorio',
        'numero.base': 'O campo cliente_id tem que ser um número',
        'number.integer': 'A cliente_id deve ser um número inteiro',
        'number.positive': 'A cliente_id deve ser um número positivo',
    }),
    observacao: joi.string(),
    pedido_produtos: joi.array().required().items(
        joi.object({
            produto_id: joi.number().messages({
                'any.required': 'O campo produto_id é obrigatorio',
                'numero.base': 'O campo produto_id tem que ser um número',
                'number.integer': 'A produto_id deve ser um número inteiro',
                'number.positive': 'A produto_id deve ser um número positivo',
            }),
            quantidade_produto: joi.number().messages({
                'any.required': 'O campo quantidade_produto é obrigatorio',
                'numero.base': 'O campo quantidade_produto tem que ser um número',
                'number.integer': 'A quantidade_produto deve ser um número inteiro',
                'number.positive': 'A quantidade_produto deve ser um número positivo',
            })
        })
    ),
});

module.exports = {
    schemaPedido
}