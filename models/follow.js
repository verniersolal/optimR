/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('follow', {
    follow_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 'nextval(follow_follow_id_seq::regclass)'
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'user',
        key: 'email'
      }
    },
    follow_email: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'user',
        key: 'email'
      }
    }
  }, {
    tableName: 'follow',
      timestamps:false
  });
};
