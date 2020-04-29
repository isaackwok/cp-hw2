let express = require('express');
let app = express();

//AWS
let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'}); // Set the region 

// SQS
let sqs = new AWS.SQS();

//DynamoDB

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB();

// port to host
const port = process.env.PORT || 3000;

// js & css
app.use(express.static('public'));

// process form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set view engine as pug
app.set('view engine', 'pug');

// GET /
app.get('/', (req, res) => {
    res.render('login');
});

// POST /
app.post('/addmember', (req, res) => {
    queue(req);
    insertToDB(req);
    res.render('login');
});

app.listen(port, () => {
    console.log(`Server start running on http://localhost:${port}/`);
});

function queue(req) {
    let params = {
        MessageBody: `Add new member: ${req.body.name}, ${req.body.email}, ${req.body.age}, ${req.body.sex}`,
        MessageAttributes: {
            "Name": {
                DataType: "String",
                StringValue: `${req.body.name}`
            },
            "Email": {
                DataType: "String",
                StringValue: `${req.body.email}`
            },
            "Age": {
                DataType: "Number",
                StringValue: `${req.body.age}`
            },
            "Sex": {
                DataType: "String",
                StringValue: `${req.body.sex}`
            },
        },
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/300144314676/new_member"
    };

    sqs.sendMessage(params, (err, data) => {
        if (err)
            console.error(err);
        else
            console.log("Add member successfully.", data);
    });
}

function insertToDB(req) {
    let dbparams = {
        TableName: 'user',
        Item: {
          'name' : {S: `${req.body.name}`},
          'email' : {S: `${req.body.email}`},
          'age' : {N: `${req.body.age}`},
          'sex' : {S: `${req.body.sex}`}
        }
      };
      
      // Call DynamoDB to add the item to the table
      ddb.putItem(dbparams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Insert into table successfully", data);
        }
      });
}