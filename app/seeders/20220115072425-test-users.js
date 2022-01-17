'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date()
    await queryInterface.bulkInsert('Users', [
      { name: 'テスト 太郎1', email: 'test1@gmail.com', password: bcrypt.hashSync('secret', bcrypt.genSaltSync(8)), rememberToken: 'test1', createdAt: now, updatedAt: now },
      { name: 'テスト 太郎2', email: 'test2@gmail.com', password: bcrypt.hashSync('secret', bcrypt.genSaltSync(8)), rememberToken: 'test2', createdAt: now, updatedAt: now },
      { name: 'テスト 太郎3', email: 'test3@gmail.com', password: bcrypt.hashSync('secret', bcrypt.genSaltSync(8)), rememberToken: 'test3', createdAt: now, updatedAt: now },
      { name: 'テスト 太郎4', email: 'test4@gmail.com', password: bcrypt.hashSync('secret', bcrypt.genSaltSync(8)), rememberToken: 'test4', createdAt: now, updatedAt: now },
      { name: 'テスト 太郎5', email: 'test5@gmail.com', password: bcrypt.hashSync('secret', bcrypt.genSaltSync(8)), rememberToken: 'test5', createdAt: now, updatedAt: now },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
