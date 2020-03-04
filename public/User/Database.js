const MongoClient = require('mongodb').MongoClient
const sha256 = require('js-sha256').sha256

const url = 'mongodb://localhost:27017/sell-it'

class database {
    constructor() {
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
        const client = this.client
        client.connect()
        console.log('Database connected sucesfully')
        this.users = client.db('sell-it').collection('users')
        this.products = client.db('sell-it').collection('products')
        this.reports = client.db('sell-it').collection('reports')
    }
    async getUserData(email) {
        const data = await this.users.findOne({email: email.toLowerCase()})
        return data
    }
    async userExists(email) {
        const data = await this.getUserData(email)
        return data === null ? false : true
    }
    updatePassword(email, password) {
        this.users.findOneAndUpdate({email: email}, {$set: {password: password}})
    }
    deleteUser(email) {
        this.users.findOneAndDelete({email: email})
    }
    async addPhone(email, phone) {
        await this.users.findOneAndUpdate({email: email}, {$set: {phone: phone}})
    }
    createUser(firstName, lastName, email, password) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email.toLowerCase(),
            password: sha256(password)
        }
        this.users.insertOne(data)
    }
    createReport(email, title, description) {
        const data = {
            email: email.toLowerCase(),
            title: title,
            description: description,
            date: new Date()
        }
        this.reports.insertOne(data)
    }
}

module.exports = database