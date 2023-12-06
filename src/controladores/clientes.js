const knex = require('../conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    const cpfFormatado = cpf.replace(/[\s.-]/g, '');
    try {
        const clienteExiste = await knex('clientes').where({ email }).orWhere({ cpf: cpfFormatado }).first();

        if (clienteExiste) {
            return res.status(400).json({ "mensagem": "Cliente já cadastrado com o email ou cpf informados" });
        }

        const cliente = await knex('clientes').insert({ nome, email, cpf: cpfFormatado, cep, rua, numero, bairro, cidade, estado }).returning('*')

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

const detalharCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await knex('clientes').where({ id }).first();

        if (!cliente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inesperado do sistema.' });
    }
};

const editarDadosDoCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    const clienteExistente = await knex('clientes').where({ id }).first();
    if (!clienteExistente) {
        return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const emailExistente = await knex('clientes').where({ email }).whereNot({ id }).first();
    if (emailExistente) {
        return res.status(400).json({ mensagem: 'E-mail já está em uso por outro cliente' });
    }
    const cpfExistente = await knex('clientes').where({ cpf }).whereNot({ id }).first();
    if (cpfExistente) {
        return res.status(400).json({ mensagem: 'CPF já está em uso por outro cliente' });
    }

    await knex('clientes').update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado }).where({ id });

    return res.status(204).json();

};
module.exports = {
    cadastrarCliente,
    listarClientes,
    editarDadosDoCliente,
    detalharCliente
}