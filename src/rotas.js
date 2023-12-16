const express = require('express');
const multer = require('./servicos/multer')
const {cadastrarProduto, atualizarImagemProduto} = require('./controladores/produtos');

const rotas = express.Router();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

//validação do bearer token

rotas.get('/usuario', detalharPerfilUsuarioLogado);
rotas.put('/usuario', editarPerfilDoUsuarioLogado);

rotas.post('/produto', validarCorpoRequisicao(schemaProduto), multer.single('imagem'), cadastrarProduto);
rotas.put('/produto/:id', validarCorpoRequisicao(schemaProduto), multer.single('imagem'),editarProduto);

module.exports = rotas;