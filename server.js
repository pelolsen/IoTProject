const express = require('express')
const app = express()
const session = require('express-session') //Create a local-session
const res = require('express/lib/response')
const methodOverride = require("method-override") //To override Post method with Delete
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(methodOverride('_method'))





// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // For serving static CSS files

// Data storage
let data = [];

// Routes


app.get('/', (req, res) => {
    const counts = {
        in: data.filter(item => item.Direction === 'In').length,
        out: data.filter(item => item.Direction === 'Out').length,
        inside: data.filter(item => item.Direction === 'In').length - data.filter(item => item.Direction === 'Out').length
    };
    res.render('dashboard', { data, counts });
});

app.post('/data', (req, res) => {
    const { TimeStamp, Direction } = req.body;
    if (TimeStamp && Direction) {
        data.push({ TimeStamp, Direction });
        res.send({ message: 'Data received successfully.' });
    } else {
        res.status(400).send({ message: 'Invalid data.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
