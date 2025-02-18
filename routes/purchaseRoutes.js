const express = require('express')
const purchaseController = require('../controllers/purchaseController')
const {auth} = require('../middlewares/auth')
const router = express.Router()

router.get('/', auth, purchaseController.showPurchasesPage)
router.get('/:id', auth, purchaseController.showPurchaseDetails)
router.post('/', auth, purchaseController.processPurchase)

module.exports = router;
