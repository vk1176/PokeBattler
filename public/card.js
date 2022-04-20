//Card component
function Card(id){

	//Base id
	this.root = document.getElementById(id)

	//Properties
  this.findColor = function(p){
    if(p>=50){
      return "#31D680"
    }
    if(p<50 && p>20){
      return "#D8A52D"   
    }
    else if(p<20){
      return "#D82D2D"
    }
    else if(p<1){
      return "transparent"
    }
  }

	this.update = function(pkmn){
		this.pokemon = pkmn	
		this.name = pkmn.name
    this.status = pkmn.majorStatus.name
		this.level = `Lv: ${pkmn.level}`
		this.types = `<img class="cardtypeicons type" src="assets/icons/${pkmn.type1}.webp">`
		if(pkmn.type2!=null){
			this.types += `<img class="cardtypeicons type" src="assets/icons/${pkmn.type2}.webp">`
		}
		this.percent = Math.floor((pkmn.currHP/pkmn.HP)*100)
    this.color = this.findColor(this.percent)
		this.statDisplay = [`${pkmn.currHP}/${pkmn.HP}`]
		for(var i=1; i<pkmn.stats.length; i++){
      let bg, text
      let weight = "normal"
      const modifier = pkmn.statMods[i]
      if(modifier>=6 || modifier<=-6){
        weight = "bold"
      }
      if(modifier>0){
        bg = `rgb(24, 168, 27, ${0.166*Math.abs(modifier)})`
      }
      else if(modifier==0){
        bg = `rgb(30, 29, 35, 1)`
      }
      else{
        bg = `rgb(169, 5, 15, ${0.166*Math.abs(modifier)})`
      }
			this.statDisplay.push({stat: pkmn.getStat(i), bg: bg, weight: weight})
		}
		this.render()
	}
	
	this.render = function(){
		this.root.innerHTML = (			
              `<div class="cardtop">
                  <div class ="cardName">${this.name}</div>
                  <div class = "level">${this.level}</div>
                  <div class = "status"><img class="status" src="assets/icons/status/${this.status}.png"/></div>
                  <div class="cardtypes">${this.types}</div>
              </div>  
              <hr id="cardbreak">
              <div class="cardmiddle" style="width: ${this.percent}%; background-color: ${this.color}">
              </div>
              <div class="cardbottom">
                <div class="statChange hpBox">
                  <p>HP</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[0]}</p>
                </div>
                <div class="statChange" style="background-color: ${this.statDisplay[1].bg}; font-weight: ${this.statDisplay[1].weight}">
                  <p>Atk</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[1].stat}</p>
                </div>
                <div class="statChange" style="background-color: ${this.statDisplay[2].bg}; font-weight: ${this.statDisplay[2].weight}">
                  <p>Def</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[2].stat}</p>
                </div>
                <div class="statChange" style="background-color: ${this.statDisplay[3].bg}; font-weight: ${this.statDisplay[3].weight}">
                  <p>Sp.Atk</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[3].stat}</p>
                </div>
                <div class="statChange" style="background-color: ${this.statDisplay[4].bg}; font-weight: ${this.statDisplay[4].weight}">
                  <p>Sp.Def</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[4].stat}</p>
                </div>
                <div class="statChange" style="background-color: ${this.statDisplay[5].bg}; font-weight: ${this.statDisplay[5].weight}">
                  <p>Speed</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[5].stat}</p>
                </div>
                <div class="statChange" style="background-color: ${this.statDisplay[6].bg}; font-weight: ${this.statDisplay[6].weight}">
                  <p>Acc</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[6].stat}</p>
                </div>
                <div class="statChange" style="background-color: ${this.statDisplay[7].bg}; font-weight: ${this.statDisplay[7].weight}">
                  <p>Eva</p>
                  <hr class="statbreak">
                  <p class="stat">${this.statDisplay[7].stat}</p>
                </div>
              </div>`)
	}

  this.changeHP = async function(change, i){
    while(change>0 && !(i>0 && this.pokemon.currHP==this.pokemon.HP)){      
      await new Promise(resolve => setTimeout(resolve, 5));
      this.pokemon.currHP+=i
      this.statDisplay[0] = `${this.pokemon.currHP}/${this.pokemon.HP}`
      this.percent = ((this.pokemon.currHP/this.pokemon.HP)*100)
      this.color = this.findColor(this.percent)
      this.render()
      if(this.pokemon.currHP==0){
        return false
      }
      change--
    }
    return true
  }

  this.apply = function(affliction, chance){
    function checkExceptions(pkmn, affliction){      
      const type1 = pkmn.type1
      const type2 = pkmn.type2
      if(affliction=="toxic" || affliction =="poison"){
        if(type1=="Poison" || type1=="Steel" || type2=="Poison" || type2=="Steel"){
          return true
        }
      }
      if(affliction=="burn"){
        if(type1=="Fire" || type2=="Fire"){
          return true
        }
      }
      if(affliction=="paralysis"){
        if(type1=="Electric" || type2=="Electric"){
          return true
        }
      }
      if(affliction="freeze"){
        if(type1=="Ice" || type2=="Ice"){
          return true
        }
      }
      if(affliction="trap"){
        if(type1=="Ghost" || type2=="Ghost"){
          return true
        }
      }
      if(affliction="leech-seed"){
        if(type1=="Grass" || type2=="Grass"){
          return true
        }
      }
      return false
    }

    const hash = ["toxic", "poison", "burn", "freeze", "paralysis", "sleep", "confusion", "trap", "leech-seed"]
    const index = hash.indexOf(affliction)
    const roll = rng(1, 100)
    if(roll>chance){
      return
    }
    else{
      if(index<6 && this.pokemon.majorStatus.name!="healthy"){
        return
      }
      if(checkExceptions(this.pokemon, affliction)==true){
        textLog(`It doesn't affect ${this.pokemon.name}!`)
        return
      }
      let msg
      switch(affliction){
        case("toxic"):
          this.pokemon.majorStatus = {name: affliction, turns: null, active: 1}
          msg = "was badly poisoned!"
          break;
        case("poison"):
          this.pokemon.majorStatus = {name: affliction, turns: null, active: null}
          msg = "was poisoned!"
          break;
        case("burn"):
          this.pokemon.majorStatus = {name: affliction, turns: null, active: null}
          msg = "was burned!"
          break;
        case("freeze"):
          this.pokemon.majorStatus = {name: affliction, turns: null, active: null}
          msg = "was frozen solid!"
          break;
        case("sleep"):
          this.pokemon.majorStatus = {name: affliction, turns: rng(1,3), active: null}
          msg = "fell asleep!"
          break;
        case("paralysis"):
          this.pokemon.majorStatus = {name: affliction, turns: null, active: null}
          msg = "was paralyzed!"
          break;
        case("confusion"):
          this.pokemon.minorStatus.push({name: affliction, turns: rng(2,5)})
          msg = "was confused!"
          break;
        case("trap"):
          this.pokemon.minorStatus.push({name: affliction, turns: rng(2,5)})
          msg = "was trapped!"
          break;
        case("leech-seed"):
          this.pokemon.minorStatus.push({name: affliction, turns: null})
          msg = "was seeded!"
          break;
      }

      this.update(this.pokemon)
      textLog(`${this.pokemon.name} ${msg}`)
      
    }
  }
}