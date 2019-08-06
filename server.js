var express = require('express');   //引入express模块
var bodyParser = require('body-parser');    //req.body要用到

var route = require('./routes/route');

var app = express();        //创建express的实例

app.use(bodyParser.json());

app.use('/api', route)

app.listen(3000,function () {    ////监听3000端口
    console.log('Restful API running at 3000 port');
});