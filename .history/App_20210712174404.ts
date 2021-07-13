const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const multer  = require("multer");
const PORT = 3002;

app.use(multer({dest:"uploads"}));

app.post("/file", function (req, res, next) {
   
    let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else 
    {

    }

});
app.listen(3000);