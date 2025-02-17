const express = require('express')
const purchaseController = require('../controllers/purchaseController')
const {auth} = require('../middlewares/auth')
const router = express.Router()

router.get('/', auth, purchaseController.showPurchasesPage);
router.get('/:id', auth, purchaseController.showPurchaseDetails);
router.post('/', auth, purchaseController.processPurchase);
router.post('/:id/cancel', auth, purchaseController.cancelPurchase);

module.exports = router;