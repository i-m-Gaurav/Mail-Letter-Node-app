const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

const PORT = process.env.PORT || 3000;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us8.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}`;

  const options = {
    method: "POST",
    auth: `gaurav:${MAILCHIMP_API_KEY}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/fail.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/fail", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  res.redirect("/");
});

app.listen(PORT, function () {
  console.log("Server is running on " + PORT);
});
