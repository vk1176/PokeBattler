//Managing Functions

//Keep everything sized right
document.getElementById("info").style.height = `${window.innerHeight - document.getElementById("battleScreen").offsetHeight}px`
      
window.addEventListener("resize", ()=>{
		document.getElementById("info").style.height = `${window.innerHeight - document.getElementById("battleScreen").offsetHeight}px`
}); 

//Generate Home Image
function homeImage(){
	axios.get(`http://localhost:8080/pokemon?id=${rng(1,898)}`).then(pkmn=>{
		const area = document.getElementById("homeIcon")
		animate(area, "fadeOutLeft").then(()=>{
			area.innerHTML = `<img id='mainPokemon' onClick='homeImage()' src="${pkmn.data.front}">`
			clearAnimation(area, "fadeOutLeft")
		})
	})
}
homeImage()

//Manage tip section
function changeTips(){
	const index = rng(1, tips.length)
	const tip = document.getElementById("tip")
	animate(tip, "fadeOutLeft").then(()=>{
		tip.innerHTML=tips[index]
		clearAnimation(tip, "fadeOutLeft")
	})
	
}
changeTips()
///////////////////// GAME LOOP BEGINS HERE ////////////////////////////////////


//Try to load saved data
let field = JSON.parse(localStorage.getItem("field"))
let playerSave = JSON.parse(localStorage.getItem("playerSave")) 
let opponentSave = JSON.parse(localStorage.getItem("opponentSave")) 

let player = []
let opponent = []

let activePlayer
let activeOpponent

let aiLevel 

//Load saved data or generate new depending on player input
function begin(load){
	if(load==false || field==null){	
		localStorage.clear()

		const buttons = document.getElementsByName("difficulty")
		for(var i=0; i<buttons.length; i++){
			if(buttons[i].checked){
				aiLevel = Number(buttons[i].value)			
			}
		}
		let gender
		if(rng(1,2)==1){
			gender="f"
		}
		else{
			gender="m"
		}
		if(aiLevel==4){
			gender="m"
		}

		field={
			ai: {level: aiLevel, gender: gender},
			bg: rng(1, 34),
			turn: 1,
			weather: {name: "clear", duration: -1},
			terrain: {name: "clear", duration: -1},
			trickRoom: -1,
			playerSide: {
				active: 0,
				reflect: -1,
				lightScreen: -1,
				spikes: false,
				toxicSpikes: false,
				stealthRock: false,
				stickyWeb: false,
				steelSpike: false
			},
			opponentSide: {
				active: 0,
				reflect: -1,
				lightScreen: -1,
				spikes: false,
				toxicSpikes: false,
				stealthRock: false,
				stickyWeb: false,
				steelSpike: false
			}
		}

		playerSave = []
		opponentSave = []
	}
	else{
		aiLevel = field.ai.level
	}	

	//Loading things
	document.getElementById("bg").style.backgroundImage = `url("assets/bgs/${field.bg}.jpg")`
	document.getElementById("enemyTrainer").innerHTML = `<img class="person" src="assets/trainers/${field.ai.level}_ai_${field.ai.gender}.png"/>`
	download(playerSave, opponentSave).then(()=>{

		//Show player team
		for(var i=0; i<player.length; i++){
			reveal(player[i], player[i].slot)
		}	

		//Show necessary opponents
		reveal(opponent[0], 1)
		for(var i=1; i<opponent.length; i++){
			if(opponent[i].revealed){
				reveal(opponent[i], opponent[i].slot)
			}
		}

		send(player[field.playerSide.active], false)
		send(opponent[field.opponentSide.active], true)

		//Get field back to previous status
		if(field.weather.name!="clear"){
			terraform(field.weather.name)
		}
		if(field.terrain.name!="clear"){
			terraform(field.terrain.name)
		}
	
		document.getElementById("home").classList.add("animated", "fadeOutLeft")
		
	});
}
