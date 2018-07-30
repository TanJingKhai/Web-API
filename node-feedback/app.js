var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongodb = require('mongodb')
var port = 3000;
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017')

var app = express()

var feeback_info = new mongodb.Schema({
    Name: String,
    Email: String,
    Comment: String
})

var User = mongodb.model('User', feeback_info)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, 'public')))


app.post('/addcomment', (req, res) => {
    var myData = new User(req.body)
    myData.save()
        .then(item => {
            res.send('Feedback saved to database')
        })
        .catch(err => {
            res.status(400).send('Unable to save to database')
        })
})

app.get('/view-feedbacks',  function(req, res) {
    dbConn.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks)
        })
    })
})

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' )