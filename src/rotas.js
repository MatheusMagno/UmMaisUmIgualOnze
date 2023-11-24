const express = require('express');

const rotas = express.Router();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

//validação do bearer token

rotas.get('/usuario', detalharPerfilUsuarioLogado);
rotas.put('/usuario', editarPerfilDoUsuarioLogado);


module.exports = rotas;