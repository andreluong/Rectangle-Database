const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL
})
  
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))

app.get('/database', (req,res) => {
    // var getUsersQuery = 'SELECT * FROM usr;';
    if(error)
        throw error;
        res.end(error);
    pool.query(`SELECT * FROM usr;`, (error,result) => {
        if(error)
            res.end(error);
        var results = {'rows': result.rows};
        res.render('pages/db', results);
    })
    // res.render('pages/db');
})
    
// app.get('/rectangle', (req,res) => res.render('pages/rectangle'))

// app.get('/add', (req,res) => res.render('pages/add'))


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))