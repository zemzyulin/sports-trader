'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Odds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      moHome: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      moAway: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      moDraw: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      fixtureId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bookieId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('Odds', {
      type: 'UNIQUE',
      fields: ['date', 'fixtureId', 'bookieId']
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Odds');
  }
};