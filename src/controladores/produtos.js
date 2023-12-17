const knex = require('../conexao')
const { uploadImagem, excluirImagem } = require('../servicos/uploads');

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const imagem = req.file
    const quantidade_estoque_numerico = parseInt(quantidade_estoque, 10);

    let produto_imagem

    if (imagem) {
        produto_imagem = await uploadImagem(
            `produtos/${imagem.originalname}`,
            imagem.buffer,
            imagem.mimetype,
        );
    }

    const produtoExistente = await knex('produtos').where({ descricao }).first();

    if (produtoExistente) {
        const produtoAtualizado = await knex('produtos').where({ descricao }).update({ quantidade_estoque: produtoExistente.quantidade_estoque + quantidade_estoque_numerico, valor, categoria_id, produto_imagem }).returning('*');

        return res.status(200).json(produtoAtualizado[0]);
    } else {
        const novoProduto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem }).returning('*');

        return res.status(200).json(novoProduto[0]);
    }

};

const editarProduto = async (req, res) => {
    const { id } = req.params
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body
    const imagem = req.file;

    const produto = await knex('produtos').where({ id }).first()
    let produto_imagem = produto.produto_imagem

    if (imagem) {
        if (produto.produto_imagem) {
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

    if (!produto) {
        return res.status(404).json('Produto não encontrado')
    }

    const categoriaExistente = await knex('categorias').where({ id: categoria_id }).first();

    if (!categoriaExistente) {
        return res.status(400).json({ mensagem: 'A categoria informada não existe.' });
    }

    const produtoAtualizado = await knex('produtos').where({ id }).update({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem }).returning('*');

    if (!produtoAtualizado) {
        return res.status(400).json('O produto não foi atualizado')
    }

    return res.status(200).json(produtoAtualizado[0]);
}

const listarProdutos = async (req, res) => {
    try {
        const { categoria_id } = req.query;

        let query = knex('produtos');

        if (categoria_id) {

            const categoriaExiste = await knex('categorias').where('id', categoria_id).first();

            if (!categoriaExiste) {
                return res.status(404).json({ mensagem: 'Categoria não encontrada' });
            }

            query = query.where('categoria_id', categoria_id);
        }

        const produtos = await query.select('*');

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao listar produtos', error: error.message });
    }
};


const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoId = await knex(`produtos`).where(`id`, id).first();

        if (!produtoId) {
            return res.status(400).json('O produto nao foi cadastrado')
        }

        return res.status(200).json(produtoId)

    } catch (error) {
        return res.status(500).json(error.message)
    }
};

const excluirProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where('id', id).first();

        if (!produto) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        const localizarProdutoPedido = await knex('pedido_produtos').where('produto_id', id).first();

        if (localizarProdutoPedido) {
            return res.status(400).json('O produto não pode ser excluído, pois está vinculado a um pedido');
        }

        if (produto.produto_imagem) {
            const path = produto.produto_imagem.replace(
                `${process.env.URL_ENDPOINT}/${process.env.BLACKBLAZE_BUCKET}/`,
                ''
            );
            await excluirImagem(decodeURIComponent(path));
        }

        await knex('produtos').del().where('id', id);

        return res.status(200).send();
    } catch (error) {
        return res.status(500).json(error.message);
    }
};


module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto
}