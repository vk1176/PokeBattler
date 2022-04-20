const sqlite3 = require("sqlite3").verbose()
const axios = require("axios")
const express = require("express")
const app = express()

//Serve static files
app.use(express.static("public"))

//Route to obtain a single Pokemon's data
app.get("/pokemon", async function(req, res){
	let db = await new sqlite3.Database("./db/Pokedex.db", sqlite3.OPEN_READONLY)
	let sql = `SELECT * FROM pokemon WHERE id = ?`;
	db.get(sql, [req.query.id], (err, row)=>{
		return res.json(row)
	})
	db.close()
})

//Route to return a movepool
app.get("/movepool", async function(req, res){
	let db = await new sqlite3.Database("./db/Pokedex.db", sqlite3.OPEN_READONLY)
	let sql = `SELECT * FROM moves 
			   INNER JOIN movepools 
			   ON moves.id = movepools.move_id 
			   WHERE movepools.pokemon_id = ?`;
	db.all(sql, [req.query.id], (err, rows)=>{
		return res.json(rows)
	})
	db.close()
})

app.listen(8080, ()=>{console.log("Server working.")})

