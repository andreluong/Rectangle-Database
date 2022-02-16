const express = require('express');
const res = require('express/lib/response');
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
      const result = await client.query(`select * from rect`);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      res.send("Error " + err);
    }
})

app.get('/database/:name', async (req,res) => {
  var name = req.params.name;
  try {
    const client = await pool.connect();
    const result = await client.query(`select * from rect where name='${name}'`)
    const results = {'results': (result) ? result.rows : null};
    res.render('pages/rectangle', results);
  } catch (err) {
    res.send("Error " + err);
  }
})

app.post('/database/:name', async (req,res) => {
  var buttonValue = req.body.button;
  if (buttonValue == "delete") {
    var name = req.params.name;
    try {
      const client = await pool.connect();
      client.query(`delete from rect where name='${name}'`);
      res.redirect('/database');
    } catch (err) {
      res.send("Error " + err);
    }
  } else {
    res.redirect('/edit');
  }
})

app.get('/add', (req,res) => res.render('pages/add'))

app.post('/add', async (req,res) => {
  var name = req.body.name;
  var width = req.body.width;
  var height = req.body.height;
  var colour = req.body.colour;

  try {
    const client = await pool.connect();
    client.query(`insert into rect values('${name}',${width},${height},'${colour}')`);
    res.redirect('/database');
  } catch (err) {
    res.send("Error " + err);
  }
})

app.get('/edit/', async (req,res) => {
  var name = req.params.name;
  try {
    const client = await pool.connect();
    const result = await client.query(`select * from rect where name='${name}'`)
    const results = {'results': (result) ? result.rows : null};
    res.render('pages/edit', results);
  } catch (err) {
    res.send("Error " + err);
  }
})


app.post('/edit', (req,res) => {
  var name = req.body.name;
  var width = req.body.width;
  var height = req.body.height;
  var colour = req.body.colour; 
  res.redirect('/database');
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))