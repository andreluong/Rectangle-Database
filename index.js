const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:824807@localhost/usr'
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))

app.get('/database', (req,res) => {
  // var data = {results: [1,2,3,4,5]};
  var getUserQuery = `SELECT * FROM usr`;
  pool.query(getUserQuery, (error, result) => {
    if (error)
      res.end(error)
    var results = {'rows':result.rows}
    res.render('pages/db', results);
  }) 
  // res.render('pages/db', data);
})



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


