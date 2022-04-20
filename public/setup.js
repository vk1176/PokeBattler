//Pokemon object
function Pokemon(id, name, type1, type2, statList, weight, front, back, revealed){

	//Input that can be stored directly
	this.id = id
	name = format(name)
	if(name.indexOf("Mime")<0 && name.indexOf("Tapu")<0 && name.indexOf("Null")<0 && name.indexOf("oh")<0 && name.indexOf(" ")>-1){
		this.name = name.substring(0, name.indexOf(" "))
	}
	else{
		this.name = name
	}
	this.weight = weight
	this.majorStatus = {name: "healthy", turns: null, active: null}
	this.minorStatus = []
	this.statMods = [0, 0, 0, 0, 0, 0, 0, 0]
	this.revealed = revealed
	this.critStage = 0
	this.moves = []
	this.movepool = []
	this.protect = false

	this.slot = -1

	this.front = front || "assets/icons/sub_front.png"
	this.back = back || "assets/icons/sub_back.png"

	this.party = front

	//Input that needs a little processing

	//Types
	this.type1 = format(type1)
	if(type2){
		this.type2 = format(type2)
	}
	else{
		this.type2 = null
	}

	//Stat nonsense
	const baseStats = statList
	let bst = 0
	for(var i=0; i<baseStats.length; i++){
		bst+=baseStats[i]
	}	
	

	//Level assignment
	if(bst<=319){
		this.level=88+rng(0, 5)
	}
	else if(bst<=455){
		this.level=79+rng(0, 4)
	}
	else if(bst<=525){
		this.level=73+rng(0, 3)
	}
	else{
		this.level=70+rng(0, 2)
	}

	//EVs, IVs, Nature
	const ivs = [rng(0, 31), rng(0, 31), rng(0, 31), rng(0, 31), rng(0, 31), rng(0, 31)]
	const evs = [0, 0, 0, 0, 0, 0]

	const max = baseStats.indexOf(Math.max(baseStats[0], baseStats[1], baseStats[2], baseStats[3], baseStats[4], baseStats[5]))
	evs[max]=252

	let otherMax = rng(0, 5)
	while(otherMax==max){
		otherMax=rng(0,5)
	}
	evs[otherMax]=252

	const nature = [1, 1, 1, 1, 1, 1]
	const beneficial = rng(1, 5)
	let hindering = rng(1, 5)
	while(hindering==beneficial){
		hindering = rng(1, 5)
	}
	nature[beneficial] = 1.2
	nature[hindering] = 0.8

	//Final stat nonsense
	const stats = [-1, -1, -1, -1, -1, -1]
	stats[0] = Math.floor((((2*baseStats[0]+ivs[0]+evs[0]/4)*this.level)/100)+this.level+10)
	for(var i=1; i<6; i++){
		stats[i]=Math.floor((((2*baseStats[i]+ivs[i]+evs[i]/4)*this.level)/100)+5*nature[i])
	}

	this.stats = stats
	if(id==292){
		this.HP = 1
		stats[0] = 1
	}
	else{
		this.HP = stats[0]
	}
	this.currHP = stats[0]
	this.atk = stats[1]
	this.def = stats[2]
	this.spatk = stats[3]
	this.spdef = stats[4]
	this.spd = stats[5]

	this.acc = 1
	this.eva = 1

	stats.push(this.acc)
	stats.push(this.eva)

	this.preMove = {
		chance: [],
		msg: []
	}

	this.update = function(){
		this.summary = {
			id: this.id,
			level: this.level,
			stats: this.stats,
			ability: this.ability,
			moves: [this.moves[0].id, this.moves[1].id, this.moves[2].id, this.moves[3].id],
			currHP: this.currHP, 
			revealed: this.revealed,
			statMods: this.statMods,
			majorStatus: this.majorStatus,
		}
	}

	this.getStat = function(index){
		let numerator 
		let denominator
		if(index>5){
			numerator = 3
			denominator = 3
		}
		else{
			numerator = 2
			denominator = 2
		}		
		const mods = this.statMods[index]
		if(mods>0){
			numerator+=mods
		}
		else if(mods<0){
			denominator = denominator-mods
		}

		const final = this.stats[index]*(numerator/denominator)
		if(index>5){
			return Math.floor(final*100)/100
		}
		else{
			if(this.majorStatus.name=="paralysis" && index==5){
				return Math.floor(final/2)
			}
			else{
				return Math.floor(final)
			}
			
		}
	}	
}
//Move object
function Move(id, name, type, category, effectClass, pp, priority, power, accuracy, statChance, critStage, 
	drain, healing, ailment, hitRange, turnRange, flinch, statmods){

	//Direct saves
	this.id=id
	if(name.indexOf("wisp")>=0){
		this.name = "Will-O-Wisp"
	}
	else{
		this.name = format(name)
	}

	this.type=format(type)
	this.category=category
	this.effectClass =effectClass
	this.pp=pp
	this.priority=priority
	this.power=power || null
	this.accuracy=accuracy || null
	this.statChance = statChance
	this.critStage = critStage
	this.drain = drain
	this.healing = healing
	this.ailment = ailment
	this.hitRange = hitRange
	this.turnRange = turnRange
	this.flinch = flinch
	this.recharging = false
	this.needsAnotherTurn = false
	
	//Always check to see what the API you commit to using can do before getting this far
	if(id==307 || id==795 || id==338 || id==416 || id==308 || id==63 || id==794 || id==711 || id==459 || id==439){
		this.willRecharge = true
	}
	if(id==553 || id==601 || id==554 || id==800 || id==566 || id==13 || id==467 || id==143 || id==76 || id==669){
		this.needsAnotherTurn = true
	}
	
	this.statmods = statmods

}
//Animation Manager
async function animate(element, animation){
	await new Promise((resolve, reject)=>{

		//Call this when animation ends to resolve
		function endAnimation(event){
			event.stopPropagation()
			resolve(true)
		}

		//Actual promise body; animate, then end
		element.classList.add("animated", animation)
		element.addEventListener("animationend", endAnimation, {once: true})
	})
}
function clearAnimation(element, animation){
	element.classList.remove("animated", animation)
}

//Generate number between inputs, inclusive
function rng(min, max){
	return Math.floor(Math.random()*(max-min+1)+min)
}

//Make given string into respectable format
function format(s){
	s = s.replace("-", " ")
	const words = s.split(" ")

	for(let i=0; i<words.length; i++){
		words[i] = words[i][0].toUpperCase()+words[i].substring(1)
	}

	return words.join(" ")
}

//Unveil Pokemon's party slot.
//Called for all player's Pokemon and first time each opponent is revealed
function reveal(pokemon, index){
	const slot = document.getElementById(`pkmn${pokemon.slot}`)
	slot.innerHTML = `<img class = "partyIcon" src= "${pokemon.party}"/>`
	slot.className = "knownIcon"
	pokemon.revealed = true
	if(pokemon.majorStatus=="fainted"){
		slot.classList.add("fainted")
		slot.removeAttribute("onclick")
	}
	else if(pokemon.slot<7){
		slot.classList.add("switchable")
	}
		
}
//Generate move buttons
function makeMoves(pkmn){
	function content(area, moves){
		return `<div onclick="turn(0)" class="move ${area}" id="${area}1"><div id='moveText'>${moves[0].name}</div><img id='moveType' class = "type" src="assets/icons/${moves[0].type}.webp"/></div>
				    <div onclick="turn(1)" class="move ${area}" id="${area}2"><div id='moveText'>${moves[1].name}</div><img id='moveType' class = "type" src="assets/icons/${moves[1].type}.webp"/></div>
				    <div onclick="turn(2)" class="move ${area}" id="${area}3"><div id='moveText'>${moves[2].name}</div><img id='moveType' class = "type" src="assets/icons/${moves[2].type}.webp"/></div>
				    <div onclick="turn(3)" class="move ${area}" id="${area}4"><div id='moveText'>${moves[3].name}</div><img id='moveType' class = "type" src="assets/icons/${moves[3].type}.webp"/></div>`
	}
	const m = []
	for(var i=0; i<pkmn.moves.length; i++){	
		m.push({name: pkmn.moves[i].name, type: pkmn.moves[i].type})	
	}
    
	document.getElementById("buttBox").innerHTML = content("bmove", m)
	document.getElementById("otherButtBox").innerHTML = content("smove", m)
}

//Send out a pokemon
function send(pkmn, cpu){
	let sprite

	if(cpu==false){		
		sprite = document.getElementById("pMon")
		clearAnimation(sprite, "fadeOutDown")
		sprite.innerHTML = `<img class="sprite" src= "${pkmn.back}"/>`
		activePlayer = new Card("pcard")
		activePlayer.update(pkmn)
		field.playerSide.active = pkmn.slot-1
		makeMoves(pkmn)
	}
	else{		
		sprite = document.getElementById("oppMon")
		clearAnimation(sprite, "fadeOutDown")		
		sprite.innerHTML = `<img class="sprite" src= "${pkmn.front}"/>`
		activeOpponent = new Card("oppcard")
		activeOpponent.update(pkmn)
		field.opponentSide.active = pkmn.slot-7
	}

	document.getElementById(`pkmn${pkmn.slot}`).classList.add("active")
	document.getElementById(`pkmn${pkmn.slot}`).classList.remove("unknownIcon")
	document.getElementById(`pkmn${pkmn.slot}`).classList.remove("knownIcon")
	document.getElementById(`pkmn${pkmn.slot}`).classList.add("knownIcon")
	document.getElementById(`pkmn${pkmn.slot}`).innerHTML = `<img class="partyIcon" src= "${pkmn.front}"/>`

}



//Return Pokemons' best damaging move
function optimalSTAB(pkmn){
	let best = {ratio: -1, index: -1}
	let category
	if(pkmn.atk>pkmn.spatk){
		category="physical"
	}
	else{
		category="special"
	}
	for(var i=0; i<pkmn.movepool.length; i++){
		const thisMove = pkmn.movepool[i]
		if(thisMove.category==category && (thisMove.type==pkmn.type1 || thisMove.type==pkmn.type2) && thisMove.power>1){
			let r = thisMove.power*(thisMove.accuracy/100)
			if(thisMove.needsAnotherTurn || thisMove.willRecharge){
				r*=0.5
			}
			if(r>best.ratio){
				best.ratio=r
				best.index=i
			}
		}
	}
	if(best.ratio<0){
		console.log(pkmn.name)
		return null
	}
	else{
		return best.index
	}
	
}

//Manage field conditions
function terraform(effect, replace){
	let name
	let weather
	let msg

	if(effect.toLowerCase().indexOf("sunny")>-1){
		name = "sunny"
		weather = true
		msg = "The sunlight became strong!"
	}
	if(effect.toLowerCase().indexOf("rain")>-1){
		name = "rain"
		weather = true
		msg = "It started to rain!"
	}
	if(effect.toLowerCase().indexOf("sandstorm")>-1){
		name = "sandstorm"
		weather = true
		msg = "A sandstorm kicked up!"
	}
	if(effect.toLowerCase().indexOf("hail")>-1){
		name = "hail"
		weather = true
		msg = "It started to hail!"
	}
	if(effect.toLowerCase().indexOf("psychic")>-1){
		name = "psychic"
		weather = false
		msg = "The battlefield got weird!"
	}
	if(effect.toLowerCase().indexOf("electric")>-1){
		name = "electric"
		weather = false
		msg = "Electricity surges across the battlefield!"
	}
	if(effect.toLowerCase().indexOf("grassy")>-1){
		name = "grassy"
		weather = false
		msg = "The battlefield is covered in grass!"
	}
	if(effect.toLowerCase().indexOf("misty")>-1){
		name = "misty"
		weather = false
		msg = "Mist swirled around the battlefield!"
	}
	
	if(replace){
		if(weather){
			field.weather = {name: name, duration: 5}
		}
		else{
			field.terrain = {name: name, duration: 5}
		}
		console.log(field)
	}

	textLog(msg)
}

//Set up other field stuff
function set(effect){

}

//Make a Pokemon from data


//Fetch api data for Pokemon
async function pokeGen(summary){

	//Actually get the Pokemon data
	async function makePokemon(id){
		async function getPokemon(id){
			const response = await axios.get(`http://localhost:8080/pokemon?id=${id}`)
			return response.data
		}
		async function getMovepool(id){
			const response = await axios.get(`http://localhost:8080/movepool?id=${id}`)
			return response.data
		}
		let r = await getPokemon(id)
		let pokemon = await new Pokemon(r.id, r.name, r.type1, r.type2, [r.hp, r.atk, r.def, r.spatk, r.spdef, r.speed], r.weight, r.front, r.back, false) 
		let pool = await getMovepool(id)
		for(var i=0; i<pool.length; i++){
			const m = await new Move(pool[i].id, pool[i].name, pool[i].type, pool[i].damage_class,
				pool[i].category, pool[i].pp, pool[i].priority, pool[i].power, pool[i].accuracy, pool[i].stat_chance, pool[i].crit_rate, 
				pool[i].drain, pool[i].healing, {name: pool[i].ailment, chance: pool[i].ailment_chance}, 
				{min: pool[i].min_hits, max: pool[i].max_hits}, {min: pool[i].min_turns, max: pool[i].max_turns}, 
				pool[i].flinch_chance, [0, pool[i].atk_chance, 
				pool[i].def_chance, pool[i].spatk_chance, pool[i].spdef_chance, pool[i].speed_chance, 
				pool[i].accuracy_chance, pool[i].evasion_chance])
			pokemon.movepool.push(m)
		}
		return pokemon
	}

	//Begin loading or generating new data
	let id
	let revealed 
	if(summary==null){
		const notAllowed = [374, 412, 268, 10, 415, 790, 789, 132, 14, 401, 129, 11, 664, 266, 235, 602, 201, 13, 265]
		while(id==null || notAllowed.indexOf(id)>-1){
			id = rng(1, 807)
		}
		revealed = false
	}
	else{
		id = summary.id
		revealed = summary.revealed
	}

	//Make Pokemon for real, set up moveset
	const currPoke = await makePokemon(id)
	let currMoves = []	

	//Generate new moveset
	if(summary==null){ 		
		const picked = []
		const best = optimalSTAB(currPoke)		
		picked.push(currPoke.movepool[best].id)
		currMoves.push(currPoke.movepool[best])
		for(var i=0; i<3; i++){
			let moveIndex = rng(0, currPoke.movepool.length-1)			
			let candidate = currPoke.movepool[moveIndex]
			while(picked.indexOf(candidate.id)>=0 || banlist[candidate.id]<1){
				moveIndex = rng(0, currPoke.movepool.length-1)
			    candidate = currPoke.movepool[moveIndex]
			}

			picked.push(candidate.id)
			currMoves.push(candidate)
		}
		currPoke.moves = currMoves
	}

	//Replace default data with stored data
	else{
		for(var i=0; i<summary.moves.length; i++){	
			let found = false 	
			for(var j=0; j<currPoke.movepool.length && !found; j++){
				if(currPoke.movepool[j].id==summary.moves[i]){
					currMoves.push(currPoke.movepool[j])
					found=true
				}
			}			
		}
		currPoke.id = summary.id
		currPoke.level = summary.level
		currPoke.stats = summary.stats
		currPoke.HP = summary.stats[0]
		currPoke.ability = summary.ability
		currPoke.moves = currMoves
		currPoke.currHP = summary.currHP
		currPoke.statMods = summary.statMods
		currPoke.majorStatus = summary.majorStatus
	}
	return currPoke	
}

//Load all Pokemon data for real
async function download(playerSave, opponentSave){
	let pokemon
	let summary	
	for(var i=0; i<12; i++){		
		if(i<6){
			summary = playerSave[i] || null
			pokemon = await(pokeGen(summary))
			pokemon.slot = i+1
			player.push(pokemon)
		}
		else{
			summary = opponentSave[i-6] || null
			pokemon = await(pokeGen(summary))
			pokemon.slot = i+1
			opponent.push(pokemon)
		}
	}

	return
}

//Save data to storage
function save(){
	for(var i=0; i<player.length; i++){
		player[i].update()
		playerSave[i] = player[i].summary
	}
	for(var i=0; i<opponent.length; i++){
		opponent[i].update()
		opponentSave[i] = opponent[i].summary
	}
	localStorage.setItem("playerSave", JSON.stringify(playerSave))
	localStorage.setItem("opponentSave", JSON.stringify(opponentSave))
	localStorage.setItem("field", JSON.stringify(field))
}