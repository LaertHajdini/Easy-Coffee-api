const plan = require('express').Router()
const plansData = require('./plans.json')

for (const plan of plansData) {
    const json = require(`${__dirname}/${plan.page}`)
    plan.page = json
}

plan.get('/plans', function(req, res) {
    res.status(200).json(plansData)
})

module.exports = plan