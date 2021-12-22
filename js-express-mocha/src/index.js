/*
    Your solution should go here
*/

const express = require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

const port = process.env.PORT || 3000

const {addUserList,getUserLists, getUserListById} = require('./routes/users')

app.post('/users/:userid/lists',addUserList)
app.get('/users/:userid/lists',getUserLists)
app.get('/users/:userid/lists/:listid',getUserListById)

app.listen(port,()=>{
console.log("app is listening on port 3000")
})

