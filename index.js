const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:824807@localhost/users"
})
  
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/database', async (req,res)=>{
   try {
       const result = await pool.query(`SELECT * FROM usr`);
       const data = { results : result.rows };
       res.render('pages/db', data);
   }
   catch (error) {
        res.end(error);
   }
    
})
// app.post('/login', (req,res)=>{
//     console.log("post to /login")
//     console.log(req.body)
//     let un = req.body.uname;
//     let pw = req.body.pass;
//     // database?
//     userPasswordQuery = `SELECT * FROM users WHERE name = '${un}'`;
//     res.send("got it!")
// })
// app.get('/t/:id', (req,res)=>{
//     console.log(req.params.id);
//     res.send(`ID: ${req.params.id}`);
// })

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
