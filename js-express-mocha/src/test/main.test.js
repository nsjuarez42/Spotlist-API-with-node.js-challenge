const chai = require('chai');
const chaiHttp = require('chai-http')
const server = require('../index')

//Assertion style expect
const expect =chai.expect
chai.use(chaiHttp)

/*TODO:
 add a list to a user

 get lists of a user

 get a specific list of a user

 add a song to a list

 login and create user
*/
const username = "Jhon Smith"
const password = "unsecuredpassword1234"
const wrong_password = "asldk"
const userid= "aaaa00"
const wrong_userid = "sdsdsd"
const listid = "71472d43-1229-43b1-b29a-bb6068d6bb9b"

describe("Add list to user test",function(){


    it("Should add list successfully",function(done){
        const list = `{
            "songs":[
                {
                    "artist":"Metallica","title":"Battery"
                },
                {
                    "artist":"Polyphia","title":"G.O.A.T"
                }
            ]
        }`

        const url = `/users/${userid}/lists`

        chai.request(server)
            .post(url)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({name:username,password,list})
            .end((err,response)=>{
                expect(response.status).to.eql(200)
                expect(response.body).to.be.an("object")
                expect(response.body).to.have.property("songs").that.is.an('array')
                done()
            })
    })

    it('Should return an error with status code 400 with invalid parameter message',function(done){
        const url = `/users/${userid}/lists`

        chai.request(server)
            .post(url)
            .end((err,response)=>{
                expect(response.status).to.eql(400)
                expect(response.body).to.be.an("object")
                expect(response.body).to.have.property("message").that.is.eql('Invalid parameters')
                done()
            })

    })

    it('Should return an error with status code 401 with user not found message',function(done){
        const url = `/users/${wrong_userid}/lists`
        const list = `{
            songs:[
                {
                    "artist":"Metallica","title":"Battery"
                },
                {
                    "artist":"Polyphia","title":"G.O.A.T"
                }
            ]
        }`
       chai.request(server)
           .post(url)
           .set('content-type', 'application/x-www-form-urlencoded')
           .send({name:username,password,list})
           .end((err,response)=>{
               expect(response.status).to.eql(401)
               expect(response.body).to.be.an("object")
               expect(response.body).to.have.property("message").that.is.eql("User not found")
               done()
           })
           
    })

    it("Should return an error with status code 401 with user is not authenticated message",function(done){
          const url = `/users/${userid}/lists`

          const list = `{
            songs:[
                {
                    artist:"Metallica",title:"Battery"
                },
                {
                    artist:"Polyphia",title:"G.O.A.T"
                }
            ]
        }`
       chai.request(server)
           .post(url)
           .set('content-type', 'application/x-www-form-urlencoded')
           .send({name:username,password:wrong_password,list})
           .end((err,response)=>{
               expect(response.status).to.eql(401)
               expect(response.body).to.be.an("object")
               expect(response.body).to.have.property("message").that.is.eql("User is not authenticated")
               done()
           })

    })

})

describe("Get a specific list of user test",function(){
//send username and password in body
    it("Should return a list and status code 200",function(done){
        const userid = "aaaa00"
        const username = "Jhon Smith"
        const password = "unsecuredpassword1234"
        const url = "/users/"+ userid + "/lists/" + listid
        
        chai
        .request(server)
        .get(url)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({name:username,password})
        .end((err,response)=>{
            expect(response.status).to.eql(200)
            expect(response.body).to.be.an("object")
            expect(response.body).to.have.property("songs").that.is.not.empty
            done()
        })
    })

    it("Should return an error with status code 400 with invalid parameters message",function(done){
        //dont send anything in request
        const url = "/users/"+ undefined + "/lists/" + undefined
        chai.request(server)
             .get(url)
             .end((err,response)=>{
                 expect(response.status).to.eql(400)
                 expect(response.body).to.be.an("object")
                 expect(response.body).to.have.property("message").that.is.eql("Invalid parameters")
                 done()
             })
    })

/*user not authenticated
send wrong password with correct name
*/
it("Should return an error with status code 401 with user not authenticated message",function(done){
    const userid = "aaaa00"
    const listid = "fc121d50-0e67-4d49-9ae1-a9ce9fbfc034"
    const username = "Jhon Smith"
    const wrong_password = "wrong password"
    const url = "/users/"+ userid + "/lists/" + listid

    chai.request(server)
        .get(url)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({name:username,password:wrong_password})
        .end((err,response)=>{
            expect(response.status).to.be.eql(401)
            expect(response.body).to.be.an("object")
            expect(response.body).to.have.property("message").that.eql("User is not authenticated")
            done()
        })
})
//user not found
it("Should return an error with status code 401 with user not found message",function(done){
    const listid = "fc121d50-0e67-4d49-9ae1-a9ce9fbfc034"
    const username = "Jhon Smith"
    const password = "unsecuredpassword1234"
    const url = "/users/"+ wrong_userid + "/lists/" + listid
 
    chai
    .request(server)
    .get(url)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({name:username,password})
    .end((err,response)=>{
        expect(response.status).to.eql(401)
        expect(response.body).to.be.an("object")
        expect(response.body).to.have.property("message").that.is.eql("User not found")
        done()
    })

})

})

describe("Get lists of specific user",function(){

    it("Should return an array of lists and status code of 200",function(done){
        const url = `/users/${userid}/lists`
        
        chai.request(server)
            .get(url)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({name:username,password})
            .end((err,response)=>{
                expect(response.status).to.eql(200)
                expect(response.body).to.be.an('array').and.to.be.not.empty
                done()
            })
            
    })

    it("Should return an error message with invalid parameters and status code of 400",function(done){
      const url = `/users/${userid}/lists`

      chai.request(server)
         .get(url)
         .end((err,response)=>{
             expect(response.status).to.eql(400)
             expect(response.body).to.be.an("object").with.property("message").that.is.eql("Invalid parameters")
             done()
         })
    })

    it("Should return an error message with user not found and status code of 401",function(done){
        const url = `/users/${wrong_userid}/lists`

        chai.request(server)
            .get(url)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({name:username,password})
            .end((err,response)=>{
                expect(response.status).to.eql(401)
                expect(response.body).to.be.an("object").and.have.property("message").that.is.eql("User not found")
                done()
            })
            

    })
/*
401 user not found or not authenticated
*/
})

describe("Add a song to a specific list",function(){

    const song = `{
        "artist":"Guns n roses",
        "title":"Sweet child o mine"
    }`

    it("Should return a song with a status code of 200",function(done){
        const url = `/users/${userid}/lists/${listid}/songs`

        chai.request(server)
             .post(url)
             .set('content-type', 'application/x-www-form-urlencoded')
             .send({name:username,password,song})
             .end((err,response)=>{
                 expect(response.status).to.eql(200)
                 expect(response.body).to.be.an("object").and.have.property("artist")
                 expect(response.body).to.have.property("title")
                 done()
             })
             
    })

    it("Should return an error message with invalid parameters and status code 400",function(done){
        const url = `/users/${userid}/lists/${listid}/songs`

        chai.request(server)
            .post(url)
            .end((err,response)=>{
                expect(response.status).to.eql(400)
                expect(response.body).to.be.an("object").and.to.have.property("message")
                done()
            })
            
    })

    it("Should return an error message with user not found and status code 401",function(done){
        const url = `/users/${wrong_userid}/lists/${listid}/songs`

        chai.request(server)
             .post(url)
             .set('content-type', 'application/x-www-form-urlencoded')
             .send({name:username,password,song})
             .end((err,response)=>{
                 expect(response.status).to.eql(401)
                 expect(response.body).to.be.an("object").and.to.have.property("message")
                 done()
             })
             
    })

    it("Should return an error message with user not authenticated and status code 401",function(done){

        const url = `/users/${userid}/lists/${listid}/songs`
        chai.request(server)
            .post(url)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({name:username,password:wrong_password,song})
            .end((err,response)=>{
                expect(response.status).to.eql(401)
                expect(response.body).to.be.an("object").and.to.have.property("message")
                done()
            })    
    })
})