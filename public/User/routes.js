const user = require('express').Router()
const fileUploader = require('express-fileupload')

const Database = require('../res/database')
const database = new Database()

user.use(fileUploader())

user.post('/register', async function(req, res) {
    if (await database.userExists(req.body.email)) {
        res.sendStatus(201)
    } else {
        res.sendStatus(await database.createUser(req.body.email, req.body.password) ? 300 : 200) 
    }
})

user.post('/login', async function(req, res) {
    if (await database.userExists(req.body.email)) {
        res.send(await database.getData(req.body.email)).status(200).end()
    } else {
        res.sendStatus(202)
    }
})

module.exports = user