const knex = require('../conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    try {
        const clienteExiste = await knex(`clientes`).where({ email }, { cpf }).first();

        if (clienteExiste) {
            return res.status(400).json({ "mensagem": "Cliente já cadastrado com o email e cpf informados" });
        }

        const cliente = await knex('clientes').insert({ nome, email, cpf }).returning('*')

        return res.status(201).json(cliente[0])
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarCliente
}