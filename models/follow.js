/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('follow', {
        follow_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'user',
                key: 'email'
            }
        },
        follow_email: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'user',
                key: 'email'
            }
        }
    }, {
        tableName: 'follow',
        timestamps: false
    });
};
