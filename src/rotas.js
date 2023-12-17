const express = require('express');
const multer = require('./servicos/multer')

const { schemaUsuario, schemaLogin } = require('./validacoes/schemaUsuario');
const { schemaProduto } = require('./validacoes/schemaProduto');
const validarCorpoRequisicao = require('./intermediario/validarCorpoRequisicao');
const verificaLogin = require('./intermediario/verificaLogin');

const listarCategoria = require('./controladores/categorias');
const { cadastrarUsuario, detalharPerfilUsuarioLogado, editarPerfilDoUsuarioLogado } = require('./controladores/usuario');
const { login } = require('./controladores/login');
const { cadastrarProduto, editarProduto, listarProdutos, detalharProduto, excluirProduto } = require('./controladores/produtos');
const { cadastrarCliente, listarClientes, detalharCliente, editarDadosDoCliente } = require('./controladores/clientes');
const { schemaCadastrarCliente } = require('./validacoes/schemaCliente');
const { cadastrarPedido, listarPedido } = require('./controladores/pedidos');
const { schemaPedido } = require('./validacoes/schemaPedido');

const rotas = express.Router();

rotas.get('/categoria', listarCategoria);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);
rotas.post('/login', validarCorpoRequisicao(schemaLogin), login);

rotas.use(verificaLogin);

rotas.get('/usuario', detalharPerfilUsuarioLogado);
rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), editarPerfilDoUsuarioLogado)

rotas.post('/produto', multer.single('imagem'), validarCorpoRequisicao(schemaProduto), cadastrarProduto);
rotas.put('/produto/:id', multer.single('imagem'), validarCorpoRequisicao(schemaProduto), editarProduto);
rotas.get('/produto', listarProdutos);
rotas.get('/produto/:id', detalharProduto);
rotas.delete('/produto/:id', excluirProduto);

rotas.post('/cliente', validarCorpoRequisicao(schemaCadastrarCliente), cadastrarCliente);
rotas.get('/cliente', listarClientes);
rotas.get('/cliente/:id', detalharCliente);
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaCadastrarCliente), editarDadosDoCliente);

rotas.post('/pedido', validarCorpoRequisicao(schemaPedido), cadastrarPedido)
rotas.get('/pedido', listarPedido);

module.exports = rotas;