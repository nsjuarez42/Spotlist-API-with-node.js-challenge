
const {v4:uuidv4} = require("uuid")
const {getUsers,setUsers} = require('../db/fsImpl')
const bcrypt =require('bcrypt')
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

/*
TODO:
testing

internal server error
typescript
interface db with fs file impplementation

*/
async function auth(req,res,next){
    //take in name and password 

    try {
        if(!req.body.name || !req.body.password || req.body.name == "" || !req.params.userid){
            res.status(400).send({message:"Invalid parameters"})
            throw new Error("Invalid parameters")
         }
         console.log(req.params)
         const {name,password} = req.body
         const {userid} = req.params
         //params is undefined
         console.log(userid)
         var db = getUsers()

         var user 
         user= db.find(el=>el.id == userid)

         if(!user){
             res.status(401).send({message:"User not found"})
     throw new Error("User not found")
         }
         //compare passwords

         //bcrypt compare
         if(user.password == password/*await bcrypt.compare(password,user.password)*/){
             next()
         }else{
             res.status(401).send({message:"User is not authenticated"})
             throw new Error("User not authenticated")
         }
    } catch (error) {
       // console.log(error)
    }

}

async function createUser(req,res){
    try {
        if(!req.body.name || !req.body.password){
            res.status(400).send({message:"Invalid parameters"})
            throw new Error("Invalid parameters")
        }

        const {name,password} = req.body

        var db = getUsers();

        //check if there is a user with that name
        var user = db.find(el=>el.name == name)
        if(!user){
          //user already exists
          res.status(400).send({message:"Invalid parameters (username already taken)"})
          throw new Error("Invalid parameters (username already taken)")
        }
        //check if password is strong enough
       //At least 8 characters—the more characters, the better
       if(password.split('').length > 8){
          //A mixture of both uppercase and lowercase letters
       if(password.toUpperCase() == password || password.toLowerCase() == password){
        //A mixture of letters and numbers 
        //Inclusion of at least one special character, e.g., ! @ # ? ]
       let specialCharacterRgx = /[!@#$%^&*()_+{}|?/]+/ 

       let numbersRgx = /\d+/
       let lettersRgx = /[A-z]+/
       if(numbersRgx.test(password) && lettersRgx.test(password) && specialCharacterRgx.test(password)){
       
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt)
        
        user = {
            id:uuidv4(),
            name,
            hashedPassword
        }

        db.push(user)

        setUsers(db)
        res.status(200).send(user)
       }
    }
       }
    } catch (error) {
        //console.log(error)
    }
}


function addUserList(req,res){
try {
    if(!req.body.list){
        res.status(400).send({message:"Invalid parameters"})
        throw new Error("Invalid parameters")
    }
    
    const {userid} = req.params
    //check that list is valid
    var {list} = req.body
  //  console.log(list)
    list = JSON.parse(list)
   // console.log(list)

   var db = getUsers();

   var user,user_index
   //find user with id in users.json
   db.forEach((element,index)=>{
      // console.log(element.id,userid)
       if(element.id == userid){
           user = element
           user_index = index
       }
   })
     // console.log(user)
     if(user == undefined){
        res.status(401).send({message:"User not found (or user is not the one authenticated)"})
        throw new Error("User not found (or user is not the one authenticated)")
    } 
    //create list id
    list.listId = uuidv4()
   // console.log(list)
    if(user.lists == undefined){
        //create list id
        user.lists = [list]
    }else{
        user.lists.push(list)
    }
    
    //replace user in db using index and user object
   // console.log(db)
    db.splice(user_index,1,user)
   // console.log(db)
   setUsers(db)

   res.status(200).send(list)
} 
catch (error) {
   // console.log(error)
}

}

function getUserLists(req,res){

    try {
        if(!req.params.userid){
            res.status(400).send({message:"Invalid parameters"})
            throw new Error("Invalid parameters")
    }
        const {userid} = req.params

        var db = getUsers()

        var user = db.find(element=>element.id == userid)
        if(!user){
            res.status(401).send({message:"User not found (or user is not the one authenticated)"})
            throw new Error("User not found")
        }else{
         if(user.lists == undefined)res.status(200).send([])

         res.status(200).send(user.lists)
        }
    } catch (error) {
       // console.log(error)
    }

}

function getUserListById(req,res){

 try {
     if(!req.params.userid || !req.params.listid){
         res.status(400).send({message:"Invalid parameters"})
         throw new Error("Invalid parameters")
     }
     const {userid,listid} = req.params

     var db = getUsers()

     var user = db.find(element=>element.id == userid)

     if(!user){
         res.status(401).send({message:"User not found (or user is not the one authenticated)"})
         throw new Error("User not found")
     }else{
       //what to do if user has no lists

       if(user.lists == undefined){
       res.status(200).send([])
       }else{
           var list = user.lists.filter(el=>el.listId == listid)
           if(list == []){
               res.status(200).send([])
           }else{
               res.status(200).send(list[0])
           }//filter lists by list id
       }
     }
 } catch (error) {
   //  console.log(error)
 }
}

function addSongToList(req,res){

//Song structure
/*
{ 
    artist:"Architects",
    title:"Animals"
}
 */

try {
    if(!req.body.song || !req.params.userid|| !req.params.listid){
        res.status(400).send({message:"Invalid parameters"})
        throw new Error("Invalid parameters")
    }
    const {userid,listid} = req.params
    var song= JSON.parse(req.body.song)
    console.log(song)

        var db = getUsers()
        var user = db.find(element=>element.id == userid)
            
             
            if(!user){
                res.status(401).send({message:"User not found (or user is not the one authenticated)"})
                throw new Error("User not found")
            }
            if(user.lists == undefined){
           //no list to add song to maybe invalid parameter bc of list id
            }else{
                var list = user.lists.find(el=>el.listId == listid)
                console.log(list)
                if(!list){
                    //list non existent
                }else{
                var user_index = db.indexOf(user)
                 //replace list in user lists    
                 var list_index = user.lists.indexOf(list)
                 //add song to list
                 list.songs.push(song)
                 user.lists.splice(list_index,1,list)
                 db.splice(user_index,1,user)

                 setUsers(db)
                 res.status(200).send(song)

                }
            //find list by id and add song to it write file
            }
           
    }
 catch (error) {
    //console.log(error)
}
}

module.exports = {
    addUserList,
    getUserLists,
    getUserListById,
    addSongToList,
    auth,
    createUser
}