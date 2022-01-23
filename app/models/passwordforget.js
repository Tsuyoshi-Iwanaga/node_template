'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordForget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PasswordForget.hasOne(models.User, {
        foreignKey: 'email',
        sourceKey: 'email',
      })
    }
  }
  PasswordForget.init({
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    token: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'PasswordForget',
  });
  return PasswordForget;
};