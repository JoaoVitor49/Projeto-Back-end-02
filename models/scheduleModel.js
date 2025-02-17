module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Schedule;
};