"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
//import textgears from 'textgears-api';
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var bodyParser = require('body-parser');
var multer = require("multer");
var PORT = 3002;
var upload = multer({ dest: "uploads" });
var request = require("request");
//const textgearsApi = textgears('pfOyHhiFzS4TAZGp', { language: 'en-US' });
app.post("/file", upload.single('FileTest'), function (req, res, next) {
    var filedata = req.file;
    console.log(filedata);
    if (!filedata)
        res.send("Ошибка при загрузке файла");
    else {
        var path = 'uploads';
        var file_1 = path + "/" + filedata.filename;
        var dat = fs_1.readFile(file_1, 'utf-8', function (err, contents) {
            if (!err) {
                if (contents.length < 1000) {
                    sendtext(contents, res, file_1);
                }
                else {
                    // for(let i = 0;i < contents.length)
                }
            }
        });
    }
});
function sendtext(contents, res, file) {
    var data = {
        text: contents.toString()
    };
    var zap = {
        method: 'POST',
        url: encodeURI('https://speller.yandex.net/services/spellservice.json/checkText?text=' + contents.toString().replace(/ /g, "+")),
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json"
        },
        body: data,
        json: true
    };
    request.post(zap, function (error, body) {
        if (error) {
            console.log("Ошибка: " + error);
            res.send("Ошибка: " + error);
        }
        else {
            var s = contents.toString();
            for (var i = 0; i < body.body.length; i++) {
                s = s.replace(body.body[i].word, body.body[i].s[0]);
            }
            console.log(s);
            if (s.length != 0) {
                fs_1.writeFile(file, s, function (err) {
                    if (err) {
                        console.error(err);
                        res.send("Ошибка при записи нового файла");
                    }
                    // res.send("Все четко");   
                    res.sendfile(file);
                    
                    //file written successfully
                });
            }
            else {
                res.send("Не найдено ошибок в файле");
            }
        }
    });
}
app.listen(PORT);
