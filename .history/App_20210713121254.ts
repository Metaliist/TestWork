import { appendFile, appendFileSync, WriteFileOptions, readFile, readFileSync, open, access, mkdirSync, writeFile, unlink } from 'fs';
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

app.post("/file", upload.single('FileTest'), function (req, res, next) {

    let filedata = req.file;
    console.log(filedata);
    if (!filedata)
        res.send("Ошибка при загрузке файла");
    else {
        let path = 'uploads'
        let file = path + "/" + filedata.filename;
        let dat = readFile(file, 'utf-8', (err, contents) => {
            if (!err) {
                if (contents.length < 10000) {
                    let s = ''
                    s = sendtext(contents, res)
                    if (s.length != 0) {
                        writeFile(file, s, err => {
                            if (err) {
                                console.error(err)
                                res.send("Ошибка при записи нового файла")
                            }
                            // res.send("Все четко");   
                            // res.sendfile(file);
                            //file written successfully
                        })
                    } else {
                        res.send("Не найдено ошибок в файле");
                    }
                    res.send(file);
                    unlink(file, (err) => {
                        if (err) console.log(err);
                    });
                }
                else {
                    let s = ''
                    for (let i = 0; i < contents.length / 10000; i++) {

                        let cont = contents.slice(i * 10000, 10000);

                        s += sendtext(cont, res) + ' ';
                    }
                    if (s.length != 0) {
                        writeFile(file, s, err => {
                            if (err) {
                                console.error(err)
                                res.send("Ошибка при записи нового файла")
                            }
                            // res.send("Все четко");   
                            // res.sendfile(file);
                            //file written successfully
                        })
                        res.send(file);
                    }
                }
            }
        });
    }

});
async function sendtext(contents, res) {
    let data = {
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
    return new Promise((resolve, reject) => {
        request.post(zap, function (error, body) {
            if (error) {
                console.log("Ошибка: " + error);
                res.send("Ошибка: " + error);
            }
            else {
                let s = contents.toString();
                for (let i = 0; i < body.body.length; i++) {
                    s = s.replace(body.body[i].word, body.body[i].s[0]);
                }
                resolve(s.toString());
            }
        });
    });

}
app.listen(PORT);