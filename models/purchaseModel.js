module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define('Purchase', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ticketId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        scheduleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    });

    return Purchase;
};