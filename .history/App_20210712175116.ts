import { appendFile, appendFileSync, WriteFileOptions, readFile, readFileSync, open, access, mkdirSync } from 'fs';
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const multer  = require("multer");
const PORT = 3002;

const upload = multer({dest:"uploads"});

app.post("/file",upload, function (req, res, next) {
   
    let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else 
    {
        let path = 'uploads'
        let file = path + "/" + filedata.filename;
    }

});
app.listen(PORT);