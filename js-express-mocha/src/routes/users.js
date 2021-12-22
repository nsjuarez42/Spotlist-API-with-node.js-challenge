
const fs =require('fs')
/*List schema ex
{
    songs:
        [
            {
                artist:'asasa',
                title:'ddadda'
            }
        ]
    
}
*/

//generate list id

const PATH = "./../../data/users.json"
/*
TODO:
trycatch throw error with response errors to stop code
array destructuring
getUSerListById
create list ids
add song to list
*/
function addUserList(req,res){

if(!req.body.list)res.status(400).send({message:"Invalid parameters"})

const {userid} = req.params
//check that list is valid
var {list} = req.body
console.log(list)
list = JSON.stringify(list)
console.log(list)


fs.readFile(PATH,(err,jsonString)=>{
    if(err){
        console.log(err)
        console.log("error reading file")
    }else{
        try {
       var db =  JSON.parse(jsonString)
       var user,user_index
//find user with id in users.json
db.forEach((element,index)=>{
    console.log(element.id,userid)
    if(element.id == userid){
        user = element
        user_index = index
    }
})

console.log(user)
if(user == undefined) res.status(401).send({message:"User not found with this id (or user is not the one authenticated)"})

if(user.lists == undefined){
    //create list id
    user.lists = [list]
}else{
    user.lists.push(list)
}

//replace user in db using index and user object
console.log(db)
db.splice(user_index,1,user)

console.log(db)

fs.writeFile(PATH,JSON.stringify(db),err=>{
    if(err) console.log(err)
    res.status(200).send(list)
})
        } catch (error) {
            console.log(error)
        }

    }
})

}

function getUserLists(req,res){

    try {

        if(!req.params.userid){
            res.status(400).send({message:"Invalid parameters"})
            throw new Error("Invalid parameters")
    }
        const {userid} = req.params
      
        fs.readFile(PATH,(err,jsonString)=>{
            if(err)
                throw new Error('error reading file')
            else{
              var db = JSON.parse(jsonString)

            var user = db.filter(element=>element.id == userid)
            if(user.length == 0){
                res.status(401).send({message:"User not found with this id (or user is not the one authenticated)"})
                throw new Error("User not found")
            }else{
                user = user[0]
             if(user.lists == undefined)res.status(200).send([])

             res.status(200).send(user.lists)
            }
            }
        })

    } catch (error) {
        console.log(error)
    }

}

function getUserListById(req,res){
 try {
     if(!req.params.userid || !req.params.listid){
         res.status(400).send({message:"Invalid parameters"})
         throw new Error("Invalid parameters")
     }

     fs.readFile(PATH,(err,jsonString)=>{
         if(err) throw new Error("error reading file")
        else{
            var db = JSON.parse(jsonString)
            var user = db.filter(element=>element.id == userid)

            if(user.length == 0){
                res.status(401).send({message:"User not found with this id (or user is not the one authenticated)"})
                throw new Error("User not found")
            }else{
              user = user[0]
              //what to do if user has no lists

              if(user.lists == undefined){

              }else{
                  //filter lists by list id
              }

            }


        }

     })
 } catch (error) {
     console.log(error)
 }
}

function addSongToList(){

}

module.exports = {
    addUserList,
    getUserLists,
    getUserListById
}