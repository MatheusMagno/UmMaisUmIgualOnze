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

module.exports = {
    cadastrarUsuario
}