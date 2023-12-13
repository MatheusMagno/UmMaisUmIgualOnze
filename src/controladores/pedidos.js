const knex = require('../conexao');

const cadastrarPedido = async (req, res) => {
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

        if (produtosNoEstoque.length !== produtosIds.length) {
            return res.status(404).json({ mensagem: 'Produto não existe' });
        }

        let valorTotal = 0;

        for (const produto of produtosNoEstoque) {
            if (produto.quantidade_estoque < quantidadeProduto[produto.id - 1]) {
                return res.status(404).json({ mensagem: 'Estoque insuficiente' });
            }
            valorTotal += quantidadeProduto[produto.id - 1] * produto.valor;
        }

        const pedido = await knex('pedidos').insert({ cliente_id, observacao, valor_total: valorTotal }).returning('*');
        const pedido_id = pedido[0].id
        if (produtosNoEstoque) {
            for (let i = 0; i < produtosIds.length; i++) {
                const produto_id = produtosIds[i];
                const quantidade_produto = quantidadeProduto[i];
                const valor_produto = valorProduto[i]

                await knex('pedido_produtos').insert({ pedido_id, produto_id, quantidade_produto, valor_produto })
            }
        }
        res.status(201).json(pedido[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


const listarPedido = async (req, res) => {
    try {
        const { cliente_id } = req.query;

        let query = knex('pedidos');

        if (cliente_id) {
            const clienteExiste = await knex('clientes').where('id', cliente_id).first();

            if (!clienteExiste) {
                return res.status(404).json({ mensagem: 'Cliente não encontrado' });
            }

            query.where('cliente_id', cliente_id);
        }

        const pedidos = await query.select('id', 'valor_total', "observacao", "cliente_id");

        const pedidosComProdutos = [];

        for (const pedido of pedidos) {
            const produtosDoPedido = await knex('pedido_produtos').where('pedido_id', pedido.id).select("id", "quantidade_produto", "valor_produto", "pedido_id", "produto_id");
            pedidosComProdutos.push({ pedido, pedido_produtos: produtosDoPedido });
        }


        return res.status(200).json(pedidosComProdutos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarPedido,
    listarPedido
}