const express = require('express');
const listarCategoria = require('./controladores/categorias');
const { cadastrarUsuario } = require('./controladores/user');
const schemaUsuario = require('./validacoes/schemaUsuario');
const validarCorpoRequisicao = require('./middlewares/validarCorpoRequisicao');

const rotas = express.Router();

rotas.get('/categoria', listarCategoria);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);
// rotas.post('/login', login);

// //validação do bearer token

// rotas.get('/usuario', detalharPerfilUsuarioLogado);
// rotas.put('/usuario', editarPerfilDoUsuarioLogado);


module.exports = rotas;