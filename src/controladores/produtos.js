const knex = require('../conexao')

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const {originalname, mimetype , buffer} = req.file

    try {

        const produtoExistente = await knex('produtos').where({ descricao }).first();

        if (produtoExistente) {
            const produtoAtualizado = await knex('produtos').where({ descricao }).update({ quantidade_estoque: produtoExistente.quantidade_estoque + quantidade_estoque, valor, categoria_id }).returning('*');

            return res.status(200).json(produtoAtualizado[0]);
        } else {
            const novoProduto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id }).returning('*');
            const id = produto[0].id

            const imagem = await uploadImagem(
                `produtos/${id}/${originalname}`,
                buffer,
                mimetype
            )
    
            produto = await knex('produtos').update({
                imagem: imagem.path
            }).where({ id }).returning('*')
    
            produto[0].urlImagem = imagem.url

            return res.status(200).json(novoProduto[0]);
        }
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const atualizarImagemProduto = async (req, res) => {
    const { originalname, mimetype, buffer } = req.file
    const { id } = req.params;

    try {
        const produtoEncontrado = await knex('produtos').where({
            id,
            usuario_id: req.usuario.id
        }).first();

        if (!produtoEncontrado) {
            return res.status(404).json('Produto não encontrado');
        }

        await excluirImagem(produtoEncontrado.imagem)

        const upload = await uploadImagem(
            `produtos/${produtoEncontrado.id}/${originalname}`,
            buffer,
            mimetype
        )

        const produto = await knex('produtos')
            .where({ id })
            .update({
                imagem: upload.path
            });

        if (!produto) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(400).json(error.message);
    }
}
module.exports = {
    cadastrarProduto,
    atualizarImagemProduto,
    }