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



module.exports = {
    cadastrarUsuario,
    editarPerfilDoUsuarioLogado,
    detalharPerfilUsuarioLogado
}