/* EVERYTHING HERE SHOULD ONLY BE RUN ONCE, IF AND ONLY IF THERE IS NO DATABASE DATA*/

//Requirements
const sqlite3 = require("sqlite3").verbose()
const axios = require("axios")

//Function to populate Pokemon data
async function populatePokemon(){
	let iter = 1
	let i = 1	

	while(i<10195){

		//Skip these for now
		const x = i-10000
		if(x==13 || x==14 || x==15 || x==16 || x==17 || x==18 || x==24 || x==26
			 || (x>=33 && x<=85)  || (x>=87 && x<=90) || (x>=93 && x<=99) || (x>=128 && x<=151)
			 || (x>=158 && x<=160) || (x>=181 && x<=183) || (x>=188 && x<=190) || x==116 || x==117
			  || x==121 || x==122 || x==153 || x==154 || x==178 || x==185 || x==187 || x==192
			  || x==120 || x==127 || x==157 || x==177){
			i++
			continue
		}

		const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
		const r = response.data
		let type2 = null
		if(r.types.length>1){
			type2 = r.types[1].type.name
		}
		const id = parseInt(r.species.url.substring(42, r.species.url.length-1))

		await db.run(
			`INSERT INTO pokemon VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[iter, id, r.name, r.types[0].type.name, type2, r.height, r.weight,
			r.stats[0].base_stat, r.stats[1].base_stat, r.stats[2].base_stat, 
			r.stats[3].base_stat, r.stats[4].base_stat, r.stats[5].base_stat, 
			r.stats[0].base_stat+r.stats[1].base_stat+r.stats[2].base_stat+r.stats[3].base_stat+r.stats[4].base_stat+r.stats[5].base_stat,
			r.sprites.front_default, r.sprites.back_default]
			)

		iter++
		i++
		if(i==899){
			i=10001
		}
	}
}

//Function to populate move data (it's a lot)
async function populateMoves(){
	for (var i=1; i<827; i++){
		const response = await axios.get(`https://pokeapi.co/api/v2/move/${i}`)
		const r = response.data
		const changes = [null, null, null, null, null, null, null]
		for(var j=0; j<r.stat_changes.length; j++){
			const val = r.stat_changes[j].change
			switch(r.stat_changes[j].stat.name){
				case("attack"):
					changes[0] = val
					break;
				case("defense"):
					changes[1] = val
					break;
				case("special-attack"):
					changes[2] = val
					break;
				case("special-defense"):
					changes[3] = val
					break;
				case("speed"):
					changes[4] = val
					break;
				case("accuracy"):
					changes[5] = val
					break;
				case("evasion"):
					changes[6] = val
					break;
			}
		}

		await db.run(
			`INSERT INTO moves VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[r.id, r.accuracy, r.effect_chance, r.damage_class.name, r.name, r.power, r.pp, r.priority,
			r.type.name, r.meta.ailment.name, r.meta.ailment_chance, r.meta.category.name, r.meta.crit_rate,
			r.meta.drain, r.meta.flinch_chance, r.meta.healing, r.meta.max_hits, r.meta.max_turns,
			r.meta.min_hits, r.meta.min_turns, r.meta.stat_chance, changes[0], changes[1], changes[2],
			changes[3], changes[4], changes[5], changes[6], r.target.name]
		)
	}	
}

//Get Pokemon-Move Relationships
async function makePools(){
	let i = 1
	let iter = 1
	while(i<10195){
		const x = i-10000
		if(x==13 || x==14 || x==15 || x==16 || x==17 || x==18 || x==24 || x==26
			 || (x>=33 && x<=85)  || (x>=87 && x<=90) || (x>=93 && x<=99) || (x>=128 && x<=151)
			 || (x>=158 && x<=160) || (x>=181 && x<=183) || (x>=188 && x<=190) || x==116 || x==117
			  || x==121 || x==122 || x==153 || x==154 || x==178 || x==185 || x==187 || x==192
			  || x==120 || x==127 || x==157 || x==177){
			i++
			continue
		}
		const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
		const moves = response.data.moves
		for(var j=0; j<moves.length; j++){
			const m_id = parseInt(moves[j].move.url.substring(31, moves[j].move.url.length-1))
			await db.run(`INSERT INTO movepools VALUES (?, ?)`, [iter, m_id])
		}
		iter++
		i++
		if(i==899){
			i=10001
		}

	}
}

/////////// Actual Database Inserts Begin Here /////////////////////////////

//Create Database
let db = new sqlite3.Database("./db/Pokedex.db", (err)=>{
	if(err){
		console.log(`Error creating Pokedex Database: ${err}`)
	}
});

//Create tables
db.serialize(()=>{
	db.run(`CREATE TABLE pokemon(
			id INTEGER PRIMARY KEY,
			species INTEGER,
			name TEXT,
			type1 TEXT,
			type2 TEXT,
			height REAL,
			weight REAL,
			hp INTEGER,
			atk INTEGER,
			def INTEGER,
			spatk INTEGER,
			spdef INTEGER,
			speed INTEGER,
			bst INTEGER,
			front TEXT,
			back TEXT
			)`, err => {
				if(err){console.log(err)}
			})

	db.run(`CREATE TABLE moves(
			id INTEGER PRIMARY KEY,
			accuracy INTEGER,
			effect_chance INTEGER,
			damage_class TEXT,
			name TEXT,
			power INTEGER,
			pp INTEGER,
			priority INTEGER,
			type TEXT,
			ailment TEXT,
			ailment_chance INTEGER,
			category TEXT,
			crit_rate INTEGER,
			drain INTEGER,
			flinch_chance INTEGER,
			healing INTEGER,
			max_hits INTEGER,
			max_turns INTEGER,
			min_hits INTEGER,
			min_turns INTEGER,
			stat_chance INTEGER,
			atk_chance INTEGER,
			def_chance INTEGER,
			spatk_chance INTEGER,
			spdef_chance INTEGER,
			speed_chance INTEGER,
			accuracy_chance INTEGER,
			evasion_chance INTEGER,
			target TEXT
			)`, err => {
				if(err){console.log(err)}
			})

	db.run(`CREATE TABLE movepools(
			pokemon_id INTEGER,
			move_id INTEGER,
			PRIMARY KEY (pokemon_id, move_id),
			FOREIGN KEY (pokemon_id)
				REFERENCES pokemon (id)
				ON DELETE CASCADE
			FOREIGN KEY (move_id)
				REFERENCES moves (id)
				ON DELETE CASCADE
			)`, err => {
				if(err){console.log(err)}
			})

	populatePokemon().then(populateMoves()).then(makePools())
	.catch(err=>{console.log(`Error populating tables: ${err}`)})
})





