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

const detalharPerfilUsuarioLogado = async (req, res) => {

    try {
        
        const { rows } = await knex(`usuarios`).where(`id`, req.usuario);

        const {senha, ...usuarioSemSenha} = rows[0];

        return res.status(200).json(usuarioSemSenha);

    } catch (error) {
        res.status(401).json({mensagem: `Para ter acesso a este recurso, é necessário estar logado`})
    }

}


module.exports = {
    cadastrarUsuario,
    detalharPerfilUsuarioLogado
}

