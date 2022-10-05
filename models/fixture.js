'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fixture extends Model {
    static associate(models) {
      Fixture.belongsTo(models.Team, {
        foreignKey: 'homeTeamId',
        as: 'homeTeam'
      });
      Fixture.belongsTo(models.Team, {
        foreignKey: 'awayTeamId',
        as: 'awayTeam'
      });
      Fixture.belongsTo(models.League, {
        foreignKey: 'leagueId'
      });
      Fixture.hasMany(models.Odds, {
        foreignKey: 'fixtureId'
      });
    }
  }
  Fixture.init({
    idApi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    goalsHome: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    goalsAway: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    leagueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    watching: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Fixture',
  });
  return Fixture;
};