const knex = require('../conexao');

const cadasTrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    const produtosIds = pedido_produtos.map(produto => produto.produto_id);
    const quantidadeProduto = pedido_produtos.map(quantidade => quantidade.quantidade_produto);

    try {
        const clienteExiste = await knex('clientes').where({ id: cliente_id }).first();

        if (!clienteExiste) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        const produtosNoEstoque = await knex.select('id', 'quantidade_estoque').from('produtos').whereIn('id', produtosIds);

        if (produtosNoEstoque.length !== produtosIds.length) {
            return res.status(404).json({ mensagem: 'Produto não existe' });
        }

        for (const produto of produtosNoEstoque) {
            if (produto.quantidade_estoque < quantidadeProduto[produto.id]) {
                return res.status(404).json({ mensagem: 'Estoque insuficiente' });
            }
        }

        const pedido = await knex('pedidos').insert({ cliente_id, observacao }).returning('*');
        res.send(pedido)
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadasTrarPedido
}