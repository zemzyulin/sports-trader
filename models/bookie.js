'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookie extends Model {
    static associate(models) {
      Bookie.hasMany(models.Odds, {
        foreignKey: 'bookieId'
      });
    }
  }
  Bookie.init({
    idApi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Bookie',
  });
  return Bookie;
};