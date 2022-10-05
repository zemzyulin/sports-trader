'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Odds extends Model {
    static associate(models) {
      Odds.belongsTo(models.Fixture, {
        foreignKey: 'fixtureId'
      });
      Odds.belongsTo(models.Bookie, {
        foreignKey: 'bookieId'
      });
    }
  }
  Odds.init({
    moHome: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    moAway: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    moDraw: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fixtureId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bookieId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    indexes: [{
      name: 'date_fixtureId',
      fields: ['date', 'fixtureId']
    }],
    sequelize,
    modelName: 'Odds',
  });
  return Odds;
};