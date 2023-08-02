//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

//create web server
const port = 3000;
app.listen(port, () => {
    console.log("Server is running at http://localhost:3000");
});

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

//get data from file
let data = fs.readFileSync('data.json');
let comments = JSON.parse(data);

//get comments
app.get('/api/comments', (req, res) => {
    res.json(comments);
});

//post comments
app.post('/api/comments', (req, res) => {
    let comment = req.body;
    comments.push(comment);
    let data = JSON.stringify(comments, null, 2);
    fs.writeFile('data.json', data, (err) => {
        if (err) {
            console.log(err);
        }
        res.json(comments);
    });
});

//delete comments
app.delete('/api/comments/:id', (req, res) => {
    let id = req.params.id;
    let index = comments.findIndex(comment => {
        return (comment.id === Number.parseInt(id));
    });
    if (index !== -1) {
        comments.splice(index, 1);
        let data = JSON.stringify(comments, null, 2);
        fs.writeFile('data.json', data, (err) => {
            if (err) {
                console.log(err);
            }
            res.json(comments);
        });
    }
    else {
        res.json(comments);
    }
});

//update comments
app.put('/api/comments/:id', (req, res) => {
    let id = req.params.id;
    let index = comments.findIndex(comment => {
        return (comment.id === Number.parseInt(id));
    });
    if (index !== -1) {
        comments[index].name = req.body.name;
        comments[index].comment = req.body.comment;
        let data = JSON.stringify(comments, null, 2);
        fs.writeFile('data.json', data, (err) => {
            if (err) {
                console.log(err);
            }
            res.json(comments);
        });
    }
    else {
        res.json(comments);
    }
});