"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
                if (contents.length < 10000) {
                    var s = sendtext(contents, res);
                    s.then(function (value) {
                        if (value.toString().length != 0) {
                            fs_1.writeFile(file_1, value.toString(), function (err) {
                                if (err) {
                                    console.error(err);
                                    res.send("Ошибка при записи нового файла");
                                }
                                //res.send("Все четко");   
                                //res.sendfile(file);
                                //file written successfully
                            });
                            res.sendfile(file_1);
                            fs_1.unlink(file_1, function (err) {
                                if (err)
                                    console.log(err);
                            });
                        }
                        else {
                            res.send("Не найдено ошибок в файле");
                        }

                    });
                }
                else {
                    var s = '';
                    for (var i = 0; i < contents.length / 10000; i++) {
                        var cont = contents.slice(i * 10000, 10000);
                        s += sendtext(cont, res) + ' ';
                    }
                    if (s.length != 0) {
                        fs_1.writeFile(file_1, s, function (err) {
                            if (err) {
                                console.error(err);
                                res.send("Ошибка при записи нового файла");
                            }
                            // res.send("Все четко");   
                            // res.sendfile(file);
                            //file written successfully
                        });
                        res.send(file_1);
                    }
                }
            }
        });
    }
});
function sendtext(contents, res) {
    return __awaiter(this, void 0, void 0, function () {
        var data, zap;
        return __generator(this, function (_a) {
            data = {
                text: contents.toString()
            };
            zap = {
                method: 'POST',
                url: encodeURI('https://speller.yandex.net/services/spellservice.json/checkText?text=' + contents.toString().replace(/ /g, "+")),
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Accept": "application/json"
                },
                body: data,
                json: true
            };
            return [2 /*return*/, new Promise(function (resolve, reject) {
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
                        resolve(s.toString());
                    }
                });
            })];
        });
    });
}
app.listen(PORT);
