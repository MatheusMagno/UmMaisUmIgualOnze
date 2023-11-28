const express = require('express');

const { schemaUsuario, schemaLogin } = require('./validacoes/schemaUsuario');
const validarCorpoRequisicao = require('./intermediario/validarCorpoRequisicao');
const verificaLogin = require('./intermediario/verificaLogin');

const listarCategoria = require('./controladores/categorias');
const { cadastrarUsuario, detalharPerfilUsuarioLogado, editarPerfilDoUsuarioLogado } = require('./controladores/usuario');
const { login } = require('./controladores/login');

const rotas = express.Router();

rotas.get('/categoria', listarCategoria);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);
rotas.post('/login', validarCorpoRequisicao(schemaLogin), login);

rotas.use(verificaLogin)

rotas.get('/usuario', detalharPerfilUsuarioLogado);
rotas.put('/usuario',  editarPerfilDoUsuarioLogado)


module.exports = rotas;