//Ungodly and super complex damage calculation formula
function calc(attacker, move, defender){

	//Sort out relevant stats, potentially abort
	let A
	let B	

	//Store types by index
	const hashTypes=["Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"];
	
	//Store type matchups
	const typeChart=[
		[1, 2, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1],
		[1, 0.5, 1, 1, 0.5, 0.5, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1],
		[1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1],
		[1, 1, 0.5, 0.5, 1, 1, 1, 2, 1, 0.5, 0, 1, 1, 1, 1, 1, 1, 2],
		[1, 2, 2, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 0.5, 1],
		[0.5, 1, 1, 1, 0.5, 1, 1, 0.5, 0, 1, 1, 2, 2, 0.5, 0.5, 2, 2, 1],
		[2, 1, 0.5, 1, 1, 1, 0.5, 1, 1, 2, 1, 2, 1, 1, 1, 0.5, 2, 0.5],
		[2, 1, 1, 0.5, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0.5, 0.5, 1],
		[1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 2, 1, 1, 1],
		[0.5, 1, 0.5, 1, 1, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 2],
		[0.5, 1, 1, 2, 1, 1, 2, 0, 1, 0.5, 1, 1, 1, 2, 1, 2, 2, 1],
		[1, 1, 2, 1, 1, 1, 0.5, 2, 1, 2, 2, 0.5, 1, 1, 1, 1, 0.5, 0.5],
		[1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2, 0.5, 1, 1, 0.5, 1, 0.5, 0, 1],
		[1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1],
		[2, 1, 1, 1, 1, 0.5, 2, 2, 1, 1, 0.5, 2, 1, 1, 1, 1, 0.5, 1],
		[1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 1, 1, 2, 1, 1, 1, 2, 0.5, 0.5],
		[1, 1, 0.5, 1, 1, 1, 2, 1, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 0.5]
	];

	const moveType = move.type
	const aTypes = [attacker.type1, attacker.type2]
	const dTypes = [defender.type1, defender.type2]

	let mods = 1
	let msg = null

	//Effectiveness check
	for(var i=0; i<2; i++){
		if(dTypes[i]!=null){
			mods=mods*typeChart[hashTypes.indexOf(move.type)][hashTypes.indexOf(dTypes[i])]
		}		
	}

	if(mods==0){
		msg = `It doesn't affect ${defender.name}!`
	}
	else if(mods>0 && mods<1){
		msg = "It's not very effective..."
	}
	else if(mods>1){
		msg = "It's super effective!"
	}

	//Category grabber
	if(move.category=="physical"){
		A=attacker.getStat(1)
		D=defender.getStat(2)
		if(attacker.majorStatus.name=="burn"){
			mods*=0.5
		}
	}
	else if(move.category=="special"){
		A=attacker.getStat(3)
		D=defender.getStat(4)
	}	
	else{
		return 0
	}

	//STAB check
	for(var i=0; i<2; i++){
		if(aTypes[i]!=null){
			if(moveType==aTypes[i]){
				mods=mods*1.5
			}
		}
	}

	//Weather and Terrain check
	const weather = field.weather.name
	const terrain = field.terrain.name
	if(weather!="clear"){
		if(weather=="sunny" && moveType=="Fire"){
			mods=mods*1.5
		}
		else if(weather=="rain" && moveType=="Water"){
			mods=mods*1.5
		}
	}
	if(terrain!="clear"){
		if(terrain=="grassy" && moveType=="Grass"){
			mods=mods*1.5
		}
		if(terrain=="psychic" && moveType=="Psychic"){
			mods=mods*1.5
		}
		if(terrain=="electric" && moveType=="Electric"){
			mods=mods*1.5
		}
	}

	//Apply rng
	mods = mods*(rng(85, 100)/100);	

	return {
		dmg: Math.min(Math.floor((((((2*attacker.level/5)+2)*move.power*(A/D))/50)+2)*mods), defender.currHP),
		msg: msg
	}

}

//Write to log
function textLog(message){
	document.getElementById("sideLog").innerHTML+=`<p>${message}</p>`
}

//Kill and determine next action
async function kill(card){
	card.pokemon.majorStatus="fainted"
	const slot = card.pokemon.slot
	const icon = document.getElementById(`pkmn${slot}`)
	icon.classList.remove("switchable")
	icon.classList.remove("active")
	icon.classList.add("fainted")
	icon.removeAttribute("onclick")

	let sprite
	if(slot<7){
		sprite = document.getElementById("pMon")
	}
	else{
		sprite = document.getElementById("oppMon")
	}

	await animate(sprite, "fadeOutDown")	

	textLog(`${card.pokemon.name} fainted!`)

	if(slot>6){		
		const next = getBestSwitch(opponent, activePlayer.pokemon, player)
		if(next==null){
			alert("You win!")
			return
		}
		swap(activeOpponent, opponent[next])
	}
	else{
		let living = 0
		let i = 0
		while(i<player.length && living==0){
			if(player[i].majorStatus!="fainted"){
				living++
			}
		}
		if(living==0){
			alert("You lose!")
		}
	}

}

//Switch Pokemon
function swap(card, newPkmn){
	if(card.pokemon.slot==newPkmn.slot){
		return
	}
	for(var i=0; i<card.pokemon.minorStatus.length; i++){
		if(card.pokemon.minorStatus.name=="trap"){
			textLog(`${card.pokemon.name} can't escape!`)
			return
		}
	}

	card.pokemon.statMods = [0, 0, 0, 0, 0, 0, 0, 0]
	card.pokemon.minorStatus = []
	card.pokemon.majorStatus.active=1
	document.getElementById(`pkmn${card.pokemon.slot}`).classList.remove("active")

	send(newPkmn, newPkmn.slot>6)
}

//Use a move
async function use(user, move, target){
	function statPrint(chance, atk, crd){
		const hash = ["HP", "Attack", "Defense", "Special Attack", "Special Defense", "Speed", "Accuracy", "Evasion"]
		if(rng(1,100)<=chance){
			let direction
			for(var i=1; i<atk.statmods.length; i++){
				direction = atk.statmods[i]
				if(crd.pokemon.statMods[i]+direction>6){
					crd.pokemon.statMods[i]=6
					textLog(`${crd.pokemon.name}'s ${hash[i]} won't go any higher!`)
					direction = null
				}
				if(crd.pokemon.statMods[i]+direction<-6){
					crd.pokemon.statMods[i]=-6
					textLog(`${crd.pokemon.name}'s ${hash[i]} won't go any lower!`)
					direction = null
				}
				else{
					crd.pokemon.statMods[i]+=direction
				}				
				switch(direction){
					case(1):
						textLog(`${crd.pokemon.name}'s ${hash[i]} increased!`)
						crd.update(crd.pokemon)
						break;
					case(2):
						textLog(`${crd.pokemon.name}'s ${hash[i]} increased sharply!`)
						crd.update(crd.pokemon)
						break;
					case(3):
						textLog(`${crd.pokemon.name}'s ${hash[i]} increased drastically!`)
						crd.update(crd.pokemon)
						break;
					case(-1):
						textLog(`${crd.pokemon.name}'s ${hash[i]} decreased!`)
						crd.update(crd.pokemon)
						break;
					case(-2):
						textLog(`${crd.pokemon.name}'s ${hash[i]} decreased harshly!`)
						crd.update(crd.pokemon)
						break;
					case(-3):
						textLog(`${crd.pokemon.name}'s ${hash[i]} decreased severely!`)
						crd.update(crd.pokemon)
						break;
					default:
						break;
				}
			}
		}
	}

	let userCard, targetCard
	if(user.slot<7){
		userCard = activePlayer
		targetCard = activeOpponent
	}
	else{
		userCard = activeOpponent
		targetCard = activePlayer
	}

	let alive = [true, true]

	//Pre-turn checks
	if(user.majorStatus.name=="paralysis"){
		if(rng(1,100)<=25){
			textLog(`${user.name} is paralyzed and can't move!`)
			return alive
		}
	}
	if(user.majorStatus.name=="sleep"){
		if(user.majorStatus.turns>0){
			user.majorStatus.turns--
			textLog(`${user.name} is fast asleep!`)
			return alive
		}
		else{
			user.majorStatus== {name: "healthy", turns: null, active: null}
			userCard.update(user)
			textLog(`${user.name} woke up!`)
		}
	}
	if(user.majorStatus.name=="freeze"){
		if(rng(1,100)>20){
			textLog(`${user.name} is frozen solid!`)
			return alive
		}
		else{
			user.majorStatus== {name: "healthy", turns: null, active: null}
			userCard.update(user)
			textLog(`${user.name} thawed!`)
		}
	}

	//Starting log
	textLog(`${user.name} used ${move.name}!`)	

	if(target.protect){
		textLog(`${target.name} protected itself!`)
		target.protect = false
		return alive
	}	

	//Damaging move
	if(move.category!="status"){

		const accuracy = getAcc(user, move, target)
		let hit
		if(rng(1,100)<=accuracy){
			hit=true
		}
		else{
			hit=false
		}

		if(move.accuracy==null){
			hit=true
		}

		//Delay a little so the text can be read
		await new Promise(resolve => setTimeout(resolve, 900));

		if(!hit){
			textLog(`${target.name} avoided the attack!`)
			return alive
		}
		
		//Damage is done
		let hits = 1
		if(move.hitRange.min){
			if(move.hitRange.min==move.hitRange.max){
				hits = move.hitRange.min
			}
			else{
				const c = rng(1,100)
				if(c<=35){
					hits = 2
				}
				else if(c<=70){
					hits = 3
				}
				else if(c<=85){
					hits = 4
				}
				else{
					hits = 5
				}
			}
		}

		//Execute action		
		let dmgCalc
		let times = 0
		while(hits>0 && alive[1]){
			dmgCalc = calc(user, move, target)	
			if(dmgCalc.dmg==0){
				textLog(dmgCalc.msg)
				return alive
			}	

			//Crit check
			const critVal = move.critStage+user.critStage
			let critRoll = 100
			let crit = false
			switch(critVal){
				case(0):
					critRoll *= 1/24
					break;
				case(1):
					critRoll *= 1/8
					break;
				case(2):
					critRoll *= 1/2
					break;
				default:
					critRoll *= 1
					break;
			}
			if(rng(1,100)<=critRoll){
				crit = true
				dmgCalc.dmg*=1.5
			}

			//Deplete visuals
			alive[1] = await targetCard.changeHP(dmgCalc.dmg, -1)
			
			if(crit){
				textLog("A critical hit!")				
			}

			hits--
			times++
			if(hits>0){
				await new Promise(resolve => setTimeout(resolve, 600));
			}
		}

		if(times>1){
			textLog(`Hit ${times} times!`)
		}

		if(dmgCalc.msg!=null){
			textLog(dmgCalc.msg)
		}

		//Handle the extra nonsense
		const eClass = move.effectClass			
		switch(eClass){
			case("damage+raise"):
				statPrint(move.statChance, move, userCard)
				break;				
			case("damage+lower"):
				if(alive){
					statPrint(move.statChance, move, targetCard)
				}
				break;	
			case("damage+ailment"):		
				if(alive){		
					targetCard.apply(move.ailment.name, move.ailment.chance)
				}
				break;
			case("damage+heal"):
				if(user.currHP!=user.HP){
					await userCard.changeHP(Math.floor(dmgCalc.dmg*(move.drain/100)), 1)
					textLog(`${user.name} restored HP!`)
				}
				break;
			default:
				break;
		}

		if(move.drain<0){			
			alive[0] = await userCard.changeHP(Math.floor(-1*dmgCalc.dmg*(move.drain/100)), -1)
			textLog(`${user.name} was hurt by recoil!`)
		}

		if(!alive[0]){
			kill(userCard)
		}
		if(!alive[1]){
			kill(targetCard)
		}

		return alive
				
	}

	//Status moves
	else{
		//Handle the extra nonsense
		const eClass = move.effectClass
		//unique, force-switch, whole-field-effect, field ffect, swagger, 
		switch(eClass){
			case("net-good-stats"):
				let pos = 0
				let neg = 0
				for(var i=0; i<move.statmods.length; i++){
					if(move.statmods[i]>0){
						pos++
					}
					else if(move.statmods[i]<0){
						neg++
					}
				}
				if(pos>=neg){
					statPrint(101, move, userCard)
				}
				else{
					statPrint(101, move, targetCard)
				}
				break;
			case("heal"):
				if(user.currHP!=user.HP){
					userCard.changeHP(Math.floor(userCard.HP/(move.healing/100)), 1)
					textLog(`${user.name} restored HP!`)
				}
				else{
					textLog(`${user.name}'s HP is already full!`)
				}
				break;
			case("ailment"):
				let ailmentName
				if(move.id==92){
					ailmentName = "toxic"
				}
				else{
					ailmentName = move.ailment.name
				}
				targetCard.apply(ailmentName, 100)
				break;
			case("whole-field-effect"):
				terraform(move.name, true)
				break;
		}

		return alive
	}
}

async function turn(pid){

	//Handle post turn nonsense
	async function postTurn(userCard, otherCard){
		const pkmn = userCard.pokemon	
		const status = pkmn.majorStatus.name 
		let alive = true
		if(status=="poison"){
				alive = await userCard.changeHP(Math.floor(pkmn.HP/8), -1)
				textLog(`${pkmn.name} is hurt by poison!`)
		}
		if(status=="toxic"){
			alive = await userCard.changeHP(Math.floor(pkmn.HP/16)*pkmn.majorStatus.active, -1)
			textLog(`${pkmn.name} is hurt by poison!`)
			pkmn.majorStatus.active++
		}
		if(status=="burn"){
			alive = await userCard.changeHP(Math.floor(pkmn.HP/16), -1)
			textLog(`${pkmn.name} is hurt by its burn!`)
		}
		if(!alive){
			kill(userCard)
			return false
		}
		for(var i=0; i<pkmn.minorStatus.length; i++){
			const affliction = pkmn.minorStatus[i].name			
			if(affliction=="trap"){
				if(pkmn.minorStatus[i].turns==0){
					textLog(`${pkmn.name} was freed from the vortex!`)
					pkmn.minorStatus.splice(i,1)
					i--
				}
				else{
					alive = await userCard.changeHP(Math.floor(pkmn.HP/8), -1)
					textLog(`${pkmn.name} is hurt by the vortex!`)
					pkmn.minorStatus[i].turns--
				}
				
			}
			if(affliction=="leech-seed"){
				alive = await userCard.changeHP(Math.floor(pkmn.HP/8), -1)
				await otherCard.changeHP(Math.min(pkmn.currHP, Math.floor(pkmn.HP/8)), 1)
				textLog(`${pkmn.name}'s health is sapped!`)
			}

			if(!alive){
				kill(userCard)
				return false
			}
			
		}

		return true
	}

	//Determine turn sequence
	textLog(`Turn ${field.turn}`)
	textLog(' ')

	const pMove = activePlayer.pokemon.moves[pid]
	const oMove = decide(aiLevel, activeOpponent, activePlayer)
	let first, second

	if(((pMove.priority==oMove.priority) && (activePlayer.pokemon.getStat(5)>activeOpponent.pokemon.getStat(5))) || pMove.priority>oMove.priority){
		first = {card: activePlayer, move: pMove}
		second = {card: activeOpponent, move: oMove}
	}
	else{
		first = {card: activeOpponent, move: oMove}
		second = {card: activePlayer, move: pMove}
	}

	let alive

	alive = await use(first.card.pokemon, first.move, second.card.pokemon)
	await new Promise(resolve => setTimeout(resolve, 900))

	if(alive[0] && alive[1]){
		firstLives = await use(second.card.pokemon, second.move, first.card.pokemon)
		await new Promise(resolve => setTimeout(resolve, 900))
	}

	if(alive[0]){
		await postTurn(first.card, second.card)
	}
	if(alive[1]){
		await postTurn(second.card, first.card)
	}
	
	field.turn++
	if(field.weather.name!="clear"){
		if(field.weather.duration==0){
			field.weather = {name: "clear", duration: -1}
			textLog("The weather returned to normal!")
		}
		else{
			field.weather.duration--
		}
	}
	if(field.terrain.name!="clear"){
		if(field.terrain.duration==0){
			field.terrain = {name: "clear", duration: -1}
			textLog("The terrain returned to normal!")
		}
		else{
			field.terrain.duration--
		}
	}


	
	textLog('<hr>')
}



