const knex = require('../conexao')

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body
    try {
        const produto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id }).returning('*')

        if (!produto[0]) {
            return res.status(400).json('O produto não foi cadastrado')
        }

        return res.status(200).json(produto[0])
    } catch (error) {
        return res.status(400).json({ mensagem: error.menssage })
    }
}

const editarProduto = async (req, res) => {
    const { id } = req.params
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body

    try {
        const produto = await knex('produtos').where({ id }).first()

        if (!produto) {
            return res.status(404).json('Produto não encontrado')
        }

        const categoriaExistente = await knex('categorias').where({ id: categoria_id }).first();

        if (!categoriaExistente) {
            return res.status(400).json({ mensagem: 'A categoria informada não existe.' });
        }

        const produtoAtualizado = await knex('produtos').where({ id }).update({ descricao, quantidade_estoque, valor, categoria_id })

        if (!produtoAtualizado) {
            return res.status(400).json('O produto não foi atualizado')
        }

        return res.status(200).json('produto foi atualizado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const listarProdutos = async (req, res) => {
    try {
        const { categoria_id } = req.query;

        let query = knex('produtos');

        if (categoria_id) {
            query = query.where('categoria_id', categoria_id);
        }

        const produtos = await query.select('*');

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json(error.message)
    }
};


const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoId = await knex(`produtos`).where(`id`,id).first();

        if(!produtoId){
            return res.status(400).json('O produto nao foi cadastrado')
        }
        
        return res.status(200).json(produtoId)

    } catch (error) {
        return res.status(500).json(error.message)
    }
};

const excluirProduto = async (req, res) => {
    const {id} = req.params;

    try {
        const produtoId = await knex(`produtos`).where(`id`, id).first();

        if(!produtoId){
            return res.status(400).json('O produto nao foi cadastrado')
        }
        if(produtoId){
            await knex(`produtos`).del().where(`id`,id)
        }
        
        return res.status(200).send()

    } catch (error) {
        return res.status(500).json(error.message)
    }
};

module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto
}