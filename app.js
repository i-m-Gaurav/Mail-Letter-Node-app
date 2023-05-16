const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();


const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req,res){

    
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/348542f819";

    const options = {
        method: "POST",
        auth: "gaurav:1ed37461fe6a8780e123b8120eccda2d-us8"
    }
    const requeset = https.request(url, options, function(resposne){

        if(resposne.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else
        res.sendFile(__dirname + "/fail.html");
        
        resposne.on("data", function(data){
            console.log(JSON.parse(data));
        })
    } )

    requeset.write(jsonData);

    requeset.end();

})

app.post("/fail",  function(req,res){
    res.redirect("/");
})
app.post("/success",  function(req,res){
    res.redirect("/");
})



app.listen(PORT, function(){
    console.log("Server is running on " + PORT);
})



// API KEY
// 1ed37461fe6a8780e123b8120eccda2d-us8

// List id
// 348542f819