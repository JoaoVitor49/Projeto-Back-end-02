const {Purchase, Schedule, Ticket} = require('../models/indexModel')

exports.showPurchasesPage = async(req,res) => {
    const userId = req.user.id
    try{
        const purchases = await Purchase.findAll({
            where: {userId},
            include: [{model: Ticket}]
        })
        res.render('purchases', {purchases})
    }catch(error){
        res.status(500).send({error: error.message})
    }
}

exports.showPurchaseDetails = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    try {
        const purchase = await Purchase.findOne({
            where: { id, userId },
            include: [{ model: Ticket,
                        include: [{model: Schedule, as: 'schedules'}]
             }]
        });
        if (!purchase) {
            return res.status(404).send('Compra não encontrada')
        }
        res.render('purchaseDetails', { purchase })
    } catch (error) {
        res.status(500).send({error})
    }
};

exports.processPurchase = async (req, res) => {
    const userId = req.user.id;
    const { scheduleIds, quantities } = req.body;
    try {
        for (let i = 0; i < scheduleIds.length; i++) {
            const scheduleId = scheduleIds[i]
            const quantity = quantities[i]
            const schedule = await Schedule.findByPk(scheduleId, {
                include: [{ model: Ticket }]
            })
            if (!schedule || !schedule.Ticket){
                return res.status(400).send(`Horário ou ingresso não encontrado.`);
            }
            if (schedule.quantity < quantity) {
                return res.status(400).send(`Não há ingressos suficientes para o horário ${schedule.time}.`);
            }
            const total = quantity * schedule.Ticket.price;
            schedule.quantity -= quantity;
            await schedule.save();

            await Purchase.create({
                userId,
                ticketId: schedule.Ticket.id,
                scheduleId,
                quantity,
                total
            })
        }

        res.redirect('/purchases')
    } catch (error) {
        res.status(500).send('Erro ao processar a compra: ' + error.message)
    }
}

exports.cancelPurchase = async (req, res) => {
    const { id } = req.params;
    try {
        const purchase = await Purchase.findByPk(id);
        if (!purchase || purchase.status === 'cancelled') {
            return res.status(400).send('Purchase cannot be cancelled.');
        }
        purchase.status = 'cancelled';
        await purchase.save();
        res.redirect('/purchases');
    } catch (error) {
        res.status(500).send('Error cancelling purchase');
    }
};