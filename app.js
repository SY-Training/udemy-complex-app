const express = require('express');
const app = express();

const router = require('./router.js');

app.use(express.static('public')); // static is for css. the css files are in the public folder
app.set('views', 'views'); // first views is an express method, second is the name of the folder containing HTML.
app.set('view engine', 'ejs'); // setting a view engine for templates. Ejs is the engine.

app.use('/', router);

app.listen(3000);