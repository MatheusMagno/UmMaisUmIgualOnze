const express = require('express');
const listarCategoria = require('./controladores/categorias');

const rotas = express.Router();

rotas.get('/categoria', listarCategoria);
// rotas.post('/usuario', cadastrarUsuario);
// rotas.post('/login', login);

// //validação do bearer token

// rotas.get('/usuario', detalharPerfilUsuarioLogado);
// rotas.put('/usuario', editarPerfilDoUsuarioLogado);


module.exports = rotas;