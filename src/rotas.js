const express = require('express');

const schemaUsuario = require('./validacoes/schemaUsuario');
const validarCorpoRequisicao = require('./intermediario/validarCorpoRequisicao');

const listarCategoria = require('./controladores/categorias');
const { cadastrarUsuario } = require('./controladores/usuario');

const rotas = express.Router();

rotas.get('/categoria', listarCategoria);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);
// rotas.post('/login', login);

// //validação do bearer token

// rotas.get('/usuario', detalharPerfilUsuarioLogado);
// rotas.put('/usuario', editarPerfilDoUsuarioLogado);


module.exports = rotas;