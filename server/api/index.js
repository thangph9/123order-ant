var express     = require('express')
var router = express.Router()
router.use('/order',require('./order'))
router.use('/user',require('./user'))
router.use('/category',require('./category'))
router.use('/product',require('./product'))
router.use('/',require('./global'))
module.exports = router;