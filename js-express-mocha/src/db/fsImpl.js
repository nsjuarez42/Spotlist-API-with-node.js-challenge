const fs =require('fs')
const PATH = "./../data/users.json"
/*
functions 
get users read file return json
set users write file return boolean for success

*/
 function getUsers(){
     var response = fs.readFileSync(PATH)
     return JSON.parse(response)
 /* fs.readFileSync(PATH,(err,jsonString)=>{
      if(err){
       console.log(err)
       throw new Error("Error reading file")
      }
      //json parse error not being thrown
      var db = JSON.parse(jsonString)
      return db 
  })*/
}

function setUsers(db){
 fs.writeFile(PATH,JSON.stringify(db),err=>{
     if(err)throw new Error("Error writing file")
     return true
 })
}

module.exports = {
    getUsers,
    setUsers
}