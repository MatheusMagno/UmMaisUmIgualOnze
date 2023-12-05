const knex = require('../conexao')
const bcrypt = require('bcrypt')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const emailExiste = await knex(`usuarios`).where({ email }).first()

        if (emailExiste) {
            return res.status(400).json({ "mensagem": "Já existe usuário cadastrado com o e-mail informado." })
        }

        const senhaCripto = await bcrypt.hash(senha, 10)

        const usuario = await knex('usuarios').insert({ nome, email, senha: senhaCripto }).returning('*')

        if (!usuario) {
            return res.status(400).json('O Usuario nao foi cadastrado')
        }

        return res.status(201).json(usuario[0])
    } catch (error) {
        return res.status(400).json({ mensagem: error.menssage })
    }
}

const editarPerfilDoUsuarioLogado = async (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaCripto = await bcrypt.hash(senha, 10);
    try {
        if (email !== req.usuario.email) {
            const emailUsuarioExiste = await knex('usuarios').where({ email }).first();

            if (emailUsuarioExiste) {
                return res.status(404).json('O Email já existe.');
            }
        }

        await knex(`usuarios`).update({ nome: nome, email: email, senha: senhaCripto }).where(req.usuario);

        return res.status(204).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.menssage })
    }
}

const detalharPerfilUsuarioLogado = async (req, res) => {
    try {
        const retornoConsulta = await knex(`usuarios`).where(req.usuario).select('id', 'nome', 'email').first();

        return res.status(200).json(retornoConsulta);
    } catch (error) {
        return res.status(400).json({ mensagem: error.menssage })
    }
}

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

module.exports = {
    cadastrarUsuario,
    editarPerfilDoUsuarioLogado,
    detalharPerfilUsuarioLogado,
    editarDadosDoCliente,
    detalharCliente
}