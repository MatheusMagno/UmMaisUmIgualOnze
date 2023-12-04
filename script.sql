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
  	foreign key (categoria_id) references categorias(id)
);

create table clientes (
	id serial primary key,
  nome text not null,
  email text not null unique,
  cpf text not null unique,
  cep int,
  rua text,
  numero int,
  bairro text,
  cidade text,
  estado text
);