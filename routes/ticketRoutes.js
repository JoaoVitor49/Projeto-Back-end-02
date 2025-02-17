const express = require('express')
const ticketController = require('../controllers/ticketController')
const {auth, isAdmin} = require('../middlewares/auth') 
const router = express.Router()

router.get('/', auth, ticketController.showTicketsPage);
router.get('/edit/:id', auth, isAdmin, ticketController.showEditTicketPage);
router.get('/create', auth, isAdmin, ticketController.showCreateTicketPage);
router.post('/', auth, isAdmin, ticketController.createTicket);
router.post('/update/:id', auth, isAdmin, ticketController.updateTicket);
router.get('/delete/:id', auth, isAdmin, ticketController.deleteTicket);

module.exports = router