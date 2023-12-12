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

        const produtosNoEstoque = await knex.select('id', 'quantidade_estoque', 'valor').from('produtos').whereIn('id', produtosIds);
        const valorProduto = produtosNoEstoque.map(produto => produto.valor);

        let valor_total = 0;
        for (let i = 0; i < produtosIds.length; i++) {
            valor_total += valorProduto[i] * quantidadeProduto[i]

        }

        const pedido = await knex('pedidos').insert({ cliente_id, observacao, valor_total }).returning('*');

        const pedido_id = pedido[0].id
        console.log(pedido_id);
        console.log(produtosNoEstoque);


        if (produtosNoEstoque) {
            for (let i = 0; i < produtosIds.length; i++) {
                const produto_id = produtosIds[i];
                const quantidade_produto = quantidadeProduto[i];
                const valor_produto = valorProduto[i]

                const pedido_produtos = await knex('pedido_produtos').insert({ pedido_id, produto_id, quantidade_produto, valor_produto })
            }
        }

        res.send(pedido);
    } catch (error) {
        console.log(error.message);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadasTrarPedido
}