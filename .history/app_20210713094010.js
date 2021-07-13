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
//const textgearsApi = textgears('pfOyHhiFzS4TAZGp', { language: 'en-US' });
app.post("/file", upload, function (req, res, next) {
    var filedata = req.file;
    console.log(filedata);
    if (!filedata)
        res.send("Ошибка при загрузке файла");
    else {
        var path = 'uploads';
        var file = path + "/" + filedata.filename;
        var dat = fs_1.readFile(file, 'utf-8', function (err, contents) {
            if (!err) {
                var request = require("request");
                if (contents.length < 1000) {
                    var data = {
                        text: contents.toString()
                    };
                    request.post({
                        method: 'POST',
                        url: 'https://speller.yandex.net/services/spellservice.json/checkText?text=' + contents.toString(),
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            "Accept": "application/json"
                        },
                        body: data
                    }, function (error, body) {
                        if (error) {
                            console.log("Ошибка: " + error);
                        }
                        else {
                            console.log(body);
                        }
                    });
                }
                else {
                    //for(let i = ;)
                }
            }
        });
    }
});
app.listen(PORT);
