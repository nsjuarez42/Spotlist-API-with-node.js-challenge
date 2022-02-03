const fs =require('fs')
const PATH = "./../data/users.json"

 function getUsers(){
     var response = fs.readFileSync(PATH)
     return JSON.parse(response)
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