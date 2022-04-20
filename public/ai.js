//Do accuracy check
function getAcc(attacker, move, defender){
	//Check accuracy first
	const accStage = attacker.acc - defender.eva
	if(accStage>6){
		accStage = 6
	}
	if(accStage<-6){
		accStage = -6
	}
	let numerator = 3
	let denonimator = 3
	if(accStage<0){
		denonimator = denonimator - accStage
	}
	else if(accStage>0){
		numerator += accStage
	}
	return move.accuracy*(numerator/denonimator)
}

function getBestMove(self, enemy){
	let best = {val: 0, index: 0}
	let KO = false
	for(var i=0; i<self.moves.length; i++){
		if(self.moves[i].power && self.moves[i].power>1){
			const dmg =calc(self, self.moves[i], enemy).dmg
			if(dmg>=enemy.currHP){
				if(self.moves[i].priority>=self.moves[best.index].priority){
					best.val=dmg
					best.index=i
					KO = true
				}
			}	
			else{
				if(dmg>best.val){
					best.val=dmg
					best.index=i
				}
			}		
		}
	}
	return {move: self.moves[best.index], KO: KO}
}

//Determine index of incoming damage
function predictIncomingDamage(self, enemy){
	const movepool = enemy.movepool
	let size = 0	
	let average = 0
	const fearIndex = optimalSTAB(enemy)
	const guaranteed = calc(enemy, movepool[fearIndex], self).dmg

	for(var i=0; i<movepool.length; i++){
		if(movepool[i].power && movepool[i].power>0 && i!=fearIndex){
			let dmg = calc(enemy, movepool[i], self).dmg
			dmg *= getAcc(enemy, movepool[i], self)/100
			average += dmg
			size++
		}		
	}
	return Math.floor(((0.25*guaranteed + (0.75*average/size))/self.currHP)*100)
}

//Let AI decide who to send in next
function getBestSwitch(urParty, enemy, enemyParty){
	let best = {ratio: -1, index: -1}

	for(var i=0; i<urParty.length; i++){
		if(urParty[i].majorStatus!="fainted"){
			const offense = (calc(urParty[i], getBestMove(urParty[i], enemy).move, enemy).dmg/enemy.currHP)*100
			const defense = predictIncomingDamage(urParty[i], enemy)
			//console.log(`${urParty[i].name}: ${Math.floor(offense)}---${Math.floor(defense)}`)
			let ratio = offense/(defense)
			if(best.ratio<ratio){
				best.ratio = ratio
				best.index = i
			}
		}
	}

	if(best.ratio<0){
		return null
	}
	else{
		return best.index
	}
}

//Let the AI pick a move
function decide(difficulty, userCard, targetCard){	
	const user = userCard.pokemon
	const target = targetCard.pokemon
	switch(difficulty){
		case(0):
			return user.moves[rng(0,3)]
			break;
		case(1):
			return getBestMove(user, target).move
			break;	
		case(2):
			const incoming = predictIncomingDamage(user, target)
			const bestMove = getBestMove(user, target)	
			if(bestMove.KO){
				if(user.getStat(5)>target.getStat(5) || bestMove.move.priority>0 || incoming<=70){
					return bestMove.move
				}				
			}
			else{
				if(incoming<=70){

				}
			}
			break;
	}
}