const express = require('express');
const { redirect } = require('express/lib/response');
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
app.get('/database', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * from rect');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      res.send("Error " + err);
    }
})
app.get('/rectangle', (req,res) => res.render('pages/rectangle'))
app.get('/database/:name', (req,res,next) => {
  res.render('pages/rectangle', {output: req.params.name});
})
app.get('/add', (req,res) => res.render('pages/add'))



app.post('/add', async (req,res) => {
  var name = req.body.name;
  var width = req.body.width;
  var height = req.body.height;
  var colour = req.body.colour;

  try {
    const client = await pool.connect();
    await client.query(`INSERT INTO rect VALUES('${name}',${width},${height},'${colour}')`);
    // res.redirect('/database');
    const result = await client.query('SELECT * from rect');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results);
  } catch (err) {
    res.send("Error " + err);
  }
})

// document.getElementById('form').addEventListener('submit', addRect);

// function addRect() {
//     var nameValue = document.querySelector("name").value;
//     var widthValue = document.querySelector("width").value;
//     var heightValue = document.querySelector("height").value;
//     var colourValue = document.querySelector("colour").value;

//     const getAddQuery = `insert into rect values (${nameValue},${widthValue},${heightValue},${colourValue})`
//     console.log("insert into rect values (${nameValue},${widthValue},${heightValue},${colourValue})");
//     pool.query(getAddQuery, (err,res) => {
//         if (error) {
//             res.send("Error " + err);
//         }
//         res.redirect("/database")
//         console.log("rendered pages/db");
//     })
// }




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))