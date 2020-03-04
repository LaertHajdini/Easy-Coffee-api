const order = require('express').Router()
const ordersData = require('./orders.json')


order.get('/order', function(req, res) {
    res.status(200).json(ordersData)
})

module.exports = order