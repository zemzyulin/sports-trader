'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Fixtures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idApi: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      homeTeamId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      awayTeamId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      goalsHome: {
        defaultValue: null,
        type: Sequelize.INTEGER
      },
      goalsAway: {
        defaultValue: null,
        type: Sequelize.INTEGER
      },
      leagueId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      watching: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Fixtures');
  }
};