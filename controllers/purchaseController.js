const {Purchase, Schedule, Ticket} = require('../models/indexModel')
const { v4: uuidv4 } = require('uuid')

exports.showPurchaseDetailsBySession = async(req,res) => {
    const userId = req.user.id
    try{
        const purchases = await Purchase.findAll({
            where: {userId},
            include: [{model: Ticket},
                       {model: Schedule}
            ],
            order: [['createdAt', 'DESC']]
        })
        const purchasesBySession = purchases.reduce((acc, purchase) => {
            if(!acc[purchase.sessionId]){
                acc[purchase.sessionId] = {total: 0, purchases: []}
            }
            acc[purchase.sessionId].total += parseFloat(purchase.total)
            acc[purchase.sessionId].purchases.push(purchase)
            return acc;
        }, {})

        const formattedPurchasesBySession = Object.entries(purchasesBySession).map(([sessionId, data]) => {
            return {
                sessionId,
                total: parseFloat(data.total).toFixed(2),
                purchases: data.purchases
            }
        })

        res.render('purchases', {purchasesBySession: formattedPurchasesBySession})
    }catch(error){
        res.status(500).send({error: error.message})
    }
}

exports.showPurchasesPage = async (req, res) => {
    const { sessionId } = req.params
    const userId = req.user.id

    try {
        const purchases = await Purchase.findAll({
            where: { userId, sessionId },
            include: [
                { model: Ticket },
                { model: Schedule}
            ]
        });

        if (purchases.length === 0) {
            return res.status(404).send('Pedido não encontrado.')
        }

        res.render('purchaseDetails', { purchases })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

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
    const userId = req.user.id
    const { scheduleIds, quantities } = req.body
    const sessionId = uuidv4()

    try {
        for (let i = 0; i < scheduleIds.length; i++) {
            const scheduleId = scheduleIds[i]
            const quantity = quantities[i]

            if (!quantity || quantity <= 0 || isNaN(quantity)) {
                continue
            }

            const schedule = await Schedule.findByPk(scheduleId, {
                include: [{ model: Ticket }]
            })
            if (!schedule || !schedule.Ticket){
                return res.status(400).send(`Horário ou ingresso não encontrado.`)
            }
            if (schedule.quantity < quantity) {
                return res.status(400).send(`Não há ingressos suficientes para o horário ${schedule.time}.`)
            }
            let total = quantity * schedule.Ticket.price
            console.log(`Quantia: ${quantity}, Preço: ${schedule.Ticket.price}, Total: ${total}`);
            schedule.quantity -= quantity
            await schedule.save()

            await Purchase.create({
                userId,
                ticketId: schedule.Ticket.id,
                scheduleId,
                quantity,
                total,
                sessionId
            })
        }

        res.redirect('/purchases')
    } catch (error) {
        res.status(500).send('Erro ao processar a compra: ' + error.message)
    }
}
