let express = require('express');
let app = express();

// port to host
const port = 3000;

// js & css
app.use(express.static('public'));

// process form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set view engine as pug
app.set('view engine', 'pug');

// GET /
app.get('/', (req, res) => {
    res.render('login');
});

app.listen(port, () => {
    console.log(`Server start running on http://localhost:${port}/login`);
});