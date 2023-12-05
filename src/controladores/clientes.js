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
        
        const clientesFormatados = listaDeClientes.map(cliente => ({
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cliente.cpf
        }));

        return res.status(200).json(clientesFormatados);
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

        return res.status(200).json({
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cliente.cpf
        });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inesperado do sistema.' });
    }
};

const editarDadosDoCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf } = req.body;
    try {
        const clienteExistente = await knex('clientes').where({ id }).first();
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }
        if (!nome || !email || !cpf) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: nome, email, cpf' });
        }
        const emailExistente = await knex('clientes').where({ email }).whereNot({ id }).first();
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'E-mail já está em uso por outro cliente' });
        }
        const cpfExistente = await knex('clientes').where({ cpf }).whereNot({ id }).first();
        if (cpfExistente) {
            return res.status(400).json({ mensagem: 'CPF já está em uso por outro cliente' });
        }
        await knex('clientes').update({ nome, email, cpf }).where({ id });
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inesperado do sistema.' });
    }
};
module.exports = {
    cadastrarCliente,
    listarClientes,
    editarDadosDoCliente,
    detalharCliente
}
