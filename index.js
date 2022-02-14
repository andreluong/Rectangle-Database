const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
  
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))

// app.get('/database', (req,res) => {
//     // var getUsersQuery = 'SELECT * FROM usr;';
//     pool.query(`SELECT * FROM rect;`, (error,result) => {
//         if(error) {
//             res.send(error);
//         }  
//         var results = {'rows': result.rows};
//         res.render('pages/db', results);
//     })
//     // res.render('pages/db');
// })

.get('/database', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * from rect');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })


    
// app.get('/rectangle', (req,res) => res.render('pages/rectangle'))

// app.get('/add', (req,res) => res.render('pages/add'))


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))