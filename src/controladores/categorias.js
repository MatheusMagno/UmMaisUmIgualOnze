const knex = require(`../conexao`);

const listarCategoria = async (req, res) => {
    try {
        const categorias = await knex.select('*').from('categorias');
        res.status(200).json(categorias);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = listarCategoria
