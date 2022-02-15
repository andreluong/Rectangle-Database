function deleteRect() {
    var name = document.getElementById("name");
    pool.query(`delete from rect where name='${name}`)
  }
  