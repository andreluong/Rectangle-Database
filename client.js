const express = require('express');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
var app = express()
  
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/home'))

app.get('/database', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`select * from rect`);
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    res.send(err);
  }
})

app.get('/database/:name', async (req,res) => {
  try {
    var name = req.params.name;
    var selectQuery = `select * from rect where name='${name}'`;

    const client = await pool.connect();
    const result = await client.query(selectQuery);
    const results = {'results': (result) ? result.rows : null};
    res.render('pages/rectangle', results);
    client.release();
  } catch (err) {
    res.send(err);
  }
})

app.post('/database/:name', async (req,res) => {
  var buttonValue = req.body.button;
  var name = req.params.name;

  if (buttonValue == "delete") {
    try {
      const client = await pool.connect();
      await client.query(`delete from rect where name='${name}'`);
      res.redirect('/database');
      client.release();
    } catch (err) {
      res.send(err);
    }
  } else {
    res.redirect(`/edit/${name}`);
  }
})

app.get('/add', (req,res) => res.render('pages/add'))

app.post('/add', async (req,res) => {
  try {
    var name = req.body.name;
    var width = req.body.width;
    var height = req.body.height;
    var colour = req.body.colour;
    var addQuery = `insert into rect values('${name}',${width},${height},'${colour}')`;

    const client = await pool.connect();
    await client.query(addQuery);
    res.redirect(`/database/${name}`);
    client.release();
  } catch (err) {
    res.send(err);
  }
})

app.get('/edit/:name', async (req,res) => {
  try {
    var name = req.params.name;
    var editQuery = `select * from rect where name='${name}'`;

    const client = await pool.connect();
    const result = await client.query(editQuery)
    const results = {'results': (result) ? result.rows : null};
    res.render('pages/edit', results);
    client.release();
  } catch (err) {
    res.send(err);
  }
})

app.post('/edit/:name', async (req,res) => {
  try {
    var oldName = req.params.name;
    var name = req.body.name;
    var width = req.body.width;
    var height = req.body.height;
    var colour = req.body.colour;
    var updateQuery = `update rect set name='${name}', width=${width}
      ,height=${height}, colour='${colour}' where name='${oldName}'`

    const client = await pool.connect();
    await client.query(updateQuery);
    res.redirect('/database');
    client.release();
  } catch (err) {
    res.send(err);
  }
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))