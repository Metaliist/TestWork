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
        var file = path + "/" + filedata.filename;
        var dat = fs_1.readFile(file, 'utf-8', function (err, contents) {
            if (!err) {
                if (contents.length < 1000) {
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
                    let z=encodeURI('https://speller.yandex.net/services/spellservice.json/checkText?text=' + contents.toString().replace(/ /g, "+"));
                 
                    request.post(zap, function (error, body) {
                        if (error) {
                            console.log("Ошибка: " + error);
                            res.send("Ошибка: " + error);
                        }
                        else {
                            let s =''
                            for(let i = 0; i < body.body.length;i++){
                                s+=body.body[i].s[0]+' ';
                            }
                            console.log(s);
                        }
                    });   /*
                    request.get(z, function (error, body){
                        if (error) {
                            console.log("Ошибка: " + error);
                            res.send("Ошибка: " + error);
                        }
                        else {
                            console.log(body);
                        }
                    })*/
                }
                else {
                    //for(let i = ;)
                }
            }
        });
    }
});
app.listen(PORT);
