const {Ticket} = require('../models/indexModel')
const {Schedule} = require('../models/indexModel')

exports.showCreateTicketPage = (req, res) => {
    res.render('createTicket');
};

exports.showTicketsPage = async(req,res) => {
    try{
        const tickets = await Ticket.findAll({
            include: [{ model: Schedule, as: 'schedules' }],
            order: [
                ['name', 'ASC'],
                [{ model: Schedule, as: 'schedules' }, 'time', 'ASC']
            ]
        })
        res.render('tickets', {tickets, isAdmin: req.user.isAdmin})
    }catch(error){
        res.status(500).send('Erro para mostrar os tickets')
    }
}

exports.showEditTicketPage = async(req,res) =>{
    const {id} = req.params
    try{
        const ticket = await Ticket.findByPk(id,{
            include: [{ model: Schedule, as: 'schedules' }]
        })
        if(!ticket){
            return res.status(404).send('Ingresso não encontrado')
        }
        res.render('editTicket', {ticket})
    }catch(error){
        res.status(500).send("Erro ao carregar página de edição" +error.message)
    }
}

exports.createTicket = async(req,res) => {
    const {name, price, times, quantities} = req.body
    try{
        const ticket = await Ticket.create({name, price})
        for (let i = 0; i < times.length; i++) {
            await Schedule.create({
                ticket_id: ticket.id,
                time: times[i],
                quantity: quantities[i]
            });
        }
        res.redirect('/tickets')
    }catch(error){
        res.status(400).send('Erro ao criar ingresso' +error.message)
    }
}

exports.updateTicket = async(req,res) => {
    const {id} = req.params
    const {name, price, times, quantities, scheduleIds, deleteSchedules} = req.body
    try{
        const ticket = await Ticket.findByPk(id)
        if(!ticket){
            return res.status(404).send('Ingresso não encontrado')
        }
        ticket.name = name
        ticket.price = price
        await ticket.save()

        if (deleteSchedules && deleteSchedules.length > 0) {
            await Schedule.destroy({
                where: { id: deleteSchedules }
            });
        }

        for (let i = 0; i < times.length; i++) {
            const scheduleId = scheduleIds[i]
            const time = times[i]
            const quantity = quantities[i]

            if (scheduleId) {
                const schedule = await Schedule.findByPk(scheduleId);
                if (schedule) {
                    schedule.time = time;
                    schedule.quantity = quantity;
                    await schedule.save();
                }
            } else {
                await Schedule.create({
                    ticket_id: ticket.id,
                    time: time,
                    quantity: quantity
                });
            }
        }
        res.redirect('/tickets')
    }catch(error){
        res.status(400).send('Erro ao atualizar ingresso')
    }
}

exports.deleteTicket = async(req,res) => {
    const {id} = req.params
    try{
        const ticket = await Ticket.findByPk(id)
        if(!ticket){
            return res.status(404).send('Ingresso não encontrado')
        }
        await Schedule.destroy({ where: { ticket_id: ticket.id } })
        await ticket.destroy()
        res.redirect('/tickets')
    }catch(error){
        res.status(500).send('Erro ao deletar ingresso')
    }
}