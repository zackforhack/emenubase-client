var express = require('express');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser());


app.use(express.static(__dirname));
app.listen(process.env.PORT || 3000);