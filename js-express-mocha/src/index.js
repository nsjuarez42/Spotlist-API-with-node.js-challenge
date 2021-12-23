/*
    Your solution should go here
*/

/*
TODO:
testing,documentation
refactoring
*/

/*
to run the api:
npm install
in js-express-mocha folder npm run nodemon or node index 


*/

const express = require('express')
var unless = require('express-unless')
const app = express()

app.use(express.json())
app.use(express.urlencoded())

const port = process.env.PORT || 3000

const {addUserList,getUserLists, getUserListById, addSongToList,auth,createUser} = require('./routes/users')

auth.unless = unless
app.use(auth.unless({
    path:[
        {
            url:'/users',methods:['POST']
        }
    ]
}))

app.post('/users/:userid/lists',addUserList)
app.get('/users/:userid/lists',getUserLists)
app.get('/users/:userid/lists/:listid',getUserListById)
app.post('/users/:userid/lists/:listid/songs',addSongToList)
app.post('/users',createUser)

app.listen(port,()=>{
console.log("app is listening on port 3000")
})

