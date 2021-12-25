
const {v4:uuidv4} = require("uuid")
const {getUsers,setUsers} = require('../db/fsImpl')

/*auth function used as middleware (before every request to api)
 for basic user authentication (username and password)
*/

//return true if user exists in db or throws error
function checkUser(res,db,userid){
    //find the user by id
    var user = db.find(element=>element.id == userid)
    //if there is no user with provided id
    if(!user){
        res.status(401).send({message:"User not found"})
        throw new Error("User not found")
    }
    return true
}

async function auth(req,res,next){
    
    //take in name and password in body of request 
    try {
        if(!req.body.name || !req.body.password || req.body.name == "" || !req.params.userid){
            res.status(400).send({message:"Invalid parameters"})
            throw new Error("Invalid parameters")
         }
         const {name,password} = req.body
         const {userid} = req.params

         //get the users db
         var db = getUsers()
         
        if(checkUser(res,db,userid)){
         //compare password of user in db with password provided by request
         if(user.password == password){
             next()
         }else{
             res.status(401).send({message:"User is not authenticated"})
             throw new Error("User not authenticated")
         }
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

/*function to add user playlist for endpoint POST /users/:userid/lists
*/
function addUserList(req,res){
try {
    //check for list to add in request body and user id in request parameter
    if(!req.body.list || !req.params.userid){
        res.status(400).send({message:"Invalid parameters"})
        throw new Error("Invalid parameters")
    }
    
    const {userid} = req.params
    //check that list is valid
    var {list} = req.body
    //parse list to json 
    list = JSON.parse(list)

//get user db
   var db = getUsers();

   var user,user_index
   //find user with id in users db and get its index
   db.forEach((element,index)=>{
       if(element.id == userid){
           user = element
           user_index = index
       }
   })

     if(user == undefined){
        res.status(401).send({message:"User not found (or user is not the one authenticated)"})
        throw new Error("User not found (or user is not the one authenticated)")
    } 
    //create list id
    list.listId = uuidv4()

    if(user.lists == undefined){
        user.lists = [list]
    }else{
        user.lists.push(list)
    }
    
    //replace user in db using index and user object
    db.splice(user_index,1,user)

   setUsers(db)

   res.status(200).send(list)
} 
catch (error) {
   // console.log(error)
}

}

//function to get user lists for endpoint GET /user/:userid/lists
function getUserLists(req,res){

    try {
        //check for user id in request params
        if(!req.params.userid){
            res.status(400).send({message:"Invalid parameters"})
            throw new Error("Invalid parameters")
    }
        const {userid} = req.params
       //get users db
        var db = getUsers()
        if(checkUser(res,db,userid)){
            //check if user has lists and send them
            if(user.lists == undefined)res.status(200).send([])
            res.status(200).send(user.lists)
        }  
    } catch (error) {
       // console.log(error)
    }

}

//function to get a user playlist by id for GET endpoint /users/:userid/lists/:listid
function getUserListById(req,res){

 try {
     //check for userid and listid in request parameters
     if(!req.params.userid || !req.params.listid){
         res.status(400).send({message:"Invalid parameters"})
         throw new Error("Invalid parameters")
     }
     const {userid,listid} = req.params

     var db = getUsers()

     if(checkUser(res,db,userid)){
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

//function to add song to a list by id for endpoint POST /users/:userid/lists/:listid/songs
function addSongToList(req,res){

try {
    //check for song in body and userid and listid in request params
    if(!req.body.song || !req.params.userid|| !req.params.listid){
        res.status(400).send({message:"Invalid parameters"})
        throw new Error("Invalid parameters")
    }
    const {userid,listid} = req.params
    var song= JSON.parse(req.body.song)

        var db = getUsers()
         if(checkUser(res,db,userid)){
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
                 }
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