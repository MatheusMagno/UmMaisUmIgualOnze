create database pdv;


create table usuarios (
	id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
);

create table categorias (
	id serial primary key,
  descricao text
);

insert into categorias (descricao)
values 
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
	id serial primary key,
    descricao text not null,
    quantidade_estoque integer not null,
    valor integer not null,
  	categoria_id integer not null,
  	foreign key (categoria_id) references categorias(id),
  	produto_imagem text
);

create table clientes (
	id serial primary key,
  nome text not null,
  email text not null unique,
  cpf text not null unique,
  cep integer,
  rua text,
  numero integer,
  bairro text,
  cidade text,
  estado text
);

create table pedidos (
	id serial primary key,
  cliente_id integer not null,
  foreign key (cliente_id) references clientes(id),
  observacao text,
  valor_total integer
);

create table pedido_produtos (
	id serial primary key,
  pedido_id integer not null,
  produto_id integer not null,
  quantidade_produto integer not null,
  valor_produto integer not null,
  foreign key (pedido_id) references pedidos(id),
  foreign key (produto_id) references produtos(id)
);

