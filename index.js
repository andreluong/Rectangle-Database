const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://lbhaqjebaqqqrq:ca912edc8b8e487db862624233a42da10e8b9236de733d10a94cfb566927bcd7@ec2-50-19-32-96.compute-1.amazonaws.com:5432/d84ut38ktdrhih'
})
  
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))

app.get('/database', (req,res) => {
    // var getUsersQuery = 'SELECT * FROM usr;';
    pool.query(`SELECT * FROM usr;`, (error,result) => {
        if(error) {
            res.end(error);
        }  
        var results = {'rows': result.rows};
        res.render('pages/db', results);
    })
    // res.render('pages/db');
})
    
// app.get('/rectangle', (req,res) => res.render('pages/rectangle'))

// app.get('/add', (req,res) => res.render('pages/add'))


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))