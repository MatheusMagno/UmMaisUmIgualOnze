const knex = require('../conexao');
const { uploadImagem, excluirImagem } = require('../servicos/uploads');

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const imagem = req.file
    
    try {
        let produto_imagem

        if(imagem){
            produto_imagem = await uploadImagem(
                `produtos/${imagem.originalname}`,
                imagem.buffer,
                imagem.mimetype,
            );
        }

        const produtoExistente = await knex('produtos').where({ descricao }).first();

        if (produtoExistente) {
            const produtoAtualizado = await knex('produtos').where({ descricao }).update({ quantidade_estoque: produtoExistente.quantidade_estoque + quantidade_estoque, valor, categoria_id }).returning('*');

            return res.status(200).json(produtoAtualizado[0]);
        } else {
            const novoProduto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem }).returning('*');
            const id = produto[0].id

            return res.status(200).json(novoProduto[0]);
        }
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const editarProduto = async (req, res) => {
    const { id } = req.params
    const produto = req.produto
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body
    const imagem = req.file;

  

    try {
        let produto_imagem = produto.produto_imagem

        if(imagem){
            if(produto.produto_imagem){
                const path = produto.produto_imagem.replace(
                    `${process.env.URL_ENDPOINT}/${process.env.BLACKBLAZE_BUCKET}/`,
                    '',
                )
                await excluirImagem(decodeURIComponent(path))
            }     
            produto_imagem = await uploadImagem(
                `produtos/${imagem.originalname}`,
                imagem.buffer,
                imagem.mimetype,
                )
        }

        const produto = await knex('produtos').where({ id }).first()

        if (!produto) {
            return res.status(404).json('Produto não encontrado')
        }

        const categoriaExistente = await knex('categorias').where({ id: categoria_id }).first();

        if (!categoriaExistente) {
            return res.status(400).json({ mensagem: 'A categoria informada não existe.' });
        }

        const produtoAtualizado = await knex('produtos').where({ id }).update({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem})

        if (!produtoAtualizado) {
            return res.status(400).json('O produto não foi atualizado')
        }

        return res.status(200).json('produto foi atualizado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {
    cadastrarProduto,
    editarProduto,
    }