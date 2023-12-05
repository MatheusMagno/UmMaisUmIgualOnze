const knex = require('../conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    const cpfFormatado = cpf.replace(/[\s.-]/g, '');
    try {
        const clienteExiste = await knex('clientes').where({ email }).orWhere({ cpf: cpfFormatado }).first();

        if (clienteExiste) {
            return res.status(400).json({ "mensagem": "Cliente já cadastrado com o email e cpf informados" });
        }

        const cliente = await knex('clientes').insert({ nome, email, cpf: cpfFormatado }).returning(['id', 'nome', 'email', 'cpf'])

        return res.status(201).json(cliente[0])
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listarClientes = async (req, res) => {
    try {
        const listaDeClientes = await knex('clientes');

        return res.status(200).json(listaDeClientes);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarCliente,
    listarClientes
}