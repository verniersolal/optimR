/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('trajet', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        trajetid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        transport_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        distance: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        co2: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        no2: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        pm10: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        calories: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        lgta: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        lata: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        lgtb: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        departure_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'user',
                key: 'email'
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: '0'
        },
        departure: {
            type: DataTypes.STRING,
            allowNull: true
        },
        finish: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'trajet',
        timestamps: false
    });
};
