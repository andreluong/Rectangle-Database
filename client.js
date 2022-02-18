const express = require('express');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
var index = 1;
var app = express();
  
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/home'));

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
});

app.get('/database/:id', async (req,res) => {
  try {
    var id = req.params.id;
    var selectQuery = `select * from rect where id=${id}`;

    const client = await pool.connect();
    const result = await client.query(selectQuery);
    const results = {'results': (result) ? result.rows : null};
    res.render('pages/rectangle', results);
    client.release();
  } catch (err) {
    res.send(err);
  }
});

app.post('/database/:id', async (req,res) => {
  var buttonValue = req.body.button;
  var id = req.params.id;

  if (buttonValue == "delete") {
    try {
      const client = await pool.connect();
      await client.query(`delete from rect where id=${id}`);
      res.redirect('/database');
      client.release();
    } catch (err) {
      res.send(err);
    }
  } else {
    res.redirect(`/edit/${id}`);
  }
});

app.get('/add', (req,res) => res.render('pages/add'));

app.post('/add', async (req,res) => {
  try {
    var name = req.body.name;
    var width = req.body.width;
    var height = req.body.height;
    var colour = req.body.colour;
    var addQuery = `insert into rect values('${name}',${width},${height},'${colour}', ${index})`;
    const client = await pool.connect();
    await client.query(addQuery);
    index++;
    res.redirect('/database');
    client.release();
  } catch (err) {
    res.send(err);
  }
});

app.get('/edit/:id', async (req,res) => {
  try {
    var id = req.params.id;
    var editQuery = `select * from rect where id=${id}`;

    const client = await pool.connect();
    const result = await client.query(editQuery)
    const results = {'results': (result) ? result.rows : null};
    res.render('pages/edit', results);
    client.release();
  } catch (err) {
    res.send(err);
  }
});

app.post('/edit/:id', async (req,res) => {
  try {
    var oldId = req.params.id;
    var newId = index;
    var name = req.body.name;
    var width = req.body.width;
    var height = req.body.height;
    var colour = req.body.colour;
    var updateQuery = `update rect set name='${name}', width=${width}
      ,height=${height}, colour='${colour}' id=${newId} where id=${oldId}`

    const client = await pool.connect();
    await client.query(updateQuery);
    index++;
    res.redirect(`/database/${oldId}`);
    client.release();
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));