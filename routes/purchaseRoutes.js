const express = require('express')
const purchaseController = require('../controllers/purchaseController')
const {auth} = require('../middlewares/auth')
const router = express.Router()

router.get('/session/:sessionId', auth, purchaseController.showPurchasesPage)
router.get('/', auth, purchaseController.showPurchaseDetailsBySession);
router.get('/:id', auth, purchaseController.showPurchaseDetails);
router.post('/', auth, purchaseController.processPurchase);

module.exports = router;