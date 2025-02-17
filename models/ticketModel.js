module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

    return Ticket;
};