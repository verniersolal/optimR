/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    is_new: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'user',
      timestamps:false
  });
};
