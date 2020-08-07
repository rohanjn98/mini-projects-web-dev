//CRUD
//mongod --dbpath /home/data --port 27017

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL =  'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
//const id = new ObjectID()

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to the database!')
    }
    console.log('Connected corretly!')
    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     name: 'Rohan',
    //     age: 22
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }
    //     console.log(result.ops);
    // })
    // db.collection('users').insertMany([
    //     {
    //         name: 'Pranay',
    //         age: 22
    //     }, 
    //     {
    //         name: 'Raghav',
    //         age: 21
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents');
    //     }
    //     console.log(result.ops);
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Practice Python3',
    //         completed: true
    //     }, 
    //     {
    //         description: 'Learn Node.js',
    //         completed: true
    //     }, 
    //     {
    //         description: 'Take a bath',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents');
    //     }
    //     console.log(result.ops);
    // })
    // db.collection('users').findOne({name: 'Rohan Bhagwatkar'}, (error, foundUser) => {
    //     if (error) {
    //         return console.log('Unable to find user!')
    //     }
    //     console.log(foundUser)
    // })
    //find method returns a cursor
    db.collection('users').find({ age: 22 }).toArray((error, foundUsers) => {
        console.log(foundUsers);
    })
    db.collection('users').find({ age: 22 }).count((error, count) => {
        console.log(count);
    })
})
