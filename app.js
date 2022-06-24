const express = require('express');
const app = express();

app.use(express.static('public')); // static is for css. the css files are in the public folder
app.set('views', 'views'); // first views is an express method, second is the name of the folder containing HTML.
app.set('view engine', 'ejs'); // setting a view engine for templates. Ejs is the engine.

app.get('/', function (req, res) {
    res.render('home-guest');
});

app.listen(3000);