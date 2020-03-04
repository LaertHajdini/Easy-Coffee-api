const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const appDatabase = require('./res/Database')
const sha256 = require('js-sha256').sha256

const port = 4000

const database = new appDatabase()
const server = express()

server.use(cors())
server.use(fileUpload())
server.use('/public', express.static('public'))

server.post('/register', async (req, res) => {
    if (await database.userExists(req.body.email)) {
        res.status(210).end()
    } else {
        database.createUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password)
        res.status(201).end()
    }
})

server.post('/login', async (req, res) => {
    if (await database.userExists(req.body.email)) {
        const data = await database.getUserData(req.body.email)
        if (sha256(req.body.password) === data.password) {
            res.status(202).send(data)
        } else {
            res.status(211).end()
        }
    } else {
        res.status(212).end()
    }
})

server.post('/changePassword', async (req, res) => {
    const data = await database.getUserData(req.body.email)
    const newPassword = sha256(req.body.newPassword)
    if (data.password === req.body.password) {
        if (data.password === newPassword) {
            res.status(210).end()
        } else {
            database.updatePassword(req.body.email, newPassword)
            res.status(201).end()
        }
    } else {
        res.status(404).end()
    }
})

server.post('/deleteAccount', async (req, res) => {
    const data = await database.getUserData(req.body.email)
    if (data.password === req.body.password) {
        database.deleteUser(req.body.email)
        res.status(201).end()
    } else {
        res.status(404).end()
    }
})

server.post('/addPhone', async (req, res) => {
    const data = await database.getUserData(req.body.email)
    if (data.password === req.body.password) {
        await database.addPhone(req.body.email, req.body.phone)
        res.status(201).send(await database.getUserData(req.body.email))
    } else {
        res.status(404).end()
    }
})

server.post('/report', async (req, res) => {
    await database.createReport(req.body.email, req.body.title, req.body.description)
    res.status(201).end()
})


server.listen(port, () => {
    console.log('Api is listening at port ' + port)
})