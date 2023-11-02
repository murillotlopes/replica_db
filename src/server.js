const { faker } = require('@faker-js/faker');
const { Op } = require('sequelize');
// const express = require('express');
const Sequelize = require('sequelize');

// const app = express();

const conexao = new Sequelize('aula', null, null, {
  dialect: 'mysql',
  port: 3306,
  replication: {
    read: [
      { host: '34.73.29.229', username: 'usr_murilo', password: 'fatec123' }
    ],
    write: { host: '34.23.151.195', username: 'usr_murilo', password: 'fatec123' }
  },
  pool: { // If you want to override the options used for the read/write pool you can do so here
    max: 20,
    min: 1,
    idle: 30000,
    logging: console.log
  },
})

// Model para uma tabela exemplo
const produtoModel = conexao.define('produto', {
  descricao: Sequelize.STRING(50),
  categoria: Sequelize.STRING(10),
  valor: Sequelize.DECIMAL(15, 2),
  criado_em: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  criado_por: {
    allowNull: false,
    type: Sequelize.STRING(20),
    defaultValue: 'GMNTV'
  }
  // })
}, { tableName: 'produto', timestamps: false })


// Sincronize o modelo com o banco de dados de leitura
conexao.sync()
  .then(() => {
    console.log('Banco conectado');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao Banco', err);
  });



async function teste() {
  try {
    const novoProduto = await produtoModel.create({
      descricao: String(faker.person.fullName()).substring(1, 50),
      categoria: String(faker.commerce.productMaterial()).substring(1, 10),
      valor: faker.number.float({ max: 15, min: 1, precision: 2 }),
    })

    console.log(novoProduto)

    const data = await produtoModel.findAll({
      where: {
        id: {
          // [Op.gt]: novoProduto.id < 10 ? 1 : novoProduto.id - 10,
          [Op.gt]: novoProduto.id - 10,
          [Op.lt]: novoProduto.id
        }
      }
    }, { raw: false })

    console.log(data)
  } catch (error) {
    console.error(error)
  }

}

function intervalo() {
  return 500 + Math.floor(Math.random() * 500)
}

// teste()

setInterval(() => {
  teste()
}, intervalo());
