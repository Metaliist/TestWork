import { appendFile, appendFileSync, WriteFileOptions, readFile, readFileSync, open, access, mkdirSync } from 'fs';
//import textgears from 'textgears-api';
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const multer = require("multer");
const PORT = 3002;

const upload = multer({ dest: "uploads" });
var request = require("request");
//const textgearsApi = textgears('pfOyHhiFzS4TAZGp', { language: 'en-US' });

app.post("/file",upload.single('FileTest'), function (req, res, next) {

    let filedata = req.file;
    console.log(filedata);
    if (!filedata)
        res.send("Ошибка при загрузке файла");
    else {
        let path = 'uploads'
        let file = path + "/" + filedata.filename;
        let dat = readFile(file, 'utf-8', (err, contents) => {
            if (!err) {
                if (contents.length < 1000) {
                    let data = {
                        text: contents.toString()
                    };
                    let zap={
                        method: 'POST',
                        url: 'https://speller.yandex.net/services/spellservice.json/checkText?text=' + contents.toString().replace(" ","+"),
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            "Accept": "application/json"
                        },
                        body: data,
                        json: true
                    }
                    request.post(zap,
                        function (error, body) {
                            if (error) {
                                console.log("Ошибка: " + error);
                                res.send("Ошибка: " + error);
                            } else {
                                console.log(body);
                            }
                        });

                } else {
                    //for(let i = ;)
                }
            }
        });
    }

});
app.listen(PORT);