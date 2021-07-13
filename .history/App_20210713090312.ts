import { appendFile, appendFileSync, WriteFileOptions, readFile, readFileSync, open, access, mkdirSync } from 'fs';
import textgears from 'textgears-api';
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const multer = require("multer");
const PORT = 3002;

const upload = multer({ dest: "uploads" });

//const textgearsApi = textgears('pfOyHhiFzS4TAZGp', { language: 'en-US' });

app.post("/file", upload, function (req, res, next) {

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
                    let zap = {
                        url: 'https://speller.yandex.net/services/spellservice.json/checkText?text=' + contents.toString(),
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        async: false,
                        success: function(data) {
                            console.log(data); // Выводим ответ, в ответе должен передаваться js-объект
                        }
                    }
                }else{
                    //for(let i = ;)
                }
            }
        });
    }

});
app.listen(PORT);