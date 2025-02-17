const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../helpers/db')

const UserModel = require('./userModel')
const TicketModel = require('./ticketModel')
const ScheduleModel = require('./scheduleModel')
const PurchaseModel = require('./purchaseModel')

const User = UserModel(sequelize, DataTypes)
const Ticket = TicketModel(sequelize, DataTypes)
const Schedule = ScheduleModel(sequelize, DataTypes)
const Purchase = PurchaseModel(sequelize, DataTypes)

Ticket.hasMany(Schedule, { foreignKey: 'ticket_id', as: 'schedules' })
Schedule.belongsTo(Ticket, { foreignKey: 'ticket_id' })

Ticket.hasMany(Purchase, { foreignKey: 'ticketId' })
Purchase.belongsTo(Ticket, { foreignKey: 'ticketId' })

User.hasMany(Purchase, { foreignKey: 'userId' })
Purchase.belongsTo(User, { foreignKey: 'userId' })

module.exports = {
    User,
    Ticket,
    Schedule,
    Purchase,
    sequelize
}