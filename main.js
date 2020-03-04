const express = require('express')
const cors = require('cors')

const server = express()
const plan = require('./public/Plans/routes')
const order = require('./public/Orders/routes')
const user = require('./public/User/routes')

const port = 1000

server.use(cors())
server.use('/public', express.static('public'))
server.use('/', plan)
server.use('/', order)
server.use('/', user)

server.listen(port, () => {
    console.log('[Status]Server: Running')
})