
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(function(err, instance) {
    if (err) {
        console.log(err)
    }
    console.log('[Status]Database: Connected')
})

class Database {
    constructor() {
        this.users = client.db('userData').collection('users')
    }
    async getData(email) {
        return await this.users.findOne({email: email})
    }
    async userExists(email) {
        return await this.getData(email) ? true : false
    }
    async createUser(email, password) {
        const template = {
            email: email,
            password: password
        }
        return await this.users.insertOne(template, function(error) {
            console.log(`[Action]Register: ${email} status: ${error ? 'Error' : 'Completed'}`)
            return error ? false : true
        })
    }
}

module.exports = Database